<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header de la page -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Recherche de restaurants
            </h1>
          </div>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex gap-6">
          <!-- Sidebar avec filtres -->
          <div class="w-80 flex-shrink-0">
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">Filtres</h3>
                  <UButton variant="ghost" size="xs" @click="clearFilters">
                    Effacer tout
                  </UButton>
                </div>
              </template>
  
              <div class="space-y-6">
                <!-- Recherche -->
                <div>
                  <h4 class="font-medium mb-3">Recherche</h4>
                  <div class="space-y-3">
                    <UInput
                      v-model="searchQuery"
                      placeholder="Restaurants, bars..."
                      icon="i-heroicons-magnifying-glass"
                      @input="debouncedSearch"
                    />
                    <USelectMenu
                      v-model="locationQuery"
                      :options="cityOptions"
                      placeholder="Choisir une ville"
                      icon="i-heroicons-map-pin"
                      searchable
                      @change="performSearch"
                    />
                  </div>
                </div>
  
                <UDivider />
  
                <!-- Filtre par catégorie -->
                <div>
                  <h4 class="font-medium mb-3">Catégorie</h4>
                  <USelectMenu
                    v-model="selectedCategoryId"
                    :options="categoryOptions"
                    placeholder="Toutes les catégories"
                    @change="performSearch"
                  />
                </div>
  
                <UDivider />
  
                <!-- Filtre par note -->
                <div>
                  <h4 class="font-medium mb-3">Note minimum</h4>
                  <URange 
                    v-model="minRating" 
                    :min="0" 
                    :max="5" 
                    :step="0.5"
                    @change="performSearch"
                  />
                  <div class="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span>{{ minRating }}</span>
                    <span>5</span>
                  </div>
                </div>
  
                <UDivider />
  
                <!-- Filtre par distance -->
                <div>
                  <h4 class="font-medium mb-3">Distance maximale</h4>
                  <URadioGroup 
                    v-model="maxDistance" 
                    :options="distanceOptions"
                    @change="performSearch"
                  />
                </div>
              </div>
            </UCard>
          </div>
  
          <!-- Contenu principal -->
          <div class="flex-1">
            <!-- Barre d'outils -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ locationQuery ? `Restaurants à ${locationQuery}` : 'Tous les restaurants' }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ searchResults?.count || 0 }} résultats trouvés
                </p>
              </div>
              <div class="flex items-center gap-4">
                <USelectMenu
                  v-model="sortBy"
                  :options="sortOptions"
                  placeholder="Trier par"
                  class="w-48"
                  @change="performSearch"
                />
                <UButtonGroup size="sm" orientation="horizontal">
                  <UButton
                    :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                    icon="i-heroicons-list-bullet"
                    @click="viewMode = 'list'"
                  />
                  <UButton
                    :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                    icon="i-heroicons-squares-2x2"
                    @click="viewMode = 'grid'"
                  />
                </UButtonGroup>
              </div>
            </div>
  
            <!-- Loading state -->
            <div v-if="loading" class="flex justify-center py-12">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
            </div>
  
            <!-- Résultats -->
            <div v-else-if="searchResults?.data?.length">
              <!-- Vue liste -->
              <div v-if="viewMode === 'list'" class="space-y-4">
                <UCard
                  v-for="business in searchResults.data"
                  :key="business.id"
                  class="hover:shadow-lg transition-shadow cursor-pointer"
                  @click="goToBusiness(business.id)"
                >
                  <div class="flex gap-4">
                    <UAvatar
                      :src="business.photos?.[0]?.url || '/placeholder.svg?height=200&width=300'"
                      :alt="business.name"
                      size="xl"
                      class="flex-shrink-0"
                    />
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
                            {{ business.name }}
                          </h3>
                          
                          <div class="flex items-center gap-2 mt-1">
                            <div class="flex items-center">
                              <UIcon
                                v-for="i in 5"
                                :key="i"
                                name="i-heroicons-star-solid"
                                :class="i <= (business.avg_rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                                class="w-4 h-4"
                              />
                            </div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">
                              {{ business.avg_rating?.toFixed(1) || 'N/A' }} ({{ business.review_count || 0 }} avis)
                            </span>
                          </div>
                          
                          <div class="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>{{ business.category?.name || 'Non catégorisé' }}</span>
                            <span class="flex items-center gap-1">
                              <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                              {{ business.city }}
                            </span>
                            <span v-if="business.phone" class="flex items-center gap-1">
                              <UIcon name="i-heroicons-phone" class="w-4 h-4" />
                              {{ business.phone }}
                            </span>
                          </div>
                        </div>
                        
                        <div class="text-right flex-shrink-0">
                          <UBadge
                            color="green"
                            variant="soft"
                            size="sm"
                          >
                            Ouvert
                          </UBadge>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {{ business.address }}
                          </p>
                        </div>
                      </div>
                      
                      <p v-if="business.description" class="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                        {{ business.description }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </div>
  
              <!-- Vue grille -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard
                  v-for="business in searchResults.data"
                  :key="business.id"
                  class="hover:shadow-lg transition-shadow cursor-pointer"
                  @click="goToBusiness(business.id)"
                >
                  <template #header>
                    <div class="relative">
                      <img
                        :src="business.photos?.[0]?.url || '/placeholder.svg?height=200&width=300'"
                        :alt="business.name"
                        class="w-full h-48 object-cover"
                      />
                      <UBadge
                        color="green"
                        variant="soft"
                        size="sm"
                        class="absolute top-2 right-2"
                      >
                        Ouvert
                      </UBadge>
                    </div>
                  </template>
  
                  <div class="space-y-3">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
                        {{ business.name }}
                      </h3>
                      
                      <div class="flex items-center gap-2 mt-1">
                        <div class="flex items-center">
                          <UIcon
                            v-for="i in 5"
                            :key="i"
                            name="i-heroicons-star-solid"
                            :class="i <= (business.avg_rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                            class="w-4 h-4"
                          />
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                          {{ business.avg_rating?.toFixed(1) || 'N/A' }} ({{ business.review_count || 0 }})
                        </span>
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{{ business.category?.name || 'Non catégorisé' }}</span>
                      <span>{{ business.city }}</span>
                    </div>
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                      {{ business.address }}
                    </p>
                  </div>
                </UCard>
              </div>
  
              <!-- Pagination -->
              <div class="flex justify-center mt-8">
                <UPagination
                  v-model="currentPage"
                  :page-count="searchResults.totalPages"
                  :total="searchResults.count"
                  show-last
                  show-first
                  @update:model-value="performSearch"
                />
              </div>
            </div>
  
            <!-- État vide -->
            <div v-else class="text-center py-12">
              <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun résultat trouvé
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { debounce } from 'lodash-es'
  import { useBusinesses } from '~/composables/useBusinesses'

  
  // Meta
  useHead({
    title: 'Recherche de restaurants - Yelp',
    meta: [
      { name: 'description', content: 'Trouvez les meilleurs restaurants près de chez vous avec Yelp' }
    ]
  })
  
  // Composables
  const { searchBusinesses, getCategories, getCities } = useBusinesses()
  
  // État de la recherche
  const searchQuery = ref('')
  const locationQuery = ref('')
  const selectedCategoryId = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 9
  const viewMode = ref('list')
  const sortBy = ref('created_at')
  const minRating = ref(0)
  const maxDistance = ref(25)
  
  // État des données
  const loading = ref(false)
  const searchResults = ref(null)
  const categories = ref([])
  const cities = ref([])
  
  // Options
  const distanceOptions = [
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '25 km', value: 25 },
    { label: '50 km', value: 50 }
  ]
  
  const sortOptions = [
    { label: 'Plus récent', value: 'created_at' },
    { label: 'Nom', value: 'name' },
    { label: 'Ville', value: 'city' }
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
  
      searchResults.value = await searchBusinesses(
        filters,
        currentPage.value,
        itemsPerPage
      )
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
    } finally {
      loading.value = false
    }
  }
  
  const clearFilters = () => {
    searchQuery.value = ''
    locationQuery.value = ''
    selectedCategoryId.value = ''
    minRating.value = 0
    maxDistance.value = 25
    currentPage.value = 1
    performSearch()
  }
  
  const goToBusiness = (id) => {
    navigateTo(`/business/${id}`)
  }
  
  // Charger les données initiales
  onMounted(async () => {
    try {
      [categories.value, cities.value] = await Promise.all([
        getCategories(),
        getCities()
      ])
      
      // Recherche initiale
      await performSearch()
    } catch (error) {
      console.error('Erreur lors du chargement initial:', error)
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
  </style>
  