<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Catégories populaires
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Explorez les services les plus demandés dans votre région
        </p>
      </div>
      
      <!-- Categories grid/carousel -->
      <div class="relative">
        <div 
          ref="carousel"
          class="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style="scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div
            v-for="category in displayCategories"
            :key="category.id"
            class="flex-shrink-0 w-64"
          >
            <NuxtLink
              :to="`/search?category=${category.id}`"
              class="group block"
            >
              <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full">
                <!-- Category icon -->
                <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UIcon 
                    :name="getCategoryIcon(category.name)" 
                    class="w-8 h-8 text-blue-600"
                  />
                </div>
                
                <!-- Category info -->
                <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {{ category.name }}
                </h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                  {{ category.description || `Découvrez les meilleurs ${category.name.toLowerCase()} près de chez vous` }}
                </p>
                
                <!-- Business count -->
                <div class="flex items-center text-sm text-blue-600 font-medium">
                  <UIcon name="i-heroicons-building-storefront" class="w-4 h-4 mr-1" />
                  {{ getBusinessCount(category.id) }} établissements
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Navigation arrows -->
        <button
          v-if="canScrollLeft"
          @click="scrollLeft"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-blue-600 hover:text-blue-700"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-blue-600" />
        </button>
        
        <button
          v-if="canScrollRight"
          @click="scrollRight"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-blue-600 hover:text-blue-700"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-blue-600" />
        </button>
      </div>
      
      <!-- View all button -->
      <div class="text-center mt-12">
        <UButton
          to="/categories"
          variant="outline"
          size="lg"
          class="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
        >
          Voir toutes les catégories
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCategories } from '~/composables/useCategories'
import { useBusinesses, type BusinessWithReviews } from '~/composables/useBusinesses'

const { categories, fetchCategories, loading } = useCategories()
const { searchBusinesses } = useBusinesses()

const carousel = ref<HTMLElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const businesses = ref<BusinessWithReviews[]>([])

// Fetch data on mount
onMounted(async () => {
  await fetchCategories()
  
  // Get all businesses to count by category
  try {
    const result = await searchBusinesses({}, 1, 1000) // Get many businesses for counting
    businesses.value = result.data
  } catch (error) {
    console.error('Erreur lors du chargement des commerces:', error)
  }
  
  updateScrollButtons()
})

// Display first 8 categories
const displayCategories = computed(() => {
  return categories.value.slice(0, 8)
})

// Get business count for a category
const getBusinessCount = (categoryId: string) => {
  return businesses.value.filter(business => business.category_id === categoryId).length
}

// Get icon for category
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, string> = {
    'Restaurant': 'i-heroicons-building-storefront',
    'Hôtel': 'i-heroicons-building-office-2',
    'Shopping': 'i-heroicons-shopping-bag',
    'Service': 'i-heroicons-wrench-screwdriver',
    'Beauté': 'i-heroicons-sparkles',
    'Santé': 'i-heroicons-heart',
    'Loisir': 'i-heroicons-puzzle-piece',
    'Éducation': 'i-heroicons-academic-cap',
    'Transport': 'i-heroicons-truck',
    'Immobilier': 'i-heroicons-home',
    'Finance': 'i-heroicons-banknotes',
    'Technologie': 'i-heroicons-computer-desktop'
  }
  
  return iconMap[categoryName] || 'i-heroicons-building-storefront'
}

// Carousel navigation
const scrollLeft = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: -320, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 300)
  }
}

const scrollRight = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: 320, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 300)
  }
}

const updateScrollButtons = () => {
  if (carousel.value) {
    canScrollLeft.value = carousel.value.scrollLeft > 0
    canScrollRight.value = 
      carousel.value.scrollLeft < 
      carousel.value.scrollWidth - carousel.value.clientWidth
  }
}

// Listen to scroll events
onMounted(() => {
  if (carousel.value) {
    carousel.value.addEventListener('scroll', updateScrollButtons)
  }
})

onUnmounted(() => {
  if (carousel.value) {
    carousel.value.removeEventListener('scroll', updateScrollButtons)
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
