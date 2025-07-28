<template>
  <UPage>
    <UPageHeader
      title="Espace Professionnel"
      description="Développez votre activité et attirez de nouveaux clients grâce à Booly"
      class="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white"
      :ui="{
        container: 'relative py-20 md:py-28 flex flex-col items-center justify-center text-center',
        title: 'text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-tight drop-shadow-xl mb-6 max-w-3xl',
        description: 'text-blue-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto',
        wrapper: 'w-full max-w-6xl'
      }"
    >
      <template #headline>
        <UBadge color="primary" variant="solid" class="mb-4 bg-blue-50 text-blue-700 font-medium">Espace dédié aux professionnels</UBadge>
      </template>
    </UPageHeader>
    
    <!-- Séparateur décoratif -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-blue-700 opacity-10 skew-y-3 transform -translate-y-1/2 h-16"></div>
    </div>
    
    <UPageBody>
      <!-- Section avantages -->
      <UPageSection
        title="Nos avantages pour votre entreprise"
        description="Boostez votre visibilité et développez votre clientèle"
        class="bg-gradient-to-b from-blue-50 to-white relative py-4"
        :ui="{
          container: 'py-20',
          title: 'font-extrabold text-3xl md:text-4xl text-blue-700 mb-4 text-center font-roboto',
          description: 'text-blue-600/80 text-xl mb-10 text-center max-w-3xl mx-auto font-inter',
          wrapper: 'max-w-7xl mx-auto'
        }"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UCard
            class="flex flex-col items-center p-4 bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 hover:bg-blue-50 h-full"
          >
            <template #header>
              <div class="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <UIcon name="i-heroicons-users" class="text-blue-600 w-8 h-8" />
              </div>
            </template>
            <div class="text-center">
              <h3 class="font-roboto font-bold text-blue-700 text-xl mb-2">Visibilité maximale</h3>
              <p class="text-blue-600/80">
                Soyez visible auprès de milliers de clients potentiels qui recherchent vos services chaque jour.
              </p>
            </div>
          </UCard>

          <UCard
            class="flex flex-col items-center p-4 bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 hover:bg-blue-50 h-full"
          >
            <template #header>
              <div class="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <UIcon name="i-heroicons-chart-bar" class="text-blue-600 w-8 h-8" />
              </div>
            </template>
            <div class="text-center">
              <h3 class="font-roboto font-bold text-blue-700 text-xl mb-2">Analyses détaillées</h3>
              <p class="text-blue-600/80">
                Suivez les performances de votre établissement et optimisez votre présence en ligne.
              </p>
            </div>
          </UCard>

          <UCard
            class="flex flex-col items-center p-4 bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 hover:bg-blue-50 h-full"
          >
            <template #header>
              <div class="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <UIcon name="i-heroicons-star" class="text-blue-600 w-8 h-8" />
              </div>
            </template>
            <div class="text-center">
              <h3 class="font-roboto font-bold text-blue-700 text-xl mb-2">Avis et réputation</h3>
              <p class="text-blue-600/80">
                Gérez votre réputation en ligne et répondez aux avis de vos clients.
              </p>
            </div>
          </UCard>
        </div>
      </UPageSection>

      <!-- Section plans tarifaires -->
      <UPageSection 
        title="Nos offres pour les professionnels" 
        description="Des formules adaptées à tous les besoins et à tous les budgets"
        class="bg-gradient-to-b from-white to-blue-50 relative py-4"
        :ui="{
          container: 'py-20',
          title: 'font-extrabold text-3xl md:text-4xl text-blue-700 mb-4 text-center font-roboto',
          description: 'text-blue-600/80 text-xl mb-10 text-center max-w-3xl mx-auto font-inter',
          wrapper: 'max-w-7xl mx-auto'
        }"
      >
        <UPricingPlans>
          <UPricingPlan 
            title="Gratuit" 
            description="Pour démarrer votre présence en ligne" 
            price="0€" 
            interval="/mois"
          >
            <template #features>
              <ul class="space-y-3">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Fiche établissement basique</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Réception des avis clients</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Présence dans les résultats de recherche</span>
                </li>
              </ul>
            </template>
            <template #action>
              <div class="space-y-2">
                <UButton color="secondary" variant="outline" class="w-full" label="Commencer gratuitement" @click="createFreeCheckout" :loading="isLoadingFree" />
                <p class="text-xs text-gray-500 text-center">Aucune carte de crédit requise</p>
              </div>
            </template>
          </UPricingPlan>

          <UPricingPlan 
            title="Premium" 
            description="Pour développer votre activité" 
            price="29€" 
            interval="/mois"
            badge="Populaire"
            featured
          >
            <template #features>
              <ul class="space-y-3">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Tout ce qui est inclus dans l'offre Gratuite</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Fiche établissement personnalisée</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Mise en avant dans les résultats</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Statistiques de visites</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Réponse aux avis clients</span>
                </li>
              </ul>
            </template>
            <template #action>
              <div class="space-y-2">
                <UButton color="primary" class="w-full" label="S'abonner maintenant" @click="createPremiumCheckout" :loading="isLoadingPremium" />
                <p class="text-xs text-gray-500 text-center">Paiement sécurisé via Stripe</p>
              </div>
            </template>
          </UPricingPlan>

          <UPricingPlan 
            title="Business" 
            description="Pour les professionnels exigeants" 
            price="79€" 
            interval="/mois"
          >
            <template #features>
              <ul class="space-y-3">
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Tout ce qui est inclus dans l'offre Premium</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Publicités ciblées</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Analyses concurrentielles</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Support prioritaire</span>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500 mr-2" />
                  <span>Intégration API</span>
                </li>
              </ul>
            </template>
            <template #action>
              <div class="space-y-2">
                <UButton color="secondary" variant="outline" class="w-full" label="Contacter les ventes" />
              </div>
            </template>
          </UPricingPlan>
        </UPricingPlans>
      </UPageSection>

      <!-- Section témoignages -->
      <UPageSection 
        title="Ce que disent nos partenaires" 
        description="Découvrez les témoignages de professionnels qui nous font confiance"
        class="bg-gradient-to-b from-blue-50 to-white relative py-4"
        :ui="{
          container: 'py-20',
          title: 'font-extrabold text-3xl md:text-4xl text-blue-700 mb-4 text-center font-roboto',
          description: 'text-blue-600/80 text-xl mb-10 text-center max-w-3xl mx-auto font-inter',
          wrapper: 'max-w-7xl mx-auto'
        }"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UCard class="border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <UAvatar src="https://i.pravatar.cc/150?img=1" alt="Sophie Martin" size="lg" class="mr-4 ring-2 ring-blue-500" />
                <div>
                  <h4 class="font-roboto font-bold text-blue-700">Sophie Martin</h4>
                  <p class="text-sm text-blue-500">Restaurant Le Gourmet</p>
                </div>
              </div>
              <p class="italic text-blue-600/80">
                "Depuis que nous avons rejoint Booly, notre visibilité a considérablement augmentée. Nous recevons régulièrement de nouveaux clients qui nous ont découverts via la plateforme."
              </p>
            </div>
          </UCard>

          <UCard class="border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <UAvatar src="https://i.pravatar.cc/150?img=2" alt="Thomas Dubois" size="lg" class="mr-4 ring-2 ring-blue-500" />
                <div>
                  <h4 class="font-roboto font-bold text-blue-700">Thomas Dubois</h4>
                  <p class="text-sm text-blue-500">Salon de coiffure Élégance</p>
                </div>
              </div>
              <p class="italic text-blue-600/80">
                "Les outils d'analyse de Booly nous ont permis d'optimiser nos horaires d'ouverture et de mieux comprendre les attentes de nos clients. Un vrai plus pour notre activité !"
              </p>
            </div>
          </UCard>
        </div>
      </UPageSection>

      <!-- Section CTA -->
      <UPageSection class="bg-gradient-to-b from-white to-blue-50 relative py-4">
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-12 text-center shadow-xl">
          <h2 class="text-2xl md:text-4xl font-extrabold text-white mb-4 font-roboto">Prêt à développer votre activité ?</h2>
          <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-inter">
            Rejoignez des milliers de professionnels qui font confiance à Booly pour développer leur présence en ligne et attirer de nouveaux clients.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-6">
            <UButton color="primary" size="xl" label="Créer mon compte pro" class="font-bold bg-white text-blue-700 hover:bg-blue-50" />
            <UButton color="primary" variant="outline" size="xl" label="Demander une démo" class="font-bold text-white border-2 border-white hover:bg-blue-700/50" />
          </div>
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@nuxt/ui'
import { useSupabaseClient } from '#imports'

