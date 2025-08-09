<template>
  <section id="pricing-section" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Tarifs transparents, sans surprise
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Choisissez l'offre qui correspond à vos besoins. Essai gratuit de 30 jours, sans engagement.
        </p>
        
        <!-- Toggle billing -->
        <div class="flex items-center justify-center mb-8">
          <span class="text-gray-600 mr-3">Mensuel</span>
          <button
            @click="toggleBilling"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="isYearly ? 'bg-blue-600' : 'bg-gray-200'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="isYearly ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
          <span class="text-gray-600 ml-3">Annuel</span>
          <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            -20%
          </span>
        </div>
      </div>
      
      <!-- Pricing cards -->
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Starter Plan -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 relative">
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
            <p class="text-gray-600 mb-6">Parfait pour débuter</p>
            
            <div class="mb-6">
              <span class="text-4xl font-bold text-gray-900">
                {{ isYearly ? '19' : '24' }}€
              </span>
              <span class="text-gray-600">/mois</span>
              <div v-if="isYearly" class="text-sm text-green-600 font-medium">
                Économisez 60€/an
              </div>
            </div>
            
            <UButton
              @click="startCheckout('starter')"
              :loading="loadingPlan === 'starter'"
              class="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold mb-6"
            >
              <template v-if="loadingPlan === 'starter'">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                Redirection...
              </template>
              <template v-else>
                Commencer l'essai gratuit
              </template>
            </UButton>
          </div>
          
          <ul class="space-y-3">
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Jusqu'à 100 avis/mois</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Tableau de bord basique</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">QR codes personnalisés</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Support email</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Badge "Avis vérifiés"</span>
            </li>
          </ul>
        </div>
        
        <!-- Pro Plan (Most Popular) -->
        <div class="bg-white rounded-xl border-2 border-blue-500 p-6 relative">
          <!-- Popular badge -->
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm font-medium">
              Le plus populaire
            </span>
          </div>
          
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
            <p class="text-gray-600 mb-6">Pour les entreprises en croissance</p>
            
            <div class="mb-6">
              <span class="text-4xl font-bold text-gray-900">
                {{ isYearly ? '39' : '49' }}€
              </span>
              <span class="text-gray-600">/mois</span>
              <div v-if="isYearly" class="text-sm text-green-600 font-medium">
                Économisez 120€/an
              </div>
            </div>
            
            <UButton
              @click="startCheckout('pro')"
              :loading="loadingPlan === 'pro'"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6"
            >
              <template v-if="loadingPlan === 'pro'">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                Redirection...
              </template>
              <template v-else>
                Commencer l'essai gratuit
              </template>
            </UButton>
          </div>
          
          <ul class="space-y-3">
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Jusqu'à 500 avis/mois</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Tableau de bord avancé</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Analytics détaillés</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Intégration API</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Support prioritaire</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Personnalisation avancée</span>
            </li>
          </ul>
        </div>
        
        <!-- Enterprise Plan -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 relative">
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
            <p class="text-gray-600 mb-6">Pour les grandes entreprises</p>
            
            <div class="mb-6">
              <span class="text-4xl font-bold text-gray-900">
                {{ isYearly ? '79' : '99' }}€
              </span>
              <span class="text-gray-600">/mois</span>
              <div v-if="isYearly" class="text-sm text-green-600 font-medium">
                Économisez 240€/an
              </div>
            </div>
            
            <UButton
              @click="startCheckout('enterprise')"
              :loading="loadingPlan === 'enterprise'"
              class="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold mb-6"
            >
              <template v-if="loadingPlan === 'enterprise'">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                Redirection...
              </template>
              <template v-else>
                Commencer l'essai gratuit
              </template>
            </UButton>
          </div>
          
          <ul class="space-y-3">
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Avis illimités</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Multi-établissements</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">API complète</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Support dédié 24/7</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">Formation personnalisée</span>
            </li>
            <li class="flex items-center">
              <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-500 mr-3" />
              <span class="text-gray-600">SLA garanti</span>
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
// Reactive data
const isYearly = ref(false)
const loadingPlan = ref<string | null>(null)

// Price IDs for Stripe (à adapter selon votre configuration Stripe)
const priceIds = {
  starter: {
    monthly: 'price_starter_monthly', // Remplacer par vos vrais price IDs
    yearly: 'price_starter_yearly'
  },
  pro: {
    monthly: 'price_pro_monthly',
    yearly: 'price_pro_yearly'
  },
  enterprise: {
    monthly: 'price_enterprise_monthly',
    yearly: 'price_enterprise_yearly'
  }
}

// Methods
const toggleBilling = () => {
  isYearly.value = !isYearly.value
}

const startCheckout = async (plan: 'starter' | 'pro' | 'enterprise') => {
  try {
    loadingPlan.value = plan
    
    // Récupérer le price ID selon le plan et la période
    const priceId = isYearly.value ? priceIds[plan].yearly : priceIds[plan].monthly
    
    // Préparer les données pour Stripe
    const checkoutData = {
      priceId,
      successUrl: `${window.location.origin}/pro/success?plan=${plan}`,
      cancelUrl: `${window.location.origin}/pro?canceled=true`,
      customerEmail: '', // Sera demandé par Stripe
      userId: '' // À récupérer si l'utilisateur est connecté
    }
    
    // Appeler l'API Stripe checkout
    const response = await $fetch('/api/stripe/checkout', {
      method: 'POST',
      body: checkoutData
    }) as { url?: string }
    
    if (response && response.url) {
      // Rediriger vers Stripe Checkout
      window.location.href = response.url
    } else {
      throw new Error('Erreur lors de la création de la session de paiement')
    }
  } catch (error) {
    console.error('Erreur checkout:', error)
    // TODO: Afficher une notification d'erreur
    alert('Une erreur est survenue. Veuillez réessayer.')
  } finally {
    loadingPlan.value = null
  }
}

// Gestion des paramètres URL (pour afficher des messages de succès/erreur)
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('canceled') === 'true') {
    // TODO: Afficher un message "Paiement annulé"
    console.log('Paiement annulé')
  }
})
</script>
