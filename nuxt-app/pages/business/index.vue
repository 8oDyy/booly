
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
          <UPricingPlans :plans="plans" />
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
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useSupabaseUser } from '#imports'
  
  const user = useSupabaseUser()

  const plans = ref([
  {
    title: 'Premium',
    description: 'Pour les professionnels exigeants',
    price: '9.99€/mois',
    features: [
      'Tout ce qui est inclus dans l\'offre Premium',
      'Publicités ciblées',
      'Analyses concurrentielles',
      'Support prioritaire',
      'Intégration API'
    ],
    button: {
      label: 'S\'abonner',
      onClick: () => redirectToStripe('price_1RpyN0Lgo7pFtFvc6nkC7XzZ')
    }
  },
  {
    title: 'Business',
    description: 'Pour les professionnels exigeants',
    price: '79€/mois',
    features: [
      'Tout ce qui est inclus dans l\'offre Premium',
      'Publicités ciblées',
      'Analyses concurrentielles',
      'Support prioritaire',
      'Intégration API'
    ],
    button: {
      label: 'S\'abonner'
    }
  }
])

console.log(user.value)
  
  // Fonction pour créer un checkout
  const redirectToStripe = async (priceId: string) => {
    try {
        const { url }: { url: string } = await $fetch('/api/stripe/checkout', {
            method: 'POST',
            body: {
                priceId,
                successUrl: window.location.origin + '/success',
                cancelUrl: window.location.origin + '/cancel',
                customerEmail: user.value?.email || undefined,
                userId: user.value?.id || undefined
            }
        })

        if (url) window.location.href = url
    } catch (err) {
        console.error('Erreur Stripe:', err)
    }
    }
  
  definePageMeta({
    title: 'Espace Professionnel - Booly',
    description: 'Développez votre activité et attirez de nouveaux clients grâce à Booly'
  });
  </script>
  