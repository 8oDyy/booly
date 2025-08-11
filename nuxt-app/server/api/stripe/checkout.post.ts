import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les données du corps de la requête
    const { priceId, customerEmail, userId, planType } = await readBody(event);

    // Vérifier que les données requises sont présentes
    if (!priceId || !userId || !planType) {
      return createError({
        statusCode: 400,
        message: 'Missing required parameters: priceId, userId, and planType are required'
      });
    }

    // URLs de redirection (dynamiques basées sur l'environnement)
    const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/dashboard?success=true&plan=${planType}`;
    const cancelUrl = `${baseUrl}/pricing?canceled=true`;

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
    const stripe = new Stripe(stripeSecretKey);

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
      client_reference_id: userId,
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
