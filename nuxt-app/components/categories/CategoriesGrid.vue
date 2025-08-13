<template>
  <div class="py-12">
    <UContainer>
      <!-- Filtres et tri -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ filteredCategories.length }} catégorie{{ filteredCategories.length > 1 ? 's' : '' }}
            <span v-if="searchQuery" class="text-gray-500">pour "{{ searchQuery }}"</span>
          </h2>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Tri -->
          <USelect
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Trier par"
            class="w-40"
            @change="handleSort"
          />
          
          <!-- Vue -->
          <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Grille de catégories -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-2xl h-48"></div>
        </div>
      </div>
      
      <div v-else-if="filteredCategories.length === 0" class="text-center py-16">
        <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
        <p class="text-gray-500 mb-6">
          <span v-if="searchQuery">Essayez avec d'autres mots-clés ou</span>
          <span v-else>Il semble qu'il n'y ait pas encore de catégories.</span>
        </p>
        <UButton
          v-if="searchQuery"
          variant="outline"
          @click="clearSearch"
        >
          Voir toutes les catégories
        </UButton>
      </div>
      
      <!-- Vue grille -->
      <div 
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <CategoryCard
          v-for="category in paginatedCategories"
          :key="category.id"
          :category="category"
        />
      </div>
      
      <!-- Vue liste -->
      <div v-else class="space-y-4">
        <CategoryListItem
          v-for="category in paginatedCategories"
          :key="category.id"
          :category="category"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <UPagination
          v-model="currentPage"
          :total="filteredCategories.length"
          :page-count="itemsPerPage"
          :max="7"
          show-last
          show-first
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'
import CategoryCard from './CategoryCard.vue'
import CategoryListItem from './CategoryListItem.vue'

type Category = Database['public']['Tables']['categories']['Row']

interface Props {
  categories: Category[]
  loading: boolean
  searchQuery: string
}

interface Emits {
  (e: 'clearSearch'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// État local
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12

// Options de tri
const sortOptions = [
  { label: 'Nom (A-Z)', value: 'name' },
  { label: 'Nom (Z-A)', value: 'name_desc' },
  { label: 'Plus récentes', value: 'created_at_desc' },
  { label: 'Plus anciennes', value: 'created_at' }
]

// Catégories filtrées et triées
const filteredCategories = computed(() => {
  let filtered = [...props.categories]
  
  // Filtrage par recherche
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(category => 
      category.name.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query))
    )
  }
  
  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'name_desc':
        return b.name.localeCompare(a.name)
      case 'created_at_desc':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      case 'created_at':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      default:
        return 0
    }
  })
  
  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage))

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCategories.value.slice(start, end)
})

// Méthodes
const handleSort = () => {
  currentPage.value = 1 // Reset à la première page lors du changement de tri
}

const clearSearch = () => {
  emit('clearSearch')
  currentPage.value = 1
}

// Reset pagination quand la recherche change
watch(() => props.searchQuery, () => {
  currentPage.value = 1
})
</script>
