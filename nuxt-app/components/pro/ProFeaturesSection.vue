<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Pourquoi choisir Booly Pro ?
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Notre plateforme révolutionne la collecte d'avis clients en garantissant leur authenticité grâce à la technologie NFC/QR au moment du paiement.
        </p>
      </div>
      
      <!-- Features grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <!-- Icon -->
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <UIcon 
              :name="feature.icon" 
              class="w-6 h-6 text-blue-600"
            />
          </div>
          
          <!-- Content -->
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 leading-relaxed mb-4">
            {{ feature.description }}
          </p>
          
          <!-- Benefits list -->
          <ul class="space-y-2">
            <li
              v-for="benefit in feature.benefits"
              :key="benefit"
              class="flex items-center text-sm text-gray-600"
            >
              <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              {{ benefit }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bottom CTA -->
      <div class="text-center mt-16">
        <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
          <div class="flex items-center justify-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            100% d'avis authentiques garantis
          </h3>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contrairement aux autres plateformes, nos avis ne peuvent être laissés qu'après un achat réel, vérifié par scan NFC/QR au moment du paiement. Fini les faux avis !
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              @click="scrollToPricing"
              size="lg"
              class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Commencer maintenant
            </UButton>
            <UButton
              to="/contact"
              variant="outline"
              size="lg"
              class="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Nous contacter
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Features data
const features = [
  {
    id: 1,
    icon: 'i-heroicons-shield-check',
    title: 'Avis 100% authentiques',
    description: 'Seuls les vrais clients peuvent laisser un avis après avoir scanné le QR/NFC au moment du paiement.',
    benefits: [
      'Vérification automatique au paiement',
      'Impossible de falsifier',
      'Confiance client renforcée'
    ]
  },
  {
    id: 2,
    icon: 'i-heroicons-chart-bar-square',
    title: 'Tableau de bord avancé',
    description: 'Suivez vos performances, analysez vos avis et identifiez les axes d\'amélioration.',
    benefits: [
      'Analytics en temps réel',
      'Rapports détaillés',
      'Alertes personnalisées'
    ]
  },
  {
    id: 3,
    icon: 'i-heroicons-device-phone-mobile',
    title: 'Installation simple',
    description: 'Intégrez Booly à votre système de caisse en quelques minutes avec nos solutions clé en main.',
    benefits: [
      'Compatible tous TPE',
      'QR codes personnalisés',
      'Support technique inclus'
    ]
  },
  {
    id: 4,
    icon: 'i-heroicons-star',
    title: 'Amélioration continue',
    description: 'Recevez des insights précieux pour améliorer votre service et fidéliser vos clients.',
    benefits: [
      'Analyse des sentiments',
      'Recommandations personnalisées',
      'Suivi de satisfaction'
    ]
  },
  {
    id: 5,
    icon: 'i-heroicons-megaphone',
    title: 'Visibilité accrue',
    description: 'Vos avis authentiques vous donnent un avantage concurrentiel et attirent plus de clients.',
    benefits: [
      'Référencement local amélioré',
      'Badge "Avis vérifiés"',
      'Partage sur réseaux sociaux'
    ]
  },
  {
    id: 6,
    icon: 'i-heroicons-cog-6-tooth',
    title: 'Personnalisation complète',
    description: 'Adaptez l\'expérience à votre marque avec nos options de personnalisation avancées.',
    benefits: [
      'Design aux couleurs de votre marque',
      'Messages personnalisés',
      'Intégration site web'
    ]
  }
]

// Methods
const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
