<template>
  <div>
    <!-- Header avec recherche -->
    <CategoriesSearchHeader 
      :total-categories="categories.length"
      @search="handleSearch"
    />
    
    <!-- Catégories populaires -->
    <PopularCategories
      :categories="categories"
      :loading="loading"
      @show-all="scrollToAllCategories"
    />
    
    <!-- Toutes les catégories -->
    <div ref="allCategoriesRef">
      <CategoriesGrid
        :categories="categories"
        :loading="loading"
        :search-query="searchQuery"
        @clear-search="clearSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesPage } from '~/composables/useCategoriesPage'
import CategoriesSearchHeader from '~/components/categories/CategoriesSearchHeader.vue'
import PopularCategories from '~/components/categories/PopularCategories.vue'
import CategoriesGrid from '~/components/categories/CategoriesGrid.vue'

// Composable pour les catégories (avec types Supabase complets)
const { categories, loading, fetchCategories } = useCategoriesPage()

// État local
const searchQuery = ref('')
const allCategoriesRef = ref<HTMLElement>()

// Charger les catégories au montage
onMounted(async () => {
  await fetchCategories()
})

// Gestion de la recherche
const handleSearch = (query: string) => {
  searchQuery.value = query
  // Scroll vers la section des catégories si on recherche
  if (query && allCategoriesRef.value) {
    allCategoriesRef.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

// Scroll vers toutes les catégories
const scrollToAllCategories = () => {
  if (allCategoriesRef.value) {
    allCategoriesRef.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// SEO
useSeoMeta({
  title: 'Catégories - Booly',
  description: 'Explorez toutes les catégories d\'établissements sur Booly. Restaurants, services, commerces et bien plus encore avec des avis vérifiés.'
})
</script>