const toast = useToast()
const supabase = useSupabaseClient()
const isLoadingFree = ref(false)
const isLoadingPremium = ref(false)

// Fonction pour créer un checkout pour le plan gratuit
async function createFreeCheckout() {
  isLoadingFree.value = true
  try {
    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      toast.add({ title: 'Veuillez vous connecter pour continuer', color: 'warning' })
      navigateTo('/auth/login')
      return
    }
    
    // Enregistrer l'inscription au plan gratuit dans la base de données
    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_type: 'free',
      stripe_price_id: 'price_1Rkt2SPvvWh23t2ruSbTMCny',
      status: 'active',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 an
    })
    
    if (error) throw error
    
    toast.add({ title: 'Inscription réussie au plan gratuit !', color: 'success' })
    navigateTo('/dashboard')
  } catch (error) {
    console.error('Erreur lors de l\'inscription au plan gratuit:', error)
    toast.add({ title: 'Une erreur est survenue', color: 'red' })
  } finally {
    isLoadingFree.value = false
  }
}

// Fonction pour créer un checkout pour le plan premium
async function createPremiumCheckout() {
  isLoadingPremium.value = true
  try {
    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      toast.add({ title: 'Veuillez vous connecter pour continuer', color: 'warning' })
      navigateTo('/auth/login')
      return
    }
    
    // Créer un lien de paiement Stripe
    const response = await $fetch('/api/create-checkout', {
      method: 'POST',
      body: {
        priceId: 'price_1Rkt2gPvvWh23t2rGxCMmQMb',
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        customerEmail: user.email
      }
    })
    
    // Rediriger vers la page de paiement Stripe
    window.location.href = response.url
  } catch (error) {
    console.error('Erreur lors de la création du checkout:', error)
    toast.add({ title: 'Une erreur est survenue', color: 'red' })
  } finally {
    isLoadingPremium.value = false
  }
}


definePageMeta({
  title: 'Espace Professionnel - Booly',
  description: 'Développez votre activité et attirez de nouveaux clients grâce à Booly'
});
</script>
