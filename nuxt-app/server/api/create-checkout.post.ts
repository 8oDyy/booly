import Stripe from 'stripe';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les données du corps de la requête
    const { priceId, successUrl, cancelUrl, customerEmail } = await readBody(event);

    // Vérifier que les données requises sont présentes
    if (!priceId || !successUrl || !cancelUrl) {
      return createError({
        statusCode: 400,
        message: 'Missing required parameters'
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

    // Créer ou récupérer un client Stripe
    let customer;
    if (customerEmail) {
      // Rechercher si le client existe déjà
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        // Créer un nouveau client
        customer = await stripe.customers.create({
          email: customerEmail
        });
      }
    }

    // Créer une session de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customer?.id,
      client_reference_id: customerEmail, // Pour identifier l'utilisateur après le paiement
      metadata: {
        priceId
      }
    });

    // Retourner l'URL de la session de checkout
    return { url: session.url };
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return createError({
      statusCode: 500,
      message: error.message || 'An error occurred while creating the checkout session'
    });
  }
});
