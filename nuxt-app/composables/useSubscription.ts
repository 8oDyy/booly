import type { Database } from '~/types/supabase'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

export const useSubscription = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient<Database>()

  // État réactif
  const subscription = ref<Subscription | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer la configuration runtime
  const config = useRuntimeConfig()
  
  // Debug logs
  console.log('🔧 Runtime config Stripe prices:', {
    basic: config.public.stripePriceBasic,
    premium: config.public.stripePricePremium
  })
  
  // Plans disponibles - Price IDs de VOTRE compte Stripe
  const plans = {
    basic: {
      name: 'Plan Basic',
      price: 19.99,
      priceId: 'price_1RuwCXLgo7pFtFvcYRf2qNXO', // Price ID créé dans votre compte Stripe
      features: [
        'Gestion d\'un établissement',
        'Avis clients illimités',
        'QR codes personnalisés',
        'Statistiques de base'
      ]
    },
    premium: {
      name: 'Plan Premium',
      price: 29.99,
      priceId: 'price_1RuwClLgo7pFtFvcYNDgjADz', // Price ID créé dans votre compte Stripe
      features: [
        'Gestion de 5 établissements',
        'Avis clients illimités',
        'QR codes et NFC personnalisés',
        'Statistiques avancées',
        'Support prioritaire',
        'Intégrations API'
      ]
    }
  }
  
  console.log('💰 Plans configurés:', {
    basicPriceId: plans.basic.priceId,
    premiumPriceId: plans.premium.priceId
  })

  /**
   * Récupérer l'abonnement actuel de l'utilisateur
   */
  const fetchSubscription = async (): Promise<Subscription | null> => {
    if (!user.value) {
      subscription.value = null
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await client
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erreur lors de la récupération de l\'abonnement:', dbError)
        error.value = dbError.message
        return null
      }

      subscription.value = data || null
      return data || null

    } catch (err: any) {
      console.error('Erreur lors de la récupération de l\'abonnement:', err)
      error.value = err.message || 'Erreur inconnue'
      subscription.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Vérifier si l'utilisateur a un abonnement actif
   */
  const hasActiveSubscription = computed(() => {
    if (!subscription.value) return false
    
    const now = new Date()
    const periodEnd = subscription.value.current_period_end 
      ? new Date(subscription.value.current_period_end) 
      : null

    return subscription.value.status === 'active' && 
           periodEnd && 
           periodEnd > now
  })

  /**
   * Obtenir le type de plan actuel
   */
  const currentPlan = computed(() => {
    if (!subscription.value || !hasActiveSubscription.value) return null
    return subscription.value.plan_type
  })

  /**
   * Créer une session de paiement Stripe
   */
  const createCheckoutSession = async (planType: 'basic' | 'premium') => {
    if (!user.value) {
      throw new Error('Utilisateur non connecté')
    }

    const plan = plans[planType]
    if (!plan) {
      throw new Error('Plan invalide')
    }

    try {
      const response = await $fetch<{ url: string | null }>('/api/stripe/checkout', {
        method: 'POST',
        body: {
          priceId: plan.priceId,
          userId: user.value.id,
          userEmail: user.value.email,
          planType: planType
        }
      })

      if (response?.url) {
        // Rediriger vers Stripe Checkout
        await navigateTo(response.url, { external: true })
      } else {
        throw new Error('URL de paiement non reçue')
      }

    } catch (err: any) {
      console.error('Erreur lors de la création de la session de paiement:', err)
      throw new Error(err.message || 'Erreur lors de la création du paiement')
    }
  }

  /**
   * Gérer le portail client Stripe (pour gérer l'abonnement)
   */
  const openCustomerPortal = async () => {
    if (!subscription.value?.stripe_customer_id) {
      throw new Error('Aucun abonnement trouvé')
    }

    try {
      const response = await $fetch<{ url: string | null }>('/api/stripe/portal', {
        method: 'POST',
        body: {
          customerId: subscription.value.stripe_customer_id
        }
      })

      if (response?.url) {
        await navigateTo(response.url, { external: true })
      }

    } catch (err: any) {
      console.error('Erreur lors de l\'ouverture du portail client:', err)
      throw new Error('Erreur lors de l\'ouverture du portail client')
    }
  }

  /**
   * Surveiller les changements d'utilisateur
   */
  watch(user, async (newUser) => {
    if (newUser) {
      await fetchSubscription()
    } else {
      subscription.value = null
    }
  }, { immediate: true })

  return {
    // État
    subscription: readonly(subscription),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computed
    hasActiveSubscription,
    currentPlan,
    
    // Données
    plans,
    
    // Méthodes
    fetchSubscription,
    createCheckoutSession,
    openCustomerPortal
  }
}
