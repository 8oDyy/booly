import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/types/supabase';

export default defineEventHandler(async (event) => {
  try {
    // Vérifier que la clé Stripe est configurée
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_votreclésecrete') {
      console.error('Erreur: Clé API Stripe non configurée ou invalide');
      return createError({
        statusCode: 500,
        message: 'Configuration Stripe manquante. Vérifiez le fichier .env'
      });
    }
    
    if (!webhookSecret || webhookSecret === 'whsec_votrecléwebhook') {
      console.error('Erreur: Clé webhook Stripe non configurée ou invalide');
      return createError({
        statusCode: 500,
        message: 'Configuration webhook Stripe manquante. Vérifiez le fichier .env'
      });
    }
    
    // Initialiser Stripe avec la clé secrète
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil' as any
    });
    
    // Récupérer la signature de l'en-tête
    const signature = getRequestHeader(event, 'stripe-signature');
    if (!signature) {
      return createError({
        statusCode: 400,
        message: 'Missing stripe-signature header'
      });
    }
    
    // Récupérer le corps de la requête brut
    const rawBody = await readRawBody(event);
    if (!rawBody) {
      return createError({
        statusCode: 400,
        message: 'Missing request body'
      });
    }
    
    // Vérifier la signature du webhook
    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return createError({
        statusCode: 400,
        message: `Webhook Error: ${err.message}`
      });
    }
    
    // Initialiser le client Supabase
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    );
    
    // Traiter les différents types d'événements
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        
        // Vérifier que c'est un paiement pour un abonnement
        if (session.mode === 'subscription' && session.subscription && session.customer) {
          // Récupérer les détails de l'abonnement
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Récupérer l'ID utilisateur à partir de l'email client
          const clientEmail = session.client_reference_id;
          if (!clientEmail) {
            console.error('No client reference ID found in session');
            break;
          }
          
          // Trouver l'utilisateur dans Supabase via profiles
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', clientEmail)
            .limit(1);
            
          if (profileError || !profiles || profiles.length === 0) {
            console.error('User not found:', clientEmail, profileError);
            break;
          }
          
          const userId = profiles[0].id;
          
          // Insérer ou mettre à jour l'abonnement dans Supabase
          const { error } = await supabase.from('subscriptions').upsert({
            user_id: userId,
            plan_type: subscription.items.data[0].price.metadata?.plan_type as string || 'premium',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
          
          if (error) {
            console.error('Error updating subscription in Supabase:', error);
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        
        // Trouver l'abonnement dans Supabase
        const { data: subscriptions, error: findError } = await supabase
          .from('subscriptions')
          .select('id, user_id')
          .eq('stripe_subscription_id', subscription.id)
          .limit(1);
          
        if (findError || !subscriptions || subscriptions.length === 0) {
          console.error('Subscription not found:', subscription.id, findError);
          break;
        }
        
        // Mettre à jour l'abonnement
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at: (subscription as any).cancel_at ? new Date((subscription as any).cancel_at * 1000).toISOString() : null,
            canceled_at: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000).toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptions[0].id);
          
        if (error) {
          console.error('Error updating subscription in Supabase:', error);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        
        // Mettre à jour l'abonnement dans Supabase
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as any)
          .eq('stripe_subscription_id', subscription.id);
          
        if (error) {
          console.error('Error updating subscription in Supabase:', error);
        }
        break;
      }
    }
    
    return { received: true };
  } catch (error: any) {
    console.error('Webhook error:', error);
    return createError({
      statusCode: 500,
      message: error.message || 'An error occurred while processing the webhook'
    });
  }
});
