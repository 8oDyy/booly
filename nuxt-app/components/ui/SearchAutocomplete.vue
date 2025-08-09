<template>
  <div class="relative w-full">
    <!-- Barre de recherche -->
    <div class="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      <!-- Partie catégorie -->
      <div class="flex items-center pl-4 pr-2 border-r border-gray-200 relative">
        <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-gray-400 mr-2" />
        
        <div class="relative">
          <input
            ref="categoryInput"
            v-model="searchQuery"
            @focus="showCategoryDropdown = true"
            @blur="hideCategoryDropdown"
            @input="handleCategoryInput"
            @keydown="handleKeydown"
            @keyup.enter="performSearch"
            placeholder="Que cherchez-vous ?"
            class="bg-transparent border-0 outline-none text-gray-700 placeholder-gray-500 w-48 text-sm"
          />
          
          <!-- Dropdown catégories -->
          <div 
            v-if="showCategoryDropdown && filteredCategories.length" 
            class="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div
              v-for="(category, index) in filteredCategories"
              :key="category.id"
              @mousedown="selectCategory(category)"
              @mouseenter="highlightedIndex = index"
              class="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-sm transition-colors"
              :class="{ 'bg-blue-50': highlightedIndex === index }"
            >
              <UIcon name="i-heroicons-tag" class="w-4 h-4 text-gray-400" />
              <span class="font-medium">{{ category.name }}</span>
              <span v-if="category.description" class="text-gray-500 text-xs truncate">
                {{ category.description }}
              </span>
            </div>
            
            <!-- Message si pas de résultats -->
            <div v-if="searchQuery && !filteredCategories.length" class="px-4 py-2 text-sm text-gray-500">
              Aucune catégorie trouvée
            </div>
          </div>
        </div>
      </div>
      
      <!-- Partie localisation -->
      <div class="flex items-center flex-1 pl-2 pr-4">
        <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-gray-400 mr-2" />
        <input
          v-model="locationQuery"
          @keyup.enter="performSearch"
          placeholder="Où ?"
          class="bg-transparent border-0 outline-none text-gray-700 placeholder-gray-500 flex-1 text-sm"
        />
      </div>
      
      <!-- Bouton de recherche -->
      <UButton
        @click="performSearch"
        :loading="searchLoading"
        color="primary"
        size="sm"
        class="mr-2"
        icon="i-heroicons-magnifying-glass"
      >
        Rechercher
      </UButton>
    </div>
    
    <!-- Suggestions récentes (optionnel) -->
    <div v-if="showRecentSearches && recentSearches.length" class="mt-2">
      <div class="text-xs text-gray-500 mb-1">Recherches récentes :</div>
      <div class="flex flex-wrap gap-1">
        <UBadge
          v-for="search in recentSearches.slice(0, 5)"
          :key="search"
          @click="applyRecentSearch(search)"
          variant="soft"
          color="neutral"
          size="xs"
          class="cursor-pointer hover:bg-gray-200 transition-colors"
        >
          {{ search }}
        </UBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories, type Category } from '~/composables/useCategories'

// Props
interface Props {
  placeholder?: string
  showRecentSearches?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Que cherchez-vous ?',
  showRecentSearches: true,
  autoFocus: false
})

// Émissions
const emit = defineEmits<{
  search: [query: { category?: Category, searchTerm: string, location: string }]
}>()

// Composables
const router = useRouter()
const { categories, fetchCategories, searchCategories, loading } = useCategories()

// État réactif
const searchQuery = ref('')
const locationQuery = ref('')
const selectedCategory = ref<Category | null>(null)
const showCategoryDropdown = ref(false)
const highlightedIndex = ref(-1)
const searchLoading = ref(false)
const categoryInput = ref<HTMLInputElement>()

// Recherches récentes (stockées dans localStorage)
const recentSearches = ref<string[]>([])

// Catégories filtrées pour l'autocomplétion
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value.slice(0, 8) // Afficher les 8 premières catégories par défaut
  }
  return searchCategories(searchQuery.value).slice(0, 8)
})

// Gestion de l'input des catégories
const handleCategoryInput = () => {
  highlightedIndex.value = -1
  selectedCategory.value = null
}

// Gestion des touches clavier
const handleKeydown = (event: KeyboardEvent) => {
  if (!showCategoryDropdown.value || !filteredCategories.value.length) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredCategories.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectCategory(filteredCategories.value[highlightedIndex.value])
      } else {
        performSearch()
      }
      break
    case 'Escape':
      showCategoryDropdown.value = false
      highlightedIndex.value = -1
      break
  }
}

// Sélection d'une catégorie
const selectCategory = (category: Category) => {
  selectedCategory.value = category
  searchQuery.value = category.name
  showCategoryDropdown.value = false
  highlightedIndex.value = -1
  
  // Focus sur le champ de localisation
  nextTick(() => {
    const locationInput = document.querySelector('input[placeholder="Où ?"]') as HTMLInputElement
    locationInput?.focus()
  })
}

// Masquer le dropdown avec délai pour permettre les clics
const hideCategoryDropdown = () => {
  setTimeout(() => {
    showCategoryDropdown.value = false
    highlightedIndex.value = -1
  }, 150)
}

// Effectuer la recherche
const performSearch = async () => {
  if (!searchQuery.value.trim() && !locationQuery.value.trim()) return
  
  searchLoading.value = true
  
  try {
    // Sauvegarder la recherche récente
    if (searchQuery.value.trim()) {
      saveRecentSearch(searchQuery.value.trim())
    }
    
    // Émettre l'événement de recherche
    emit('search', {
      category: selectedCategory.value || undefined,
      searchTerm: searchQuery.value.trim(),
      location: locationQuery.value.trim()
    })
    
    // Naviguer vers la page de recherche
    const query: any = {}
    if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
    if (locationQuery.value.trim()) query.location = locationQuery.value.trim()
    if (selectedCategory.value) query.categoryId = selectedCategory.value.id
    
    await router.push({ path: '/search', query })
    
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
  } finally {
    searchLoading.value = false
  }
}

// Sauvegarder une recherche récente
const saveRecentSearch = (search: string) => {
  const searches = recentSearches.value.filter(s => s !== search)
  searches.unshift(search)
  recentSearches.value = searches.slice(0, 10) // Garder seulement les 10 dernières
  
  // Sauvegarder dans localStorage
  try {
    localStorage.setItem('booly_recent_searches', JSON.stringify(recentSearches.value))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des recherches récentes:', error)
  }
}

// Appliquer une recherche récente
const applyRecentSearch = (search: string) => {
  searchQuery.value = search
  selectedCategory.value = null
  performSearch()
}

// Charger les recherches récentes depuis localStorage
const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('booly_recent_searches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des recherches récentes:', error)
    recentSearches.value = []
  }
}

// Initialisation
onMounted(async () => {
  // Charger les catégories
  await fetchCategories()
  
  // Charger les recherches récentes
  loadRecentSearches()
  
  // Auto-focus si demandé
  if (props.autoFocus) {
    nextTick(() => {
      categoryInput.value?.focus()
    })
  }
})
</script>

<style scoped>
/* Styles pour les transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
