<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Explorez toutes nos catégories
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Trouvez exactement ce que vous cherchez parmi nos nombreuses catégories de services
        </p>
      </div>
      
      <!-- Categories grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
        <NuxtLink
          v-for="category in displayCategories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group"
        >
          <div class="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
            <!-- Icon -->
            <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <UIcon 
                :name="getCategoryIcon(category.name)" 
                class="w-6 h-6 text-blue-600"
              />
            </div>
            
            <!-- Name -->
            <h3 class="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
              {{ category.name }}
            </h3>
            
            <!-- Count -->
            <p class="text-xs text-gray-500">
              {{ getBusinessCount(category.id) }}
            </p>
          </div>
        </NuxtLink>
      </div>
      
      <!-- Show more/less button -->
      <div class="text-center">
        <UButton
          v-if="!showAll && categories.length > 12"
          @click="showAll = true"
          variant="outline"
          size="lg"
          class="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
        >
          Voir toutes les catégories ({{ categories.length }})
          <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-2" />
        </UButton>
        
        <UButton
          v-else-if="showAll && categories.length > 12"
          @click="showAll = false"
          variant="outline"
          size="lg"
          class="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
        >
          Voir moins
          <UIcon name="i-heroicons-chevron-up" class="w-4 h-4 ml-2" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCategories } from '~/composables/useCategories'
import { useBusinesses, type BusinessWithReviews } from '~/composables/useBusinesses'

const { categories, fetchCategories } = useCategories()
const { searchBusinesses } = useBusinesses()

const showAll = ref(false)
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
})

// Display categories based on showAll state
const displayCategories = computed(() => {
  return showAll.value ? categories.value : categories.value.slice(0, 12)
})

// Get business count for a category
const getBusinessCount = (categoryId: string) => {
  const count = businesses.value.filter((business: BusinessWithReviews) => business.category_id === categoryId).length
  return count === 1 ? '1 établissement' : `${count} établissements`
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
    'Technologie': 'i-heroicons-computer-desktop',
    'Sport': 'i-heroicons-trophy',
    'Automobile': 'i-heroicons-truck',
    'Alimentation': 'i-heroicons-cake',
    'Artisanat': 'i-heroicons-hammer'
  }
  
  return iconMap[categoryName] || 'i-heroicons-building-storefront'
}
</script>
