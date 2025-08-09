<template>
  <section class="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Les avantages concrets de Booly Pro
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez comment nos clients ont transformé leur activité grâce aux avis authentiques
        </p>
      </div>
      
      <!-- Benefits grid -->
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Benefits list -->
        <div class="space-y-8">
          <div
            v-for="benefit in benefits"
            :key="benefit.id"
            class="flex items-start space-x-4 group"
          >
            <!-- Icon -->
            <div class="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:shadow-md transition-all duration-300">
              <UIcon 
                :name="benefit.icon" 
                class="w-6 h-6 text-blue-600"
              />
            </div>
            
            <!-- Content -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ benefit.title }}
              </h3>
              <p class="text-gray-600 leading-relaxed mb-3">
                {{ benefit.description }}
              </p>
              <div class="flex items-center text-sm font-medium text-blue-600">
                <UIcon name="i-heroicons-arrow-trending-up" class="w-4 h-4 mr-1" />
                {{ benefit.impact }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right: Stats and testimonial -->
        <div class="space-y-8">
          <!-- Stats card -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">
              Résultats moyens de nos clients
            </h3>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">+47%</div>
                <div class="text-sm text-gray-600">Nouveaux clients</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">+32%</div>
                <div class="text-sm text-gray-600">Chiffre d'affaires</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-purple-600 mb-2">4.6</div>
                <div class="text-sm text-gray-600">Note moyenne</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-orange-600 mb-2">89%</div>
                <div class="text-sm text-gray-600">Clients satisfaits</div>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-200 text-center">
              <p class="text-sm text-gray-500">
                Basé sur 500+ entreprises utilisant Booly Pro depuis 6 mois
              </p>
            </div>
          </div>
          
          <!-- Testimonial -->
          <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-6 h-6 text-white" />
              </div>
              <div>
                <div class="font-semibold">Marie Dubois</div>
                <div class="text-blue-200 text-sm">Propriétaire, Restaurant Le Gourmet</div>
              </div>
            </div>
            
            <blockquote class="text-lg leading-relaxed mb-4">
              "Depuis que nous utilisons Booly Pro, nous avons gagné la confiance de nos clients. Les avis authentiques nous ont permis d'augmenter notre fréquentation de 40% en 6 mois !"
            </blockquote>
            
            <div class="flex items-center">
              <div class="flex space-x-1 mr-3">
                <UIcon 
                  v-for="i in 5" 
                  :key="i" 
                  name="i-heroicons-star-solid" 
                  class="w-4 h-4 text-yellow-400" 
                />
              </div>
              <span class="text-blue-200 text-sm">Avis vérifié Booly Pro</span>
            </div>
          </div>
          
          <!-- ROI Calculator -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
              Calculez votre ROI
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de clients par mois
                </label>
                <UInput
                  v-model="monthlyCustomers"
                  type="number"
                  placeholder="ex: 200"
                  class="w-full"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Panier moyen (€)
                </label>
                <UInput
                  v-model="averageBasket"
                  type="number"
                  placeholder="ex: 35"
                  class="w-full"
                />
              </div>
              
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <div class="text-sm text-gray-600 mb-1">ROI mensuel estimé</div>
                <div class="text-2xl font-bold text-green-600">
                  +{{ calculatedROI }}€
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Basé sur +30% de nouveaux clients
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Reactive data
const monthlyCustomers = ref(200)
const averageBasket = ref(35)

// Benefits data
const benefits = [
  {
    id: 1,
    icon: 'i-heroicons-shield-check',
    title: 'Crédibilité renforcée',
    description: 'Vos avis authentiques rassurent les prospects et augmentent votre taux de conversion.',
    impact: '+25% de taux de conversion'
  },
  {
    id: 2,
    icon: 'i-heroicons-magnifying-glass',
    title: 'Visibilité locale améliorée',
    description: 'Les avis vérifiés boostent votre référencement local et votre présence en ligne.',
    impact: '+40% de visibilité Google'
  },
  {
    id: 3,
    icon: 'i-heroicons-users',
    title: 'Fidélisation client',
    description: 'Le processus d\'avis crée un lien privilégié et encourage les clients à revenir.',
    impact: '+35% de clients fidèles'
  },
  {
    id: 4,
    icon: 'i-heroicons-chart-bar',
    title: 'Insights précieux',
    description: 'Analysez les retours clients pour améliorer continuellement votre service.',
    impact: '+20% de satisfaction'
  },
  {
    id: 5,
    icon: 'i-heroicons-trophy',
    title: 'Avantage concurrentiel',
    description: 'Démarquez-vous avec des avis 100% authentiques face à la concurrence.',
    impact: '+30% de nouveaux clients'
  },
  {
    id: 6,
    icon: 'i-heroicons-clock',
    title: 'Gain de temps',
    description: 'Automatisez la collecte d\'avis et concentrez-vous sur votre cœur de métier.',
    impact: '5h économisées/semaine'
  }
]

// Computed
const calculatedROI = computed(() => {
  const customers = parseInt(monthlyCustomers.value) || 0
  const basket = parseInt(averageBasket.value) || 0
  const newCustomers = Math.round(customers * 0.3) // +30% de nouveaux clients
  const additionalRevenue = newCustomers * basket
  const planCost = 49 // Coût du plan Pro
  return Math.max(0, additionalRevenue - planCost)
})
</script>
