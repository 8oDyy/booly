<template>
  <section id="pricing-section" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Développez votre activité avec nos outils professionnels de gestion d'avis et de réputation en ligne.
        </p>
      </div>
      
      <!-- Pricing cards -->
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Basic Plan -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 relative">
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Plan Basic</h3>
            <p class="text-gray-600 mb-6">Parfait pour débuter</p>
            
            <div class="mb-6">
              <span class="text-4xl font-bold text-gray-900">19,99€</span>
              <span class="text-gray-600">/mois</span>
            </div>
            
            <UButton
              @click="startCheckout('basic')"
              :loading="loadingPlan === 'basic'"
              :disabled="getButtonState('basic').disabled"
              :class="[
                'w-full py-3 rounded-xl font-semibold mb-6',
                getButtonState('basic').variant === 'current' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : getButtonState('basic').variant === 'upgrade'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : getButtonState('basic').variant === 'disabled'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              ]"
            >
              <template v-if="loadingPlan === 'basic'">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                Redirection...
              </template>
              <template v-else>
                {{ getButtonState('basic').text }}
              </template>
            </UButton>
          </div>
          
          <ul class="space-y-3">
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Gestion d'un établissement</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Avis clients illimités</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">QR codes personnalisés</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Statistiques de base</span>
            </li>
          </ul>
        </div>
        
        <!-- Premium Plan (Most Popular) -->
        <div class="bg-white rounded-xl border-2 border-blue-500 p-6 relative">
          <!-- Popular badge -->
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm font-medium">
              Le plus populaire
            </span>
          </div>
          
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
            <p class="text-gray-600 mb-6">Pour les professionnels exigeants</p>
            
            <div class="mb-6">
              <span class="text-4xl font-bold text-gray-900">29,99€</span>
              <span class="text-gray-600">/mois</span>
            </div>
            
            <UButton
              @click="startCheckout('premium')"
              :loading="loadingPlan === 'premium'"
              :disabled="getButtonState('premium').disabled"
              :class="[
                'w-full py-3 rounded-xl font-semibold mb-6',
                getButtonState('premium').variant === 'current' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : getButtonState('premium').variant === 'upgrade'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : getButtonState('premium').variant === 'disabled'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              ]"
            >
              <template v-if="loadingPlan === 'premium'">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                Redirection...
              </template>
              <template v-else>
                {{ getButtonState('premium').text }}
              </template>
            </UButton>
          </div>
          
          <ul class="space-y-3">
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Gestion de 5 établissements</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Avis clients illimités</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">QR codes et NFC personnalisés</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Statistiques avancées</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Support prioritaire</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Intégrations API</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bottom info -->
      <div class="text-center mt-12">
        <p class="text-gray-600 mb-4">
          Tous les plans incluent 30 jours d'essai gratuit • Aucun engagement • Annulation à tout moment
        </p>
        <div class="flex justify-center items-center space-x-6 text-sm text-gray-500">
          <div class="flex items-center">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" />
            Paiement sécurisé
          </div>
          <div class="flex items-center">
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-1" />
            Remboursement 30j
          </div>
          <div class="flex items-center">
            <UIcon name="i-heroicons-phone" class="w-4 h-4 mr-1" />
            Support français
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { createCheckoutSession, hasActiveSubscription, currentPlan } = useSubscription()

// Reactive data
const loadingPlan = ref<string | null>(null)

// Computed properties pour gérer les états d'abonnement
const isSubscribed = computed(() => hasActiveSubscription.value)
const userCurrentPlan = computed(() => currentPlan.value)

// États des boutons selon l'abonnement actuel
const getButtonState = (plan: 'basic' | 'premium') => {
  if (!isSubscribed.value) {
    return {
      text: plan === 'basic' ? 'Choisir Basic' : 'Choisir Premium',
      disabled: false,
      variant: 'primary'
    }
  }
  
  if (userCurrentPlan.value === plan) {
    return {
      text: 'Plan actuel',
      disabled: true,
      variant: 'current'
    }
  }
  
  if (userCurrentPlan.value === 'basic' && plan === 'premium') {
    return {
      text: 'Passer au Premium',
      disabled: false,
      variant: 'upgrade'
    }
  }
  
  return {
    text: 'Non disponible',
    disabled: true,
    variant: 'disabled'
  }
}

// Emits
const emit = defineEmits<{
  'open-login': []
}>()

// Methods
const startCheckout = async (plan: 'basic' | 'premium') => {
  if (!user.value) {
    emit('open-login')
    return
  }

  try {
    loadingPlan.value = plan
    await createCheckoutSession(plan)
  } catch (error: any) {
    console.error('Erreur checkout:', error)
    alert('Une erreur est survenue lors de la création du paiement. Veuillez réessayer.')
  } finally {
    loadingPlan.value = null
  }
}

// Gestion des paramètres URL (pour afficher des messages de succès/erreur)
onMounted(() => {
  const route = useRoute()
  if (route.query.canceled === 'true') {
    console.log('Paiement annulé')
  }
})
</script>
