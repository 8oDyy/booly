<template>
  <UPage>
    <!-- Sidebar gauche avec filtres -->
    <template #left>
      <UPageAside class="filters-aside">
        <SearchFilters />
      </UPageAside>
    </template>

    <!-- Sidebar droite avec carte - STICKY -->
    <template #right>
      <div v-if="viewMode !== 'map'" class="map-aside-container">
        <SearchInteractiveMap 
          :businesses="searchResults?.data || []"
          @business-selected="handleBusinessSelected"
        />
      </div>
    </template>

    <!-- Contenu principal -->
    <UPageBody>
      <!-- Titre et tri -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold">Résultats</h1>
          <p v-if="searchResults && !loading" class="text-sm text-gray-600 mt-1">
            {{ searchResults.count }} résultat{{ searchResults.count > 1 ? 's' : '' }} trouvé{{ searchResults.count > 1 ? 's' : '' }}
            - Page {{ currentPage }} sur {{ searchResults.totalPages }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <p>Trier par : </p>
          <USelect v-model="value" arrow :items="items" class="w-48 font-semibold" variant="none" />
        </div>
      </div>

      <!-- Loading state avec skeleton -->
      <div v-if="loading || isInitialLoad">
        <UPageList class="space-y-4">
          <SearchRestaurantCardSkeleton v-for="i in itemsPerPage" :key="i" />
        </UPageList>
      </div>

      <!-- Résultats -->
      <div v-else-if="searchResults?.data?.length">
        <!-- Vue liste -->
        <UPageList class="space-y-4">
          <SearchRestaurantCard
            v-for="business in searchResults.data"
            :key="business.id"
            :business="business"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="goToBusiness(business.id)"
          />
        </UPageList>

        <!-- Pagination -->
        <div v-if="searchResults.totalPages > 1" class="flex flex-col items-center mt-8 space-y-4">
          <UPagination
            v-model:page="currentPage"
            :page-count="searchResults.totalPages"
            :total="searchResults.count"
            show-last
            show-first
          />
          
          <!-- Debug pagination -->
          <div class="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            Debug: Page actuelle {{ currentPage }}/{{ searchResults.totalPages }} - Total: {{ searchResults.count }} - Items par page: {{ itemsPerPage }}
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else-if="!loading && !isInitialLoad" class="text-center py-12">
        <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun résultat trouvé
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    </UPageBody>
  </UPage>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import { navigateTo } from '#app'


// Meta
useHead({
  title: 'Resultat de votre recherche - Booly',
  meta: [
    { name: 'description', content: 'Trouvez le meilleur près de chez vous avec Booly' }
  ]
})

const items = ref(['Recommandations', 'Plus récent', 'Note', 'Distance', 'Prix'])
const value = ref('Recommandations')

// Composables
const { searchBusinesses, getCategories, getCities } = useBusinesses()

// État de la recherche
const searchQuery = ref('')
const locationQuery = ref('')
const selectedCategoryId = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const viewMode = ref('list')
const sortBy = ref('created_at')
const minRating = ref(0)
const maxDistance = ref(25)
const selectedPrices = ref([])
const selectedServices = ref([])
const openNow = ref(false)

// État des données
const loading = ref(false)
const isInitialLoad = ref(true) // Nouvel état pour le chargement initial
const searchResults = ref(null)
const categories = ref([])
const cities = ref([])

// Options
const priceOptions = [
  { label: '€ - Économique', value: 1 },
  { label: '€€ - Modéré', value: 2 },
  { label: '€€€ - Cher', value: 3 },
  { label: '€€€€ - Très cher', value: 4 }
]

const serviceOptions = [
  { label: 'Livraison', value: 'delivery' },
  { label: 'À emporter', value: 'takeout' },
  { label: 'Réservation', value: 'reservation' },
  { label: 'Terrasse', value: 'outdoor' },
  { label: 'Parking', value: 'parking' },
  { label: 'WiFi', value: 'wifi' },
  { label: 'Accessible PMR', value: 'wheelchair' }
]

const distanceOptions = [
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 }
]

const sortOptions = [
  { label: 'Recommandé', value: 'recommended' },
  { label: 'Plus récent', value: 'created_at' },
  { label: 'Nom', value: 'name' },
  { label: 'Note', value: 'rating' },
  { label: 'Distance', value: 'distance' },
  { label: 'Prix', value: 'price' }
]

// Options calculées
const categoryOptions = computed(() => [
  { label: 'Toutes les catégories', value: '' },
  ...categories.value.map(cat => ({ label: cat.name, value: cat.id }))
])

const cityOptions = computed(() => [
  { label: 'Toutes les villes', value: '' },
  ...cities.value.map(city => ({ label: city, value: city }))
])

// Recherche avec debounce
const debouncedSearch = debounce(() => {
  performSearch()
}, 500)

// Méthodes
const performSearch = async () => {
  loading.value = true
  try {
    const filters = {
      query: searchQuery.value || undefined,
      location: locationQuery.value || undefined,
      categoryId: selectedCategoryId.value || undefined,
      minRating: minRating.value > 0 ? minRating.value : undefined,
      sortBy: sortBy.value,
      sortOrder: 'desc'
    }

    console.log('🔍 Recherche avec filtres:', filters, 'Page:', currentPage.value)
    
    const result = await searchBusinesses(
      filters,
      currentPage.value,
      itemsPerPage
    )
    
    searchResults.value = result
    console.log('✅ Résultats de recherche:', result)
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error)
    searchResults.value = { data: [], count: 0, page: 1, limit: itemsPerPage, totalPages: 0 }
  } finally {
    loading.value = false
    isInitialLoad.value = false // Fin du chargement initial
  }
}

// Surveiller les changements de page et relancer la recherche
watch(currentPage, async (newPage, oldPage) => {
  console.log('📄 Changement de page détecté:', newPage, 'Ancienne page:', oldPage)
  
  if (newPage === oldPage) {
    console.log('⚠️ Même page, pas de changement nécessaire')
    return
  }
  
  console.log('📄 Lancement de la recherche pour la page:', newPage)
  
  // Attendre que la réactivité se propage
  await nextTick()
  
  // Relancer la recherche avec la nouvelle page
  await performSearch()
  
  // Scroll vers le haut après changement de page
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const clearFilters = () => {
  searchQuery.value = ''
  locationQuery.value = ''
  selectedCategoryId.value = ''
  minRating.value = 0
  maxDistance.value = 25
  selectedPrices.value = []
  selectedServices.value = []
  openNow.value = false
  currentPage.value = 1
  performSearch()
}

const goToBusiness = (id) => {
  navigateTo(`/business/${id}`)
}

const handleBusinessSelected = (business) => {
  console.log('Business sélectionné depuis la carte:', business)
  goToBusiness(business.id)
}

// Charger les données initiales
onMounted(async () => {
  console.log('🚀 Chargement des données initiales...')
  
  try {
    // Charger les catégories
    const categoriesResult = await getCategories()
    categories.value = categoriesResult || []
    console.log('📂 Catégories chargées:', categories.value)
    
    // Charger les villes
    const citiesResult = await getCities()
    cities.value = citiesResult || []
    console.log('🏙️ Villes chargées:', cities.value)
    
    // Recherche initiale
    await performSearch()
  } catch (error) {
    console.error('❌ Erreur lors du chargement initial:', error)
    isInitialLoad.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Conteneur de la carte sticky sans padding ni marge */
.map-aside-container {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* Override des styles Nuxt UI pour supprimer les paddings */
:deep(.map-aside-container) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.map-aside-container > *) {
  margin: 0 !important;
  padding: 0 !important;
}
</style>