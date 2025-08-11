<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Statistiques</h1>
      <USelect 
        v-model="selectedPeriod" 
        :options="periodOptions"
        placeholder="Période"
      />
    </div>

    <!-- Métriques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Vues totales</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalViews }}</p>
            <p class="text-xs text-green-600">+12% vs période précédente</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Note moyenne</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.averageRating }}</p>
            <p class="text-xs text-green-600">+0.2 vs période précédente</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Nouveaux avis</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.newReviews }}</p>
            <p class="text-xs text-red-600">-5% vs période précédente</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Taux d'engagement</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.engagementRate }}%</p>
            <p class="text-xs text-green-600">+8% vs période précédente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Évolution des avis -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution des avis</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-gray-500 text-sm">Graphique à venir</p>
            <p class="text-gray-400 text-xs">Intégration prévue prochainement</p>
          </div>
        </div>
      </div>

      <!-- Répartition des notes -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition des notes</h3>
        <div class="space-y-3">
          <div v-for="(rating, index) in ratingDistribution" :key="index" class="flex items-center">
            <div class="flex items-center w-20">
              <span class="text-sm font-medium text-gray-700 mr-2">{{ 5 - index }}</span>
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div class="flex-1 mx-3">
              <div class="bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${rating.percentage}%` }"
                ></div>
              </div>
            </div>
            <span class="text-sm text-gray-600 w-12 text-right">{{ rating.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des performances -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Performance détaillée</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métrique</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur actuelle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période précédente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Évolution</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="metric in detailedMetrics" :key="metric.name">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ metric.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ metric.current }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ metric.previous }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  metric.change > 0 ? 'bg-green-100 text-green-800' : 
                  metric.change < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                ]">
                  {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const selectedPeriod = ref('30d')

const periodOptions = [
  { label: '7 derniers jours', value: '7d' },
  { label: '30 derniers jours', value: '30d' },
  { label: '3 derniers mois', value: '3m' },
  { label: '6 derniers mois', value: '6m' },
  { label: '1 an', value: '1y' }
]

// Données mockées - à remplacer par de vraies données
const stats = ref({
  totalViews: '2,847',
  averageRating: '4.3',
  newReviews: '23',
  engagementRate: '67'
})

const ratingDistribution = ref([
  { count: 45, percentage: 75 }, // 5 étoiles
  { count: 12, percentage: 20 }, // 4 étoiles
  { count: 3, percentage: 5 },   // 3 étoiles
  { count: 0, percentage: 0 },   // 2 étoiles
  { count: 0, percentage: 0 }    // 1 étoile
])

const detailedMetrics = ref([
  { name: 'Vues de profil', current: '2,847', previous: '2,541', change: 12 },
  { name: 'Clics sur téléphone', current: '156', previous: '142', change: 10 },
  { name: 'Clics sur site web', current: '89', previous: '76', change: 17 },
  { name: 'Demandes d\'itinéraire', current: '234', previous: '198', change: 18 },
  { name: 'Avis laissés', current: '23', previous: '27', change: -15 },
  { name: 'Photos ajoutées', current: '8', previous: '12', change: -33 }
])

const loadStats = async () => {
  try {
    // TODO: Charger les vraies statistiques depuis Supabase
    console.log('Chargement des statistiques pour la période:', selectedPeriod.value)
    
    // Les données sont déjà mockées ci-dessus
    // Dans une vraie implémentation, on ferait un appel API ici
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

onMounted(() => {
  loadStats()
})

// Recharger les stats quand la période change
watch(selectedPeriod, () => {
  loadStats()
})
</script>
