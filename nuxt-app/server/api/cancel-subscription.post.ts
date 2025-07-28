import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/types/supabase';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les données du corps de la requête
    const { subscriptionId } = await readBody(event);

    // Vérifier que les données requises sont présentes
    if (!subscriptionId) {
      return createError({
        statusCode: 400,
        message: 'Missing subscription ID'
      });
    }

    // Vérifier que la clé Stripe est configurée
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_votreclésecrete') {
      console.error('Erreur: Clé API Stripe non configurée ou invalide');
      return createError({
        statusCode: 500,
        message: 'Configuration Stripe manquante. Vérifiez le fichier .env'
      });
    }
    
    // Initialiser Stripe avec la clé secrète
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil' as any
    });

    // Initialiser le client Supabase
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || ''
    );

    // Vérifier que l'utilisateur est authentifié
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }

    // Vérifier que l'abonnement appartient à l'utilisateur
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subscriptionError || !subscription) {
      return createError({
        statusCode: 404,
        message: 'Subscription not found'
      });
    }

    // Si l'abonnement a un ID Stripe, annuler l'abonnement dans Stripe
    if (subscription.stripe_subscription_id) {
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true
      });
    }

    // Mettre à jour l'abonnement dans Supabase
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', subscriptionId);

    if (error) {
      return createError({
        statusCode: 500,
        message: 'Failed to update subscription'
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return createError({
      statusCode: 500,
      message: error.message || 'An error occurred while cancelling the subscription'
    });
  }
});
