import type { Database } from '~/types/supabase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient<Database>()

  // Vérifier d'abord si l'utilisateur est connecté
  if (!user.value) {
    return navigateTo('/?login=true')
  }

  try {
    // Vérifier l'abonnement actif
    const { data: subscription, error } = await client
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification de l\'abonnement:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la vérification des permissions'
      })
    }

    // Si pas d'abonnement trouvé
    if (!subscription) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Abonnement requis pour accéder à cette fonctionnalité. Veuillez souscrire à un plan pour continuer.'
      })
    }

    // Vérifier que l'abonnement n'a pas expiré
    const now = new Date()
    const periodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end) 
      : null

    if (!periodEnd || periodEnd <= now) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Votre abonnement a expiré. Veuillez renouveler votre abonnement pour continuer.'
      })
    }

    // L'utilisateur a un abonnement actif, continuer
  } catch (err: any) {
    // Si c'est déjà une erreur HTTP, la relancer
    if (err.statusCode) {
      throw err
    }
    
    // Sinon, créer une erreur générique
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la vérification des permissions'
    })
  }
})
