import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  try {
    const { customerId } = await readBody(event)

    if (!customerId) {
      return createError({
        statusCode: 400,
        message: 'Customer ID is required'
      })
    }

    // Vérifier que la clé Stripe est configurée
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_votreclésecrete') {
      console.error('Erreur: Clé API Stripe non configurée ou invalide')
      return createError({
        statusCode: 500,
        message: 'Configuration Stripe manquante. Vérifiez le fichier .env'
      })
    }

    // Initialiser Stripe
    const stripe = new Stripe(stripeSecretKey)

    // URL de retour après gestion du portail client
    const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const returnUrl = `${baseUrl}/pro/dashboard`

    // Créer une session de portail client
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: portalSession.url }

  } catch (error: any) {
    console.error('Stripe portal error:', error)
    return createError({
      statusCode: 500,
      message: error.message || 'An error occurred while creating the portal session'
    })
  }
})
