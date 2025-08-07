<template>
  <UPage>
    <!-- Sidebar gauche avec filtres -->
    <template #left>
      <UPageAside class="filters-aside">
        <SearchFilters 
          :selected-tags="selectedTags"
          @update:filters="handleFiltersUpdate"
        />
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

// Options de tri
const sortOptions = [
  { label: 'Recommandations', value: 'random' },
  { label: 'Plus récent', value: 'created_at' },
  { label: 'Note', value: 'average_rating' },
  { label: 'Distance', value: 'distance' },
  { label: 'Prix', value: 'price' }
]

// Note: Les types doivent être définis dans des fichiers TypeScript (.ts)

// Valeurs pour le sélecteur USelect
const items = ref(sortOptions.map(option => option.label))
const value = ref('Recommandations')

// Watcher pour mettre à jour le tri lorsque l'utilisateur change l'option
watch(value, (newValue) => {
  // Trouver l'option de tri correspondante
  const selectedOption = sortOptions.find(option => option.label === newValue)
  if (selectedOption) {
    // Mettre à jour sortBy et sortOrder en fonction de l'option sélectionnée
    sortBy.value = selectedOption.value
    
    // Définir l'ordre de tri en fonction de l'option
    if (selectedOption.value === 'average_rating') {
      // Note: tri décroissant
      sortOrder.value = 'desc'
    } else if (selectedOption.value === 'price') {
      // Prix: tri croissant
      sortOrder.value = 'asc'
    } else if (selectedOption.value === 'created_at') {
      // Plus récent: tri décroissant
      sortOrder.value = 'desc'
    } else if (selectedOption.value === 'random') {
      // Recommandations: tri aléatoire
      sortBy.value = 'created_at' // Fallback pour le tri aléatoire
      sortOrder.value = 'desc'
    } else {
      // Par défaut: tri décroissant
      sortOrder.value = 'desc'
    }
    
    // Réinitialiser la page courante et lancer la recherche
    currentPage.value = 1
    updateUrlParams()
    debouncedSearch()
    
    console.log(`🔍 Tri mis à jour: ${sortBy.value} (${sortOrder.value})`)
  }
})

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
const sortOrder = ref('desc')
const minRating = ref(0)
const maxDistance = ref(25)
const selectedPrices = ref([])
const selectedServices = ref([])
const selectedTags = ref([])  // Ajout des tags sélectionnés
const openNow = ref(false)

// État des données
const loading = ref(false)
const isInitialLoad = ref(true) // Nouvel état pour le chargement initial
const searchResults = ref(null)
const categories = ref([])
const cities = ref([])


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
      sortOrder: 'desc',
      priceRange: selectedPrices.value.length > 0 ? selectedPrices.value : undefined,
      tags: selectedTags.value.length > 0 ? selectedTags.value : undefined // Ajout des tags sélectionnés
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

// Fonction pour mettre à jour les paramètres d'URL
const updateUrlParams = () => {
  console.log('🔍 updateUrlParams appelé...')
  
  const params = {}
  
  // Ajouter les paramètres de recherche s'ils sont définis
  if (searchQuery.value) params.query = searchQuery.value
  if (selectedCategoryId.value) params.category = selectedCategoryId.value
  if (locationQuery.value) params.location = locationQuery.value
  
  // Ajouter les prix sélectionnés s'il y en a
  if (selectedPrices.value && selectedPrices.value.length > 0) {
    params.prices = selectedPrices.value.join(',')
  }
  
  // Ajouter les tags sélectionnés s'il y en a
  if (selectedTags.value && selectedTags.value.length > 0) {
    params.tags = selectedTags.value.join(',')
  }
  
  // Ajouter la note minimale si elle est supérieure à 0
  if (minRating.value > 0) {
    params.rating = minRating.value.toString()
  }
  
  // Ajouter la page courante si elle est différente de 1
  if (currentPage.value > 1) {
    params.page = currentPage.value.toString()
  }
  
  // Mettre à jour l'URL sans recharger la page
  navigateTo({
    path: '/search',
    query: params
  }, { replace: true })
  
  console.log('🔍 URL mise à jour avec les paramètres:', params)
}

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
  updateUrlParams()
  performSearch()
}

