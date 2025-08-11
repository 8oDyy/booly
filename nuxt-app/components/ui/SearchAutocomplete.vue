<template>
  <div class="relative w-full">
    <!-- Barre de recherche moderne inspirée de Yelp -->
    <div class="bg-white rounded-2xl p-1 md:p-1.5 shadow-xl border border-gray-100">
      <div class="flex flex-row gap-1 md:gap-2">
        <!-- Service search avec autocomplétion -->
        <div class="flex-1 relative">
          <UIcon name="i-heroicons-magnifying-glass" class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5 z-10" />
          <input
            ref="categoryInput"
            v-model="categoryQuery"
            @input="handleCategoryInput"
            @keydown="handleCategoryKeydown"
            @focus="showCategorySuggestions = true"
            @blur="hideCategorySuggestions"
            @keyup.enter="performSearch"
            :placeholder="props.placeholder"
            class="w-full h-8 md:h-9 pl-8 md:pl-12 pr-2 md:pr-4 text-sm md:text-base text-gray-900 placeholder-gray-500 border-0 outline-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          
          <!-- Dropdown des suggestions de catégories -->
          <div 
            v-if="showCategorySuggestions && filteredCategories.length > 0"
            class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div
              v-for="(category, index) in filteredCategories"
              :key="category.id"
              :class="[
                'px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2',
                { 'bg-blue-50': index === selectedCategoryIndex }
              ]"
              @mousedown.prevent="selectCategory(category)"
            >
              <UIcon name="i-heroicons-tag" class="w-4 h-4 text-gray-400" />
              <span class="text-sm">{{ category.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- Location search avec autocomplétion -->
        <div class="flex-1 relative">
          <UIcon name="i-heroicons-map-pin" class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5 z-10" />
          <input
            ref="locationInput"
            v-model="locationQuery"
            @input="handleLocationInput"
            @keydown="handleLocationKeydown"
            @focus="showLocationSuggestions = true"
            @blur="hideLocationSuggestions"
            @keyup.enter="performSearch"
            placeholder="Où ?"
            class="w-full h-8 md:h-9 pl-8 md:pl-12 pr-2 md:pr-4 text-sm md:text-base text-gray-900 placeholder-gray-500 border-0 outline-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          
          <!-- Dropdown des suggestions de villes -->
          <div 
            v-if="showLocationSuggestions && filteredCities.length > 0"
            class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div
              v-for="(city, index) in filteredCities"
              :key="city"
              :class="[
                'px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2',
                { 'bg-blue-50': index === selectedLocationIndex }
              ]"
              @mousedown.prevent="selectLocation(city)"
            >
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400" />
              <span class="text-sm">{{ city }}</span>
            </div>
          </div>
        </div>
        
        <!-- Search button -->
        <UButton
          @click="performSearch"
          :loading="searchLoading"
          size="sm"
          class="h-8 md:h-9 px-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 md:w-5 md:h-5" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '~/composables/useCategories'

// Props
interface Props {
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Que cherchez-vous ?'
})

// Composables
const router = useRouter()
const { fetchCategories, searchCategories } = useCategories()
const { getCities } = useBusinesses()

// État réactif pour la recherche
const categoryQuery = ref('')
const locationQuery = ref('')
const searchLoading = ref(false)

// État pour l'autocomplétion des catégories
const showCategorySuggestions = ref(false)
const selectedCategoryIndex = ref(-1)
const selectedCategoryId = ref('')
const allCategories = ref<any[]>([])

// État pour l'autocomplétion des villes
const showLocationSuggestions = ref(false)
const selectedLocationIndex = ref(-1)
const allCities = ref<string[]>([])

// Catégories filtrées pour l'autocomplétion
const filteredCategories = computed(() => {
  if (!categoryQuery.value.trim()) return allCategories.value.slice(0, 8)
  return searchCategories(categoryQuery.value).slice(0, 8)
})

// Villes filtrées pour l'autocomplétion
const filteredCities = computed(() => {
  if (!locationQuery.value.trim()) return allCities.value.slice(0, 8)
  
  const searchTerm = locationQuery.value.toLowerCase().trim()
  return allCities.value
    .filter(city => city.toLowerCase().includes(searchTerm))
    .slice(0, 8)
})

// Charger les catégories et villes au montage
onMounted(async () => {
  try {
    // Charger les catégories
    allCategories.value = await fetchCategories()
    
    // Charger les villes
    allCities.value = await getCities()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})

// Gestion de l'input de catégorie
const handleCategoryInput = () => {
  selectedCategoryId.value = '' // Reset de la catégorie sélectionnée
  selectedCategoryIndex.value = -1
  showCategorySuggestions.value = true
}

// Gestion des touches clavier pour la navigation
const handleCategoryKeydown = (event: KeyboardEvent) => {
  if (!showCategorySuggestions.value || filteredCategories.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedCategoryIndex.value = Math.min(
        selectedCategoryIndex.value + 1,
        filteredCategories.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedCategoryIndex.value = Math.max(selectedCategoryIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedCategoryIndex.value >= 0) {
        selectCategory(filteredCategories.value[selectedCategoryIndex.value])
      } else {
        performSearch()
      }
      break
    case 'Escape':
      hideCategorySuggestions()
      break
  }
}

// Sélectionner une catégorie
const selectCategory = (category: any) => {
  categoryQuery.value = category.name
  selectedCategoryId.value = category.id
  hideCategorySuggestions()
  performSearch()
}

// Masquer les suggestions de catégories
const hideCategorySuggestions = () => {
  setTimeout(() => {
    showCategorySuggestions.value = false
    selectedCategoryIndex.value = -1
  }, 150)
}

// Gestion de l'input de localisation
const handleLocationInput = () => {
  selectedLocationIndex.value = -1
  showLocationSuggestions.value = true
}

// Gestion des touches clavier pour la navigation des villes
const handleLocationKeydown = (event: KeyboardEvent) => {
  if (!showLocationSuggestions.value || filteredCities.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedLocationIndex.value = Math.min(
        selectedLocationIndex.value + 1,
        filteredCities.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedLocationIndex.value = Math.max(selectedLocationIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedLocationIndex.value >= 0) {
        selectLocation(filteredCities.value[selectedLocationIndex.value])
      } else {
        performSearch()
      }
      break
    case 'Escape':
      hideLocationSuggestions()
      break
  }
}

// Sélectionner une ville
const selectLocation = (city: string) => {
  locationQuery.value = city
  hideLocationSuggestions()
  performSearch()
}

// Masquer les suggestions de villes
const hideLocationSuggestions = () => {
  setTimeout(() => {
    showLocationSuggestions.value = false
    selectedLocationIndex.value = -1
  }, 150)
}

// Effectuer la recherche avec support des catégories
const performSearch = async () => {
  if (!categoryQuery.value.trim() && !locationQuery.value.trim()) return
  
  searchLoading.value = true
  
  try {
    // Construire les paramètres de recherche
    const query: any = {}
    
    // Si une catégorie spécifique est sélectionnée, utiliser son ID
    if (selectedCategoryId.value) {
      query.category = selectedCategoryId.value
    } else if (categoryQuery.value.trim()) {
      // Sinon, recherche textuelle générale
      query.query = categoryQuery.value.trim()
    }
    
    if (locationQuery.value.trim()) {
      query.location = locationQuery.value.trim()
    }
    
    await router.push({ path: '/search', query })
    
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
  } finally {
    searchLoading.value = false
  }
}
</script>

<style scoped>
/* Styles pour les transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}


</style>
