<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Icône de succès -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <!-- Titre -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Paiement réussi !
        </h1>

        <!-- Message de confirmation -->
        <p class="text-lg text-gray-600 mb-8">
          Votre abonnement <span class="font-semibold text-blue-600">{{ planName }}</span> a été activé avec succès.
          Vous avez maintenant accès à toutes les fonctionnalités professionnelles.
        </p>

        <!-- Informations sur l'abonnement -->
        <div v-if="subscription" class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Détails de votre abonnement</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Plan :</span>
              <span class="font-medium">{{ subscription.plan_type }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Statut :</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {{ subscription.status }}
              </span>
            </div>
            <div v-if="subscription.current_period_end" class="flex justify-between">
              <span class="text-gray-600">Prochaine facturation :</span>
              <span class="font-medium">{{ formatDate(subscription.current_period_end) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <button
            @click="goToDashboard"
            class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Accéder au tableau de bord
          </button>
          
          <button
            @click="goToHome"
            class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>

        <!-- Informations supplémentaires -->
        <div class="mt-8 text-sm text-gray-500">
          <p>
            Un email de confirmation a été envoyé à votre adresse.
            Si vous avez des questions, n'hésitez pas à nous contacter.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  title: 'Paiement réussi - Booly',
  description: 'Votre abonnement a été activé avec succès'
})

const route = useRoute()
const { subscription, fetchSubscription } = useSubscription()

// Récupérer le nom du plan depuis l'URL
const planType = route.query.plan as string
const planName = computed(() => {
  switch (planType) {
    case 'basic':
      return 'Plan Basic'
    case 'premium':
      return 'Plan Premium'
    default:
      return 'Plan Pro'
  }
})

// Formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Actions
const goToDashboard = () => {
  navigateTo('/pro/dashboard')
}

const goToHome = () => {
  navigateTo('/')
}

// Récupérer les détails de l'abonnement au montage
onMounted(async () => {
  await fetchSubscription()
})
</script>