// Fonction pour gérer la mise à jour des filtres
const handleFiltersUpdate = (newFilters) => {
  console.log('🔍 handleFiltersUpdate appelé avec:', newFilters)
  
  // Mise à jour des prix sélectionnés
  if (newFilters.prices !== undefined) {
    console.log('🔍 Mise à jour des prix:', newFilters.prices)
    selectedPrices.value = Array.from(newFilters.prices)
  }
  
  // Mise à jour de la note minimale
  if (newFilters.rating !== undefined) {
    console.log('🔍 Mise à jour de la note minimale:', newFilters.rating)
    minRating.value = newFilters.rating
  }
  
  // Mise à jour des tags sélectionnés
  if (newFilters.tags !== undefined) {
    console.log('🔍 Mise à jour des tags:', newFilters.tags)
    selectedTags.value = Array.from(newFilters.tags)
  }
  
  // Réinitialiser la page courante
  currentPage.value = 1
  
  // Mettre à jour l'URL et lancer la recherche
  console.log('🔍 Appel de updateUrlParams...')
  updateUrlParams()
  console.log('🔍 Appel de debouncedSearch...')
  debouncedSearch()
}

const goToBusiness = (id) => {
  navigateTo(`/business/${id}`)
}

const handleBusinessSelected = (business) => {
  console.log('Business sélectionné depuis la carte:', business)
  goToBusiness(business.id)
}

// Récupérer les paramètres de l'URL
const route = useRoute()

// Fonction pour initialiser les filtres à partir des paramètres d'URL
const initializeFiltersFromUrl = () => {
  const query = route.query
  
  // Initialiser les paramètres de recherche
  searchQuery.value = query.query || ''
  locationQuery.value = query.location || ''
  selectedCategoryId.value = query.category || ''
  
  // Initialiser les prix sélectionnés
  if (query.prices) {
    selectedPrices.value = query.prices.split(',').filter(Boolean)
  } else {
    selectedPrices.value = []
  }
  
  // Initialiser les tags sélectionnés
  if (query.tags) {
    selectedTags.value = query.tags.split(',').filter(Boolean)
  } else {
    selectedTags.value = []
  }
  
  // Initialiser la note minimale
  if (query.rating) {
    minRating.value = parseInt(query.rating) || 0
  } else {
    minRating.value = 0
  }
  
  // Initialiser la page courante
  if (query.page) {
    currentPage.value = parseInt(query.page) || 1
  } else {
    currentPage.value = 1
  }
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
    
    // Initialiser les filtres à partir des paramètres d'URL
    initializeFiltersFromUrl()
    
    // Recherche initiale avec les filtres appliqués
    await performSearch()
  } catch (error) {
    console.error('❌ Erreur lors du chargement initial:', error)
    isInitialLoad.value = false
  }
})

// Surveiller les changements de page et relancer la recherche
watch(() => route.query, async (newQuery, oldQuery) => {
  console.log('🔁 Changement dans les paramètres d\'URL détecté:', newQuery)

  const hasChanged = ['query', 'category', 'location', 'rating', 'prices'].some(param => newQuery[param] !== oldQuery[param])
  if (!hasChanged) {
    console.log('ℹ️ Aucun changement significatif détecté dans les paramètres.')
    return
  }

  console.log('🔍 Changements détectés dans les paramètres, mise à jour des filtres...')
  currentPage.value = 1
  initializeFiltersFromUrl()
  await nextTick()
  await performSearch()
})

// Surveiller les changements de page pour relancer la recherche
watch(currentPage, async (newPage) => {
  console.log('📄 Changement de page détecté:', newPage)
  await performSearch()
  
  // Scroll automatique vers le haut de la page
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
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

/* Personnalisation des proportions de la page */
.custom-page-layout {
  --left-aside-width: 25%; /* 1/5 de l'écran */
  --right-aside-width: 25%; /* 2/5 de l'écran */
}

:deep(.custom-page-layout .u-page-grid) {
  grid-template-columns: var(--left-aside-width) 1fr var(--right-aside-width) !important;
}
</style>