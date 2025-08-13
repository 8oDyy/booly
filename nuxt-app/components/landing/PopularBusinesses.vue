<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Commerces populaires
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez les établissements les mieux notés par la communauté
        </p>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-2xl h-64"></div>
        </div>
      </div>
      
      <!-- Businesses grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <NuxtLink
          v-for="business in displayBusinesses"
          :key="business.id"
          :to="`/business/${business.id}`"
          class="group block"
        >
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
            <!-- Business image -->
            <div class="relative h-48 bg-gray-200 overflow-hidden">
              <img 
                v-if="business.photos && business.photos.length > 0"
                :src="business.photos[0].url" 
                :alt="business.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center">
                <UIcon name="i-heroicons-building-storefront" class="w-16 h-16 text-blue-600" />
              </div>
              
              <!-- Rating badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400 mr-1" />
                <span class="text-sm font-medium text-gray-900">{{ business.average_rating?.toFixed(1) || 'N/A' }}</span>
              </div>
              
              <!-- Verified badge -->
              <div class="absolute top-4 left-4 bg-blue-500 text-white rounded-full px-3 py-1 flex items-center text-xs font-medium">
                <UIcon name="i-heroicons-shield-check" class="w-3 h-3 mr-1" />
                Vérifié
              </div>
            </div>
            
            <!-- Business info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                  {{ business.name }}
                </h3>
              </div>
              
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ business.description || 'Découvrez ce commerce local recommandé par la communauté' }}
              </p>
              
              <!-- Category and location -->
              <div class="flex items-center text-sm text-gray-500 mb-4">
                <UIcon name="i-heroicons-tag" class="w-4 h-4 mr-1" />
                <span class="mr-3">{{ getCategoryName(business.category_id || '') }}</span>
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
                <span class="line-clamp-1">{{ business.address || 'Adresse non renseignée' }}</span>
              </div>
              
              <!-- Stats -->
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center text-gray-600">
                  <UIcon name="i-heroicons-chat-bubble-left" class="w-4 h-4 mr-1" />
                  <span>{{ business.computed_review_count || 0 }} avis</span>
                </div>
                
                <div class="flex items-center text-blue-600 font-medium">
                  <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
                  <span>Populaire</span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
      
      <!-- View all businesses button -->
      <div class="text-center">
        <UButton
          to="/search"
          variant="outline"
          size="lg"
          color="secondary"
          class="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Voir tous les commerces
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useBusinesses, type BusinessWithReviews } from '~/composables/useBusinesses'
import { useCategories } from '~/composables/useCategories'

const { searchBusinesses } = useBusinesses()
const { categories, fetchCategories } = useCategories()

const loading = ref(false)
const businesses = ref<BusinessWithReviews[]>([])

// Fetch data on mount
onMounted(async () => {
  loading.value = true
  try {
    console.log('🏢 PopularBusinesses: Chargement des établissements...')
    await fetchCategories()
    
    // Get all businesses (no rating filter to include all establishments)
    const result = await searchBusinesses(
      { sortBy: 'created_at', sortOrder: 'desc' }, // Trier par date de création, plus récents en premier
      1,
      12 // Récupérer plus d'établissements pour avoir plus de choix
    )
    businesses.value = result.data
    console.log('✅ PopularBusinesses: Établissements chargés:', businesses.value.length)
    console.log('🔍 PopularBusinesses: Premier établissement (exemple):', businesses.value[0])
  } catch (error) {
    console.error('❌ PopularBusinesses: Erreur lors du chargement des commerces populaires:', error)
  } finally {
    loading.value = false
    console.log('🏁 PopularBusinesses: Chargement terminé, loading =', loading.value)
  }
})

// Get top 6 businesses sorted by rating and review count
const displayBusinesses = computed(() => {
  console.log('📊 PopularBusinesses: Calcul displayBusinesses, total businesses:', businesses.value.length)
  
  if (businesses.value.length === 0) {
    console.log('📊 PopularBusinesses: Aucun établissement disponible')
    return []
  }

  // Trier tous les établissements par priorité :
  // 1. Ceux avec des notes élevées
  // 2. Ceux avec des avis (même sans note moyenne)
  // 3. Ceux sans avis par date de création
  const sortedBusinesses = businesses.value
    .slice() // Copie pour ne pas modifier l'original
    .sort((a: BusinessWithReviews, b: BusinessWithReviews) => {
      // Priorité 1: Établissements avec des notes
      const aHasRating = a.average_rating && a.average_rating > 0
      const bHasRating = b.average_rating && b.average_rating > 0
      
      if (aHasRating && !bHasRating) return -1
      if (!aHasRating && bHasRating) return 1
      
      // Si les deux ont des notes, trier par note puis par nombre d'avis
      if (aHasRating && bHasRating) {
        const ratingDiff = (b.average_rating || 0) - (a.average_rating || 0)
        if (ratingDiff !== 0) return ratingDiff
        return (b.computed_review_count || 0) - (a.computed_review_count || 0)
      }
      
      // Priorité 2: Établissements avec des avis (même sans note moyenne)
      const aHasReviews = (a.computed_review_count || 0) > 0
      const bHasReviews = (b.computed_review_count || 0) > 0
      
      if (aHasReviews && !bHasReviews) return -1
      if (!aHasReviews && bHasReviews) return 1
      
      // Si les deux ont des avis, trier par nombre d'avis
      if (aHasReviews && bHasReviews) {
        return (b.computed_review_count || 0) - (a.computed_review_count || 0)
      }
      
      // Priorité 3: Trier par date de création (plus récent en premier)
      const aDate = new Date(a.created_at || '').getTime()
      const bDate = new Date(b.created_at || '').getTime()
      return bDate - aDate
    })

  const result = sortedBusinesses.slice(0, 6)
  
  console.log('📊 PopularBusinesses: Établissements sélectionnés:', result.length)
  console.log('📊 PopularBusinesses: Détail des établissements:')
  result.forEach((business, index) => {
    console.log(`  ${index + 1}. ${business.name} - Note: ${business.average_rating || 'N/A'} - Avis: ${business.computed_review_count || 0}`)
  })

  return result
})

// Get category name by ID
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category?.name || 'Service'
}

// Format view count
const formatViews = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k vues`
  }
  return `${count} vues`
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
