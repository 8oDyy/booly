<template>
  <div class="bg-gray-50 py-16">
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Catégories populaires
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez les catégories les plus recherchées par notre communauté
        </p>
      </div>
      
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-xl h-32"></div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="category in popularCategories"
          :key="category.id"
          :to="`/search?category=${category.id}`"
          class="group"
        >
          <div class="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all">
              <UIcon 
                :name="category.icon || 'i-heroicons-building-storefront'" 
                class="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors"
              />
            </div>
            <h3 class="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
              {{ category.name }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              {{ getBusinessCount(category.id) }} établissements
            </p>
          </div>
        </NuxtLink>
      </div>
      
      <div class="text-center mt-8">
        <UButton
          variant="outline"
          size="lg"
          @click="$emit('showAll')"
        >
          Voir toutes les catégories
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

type Category = Database['public']['Tables']['categories']['Row']

interface Props {
  categories: Category[]
  loading: boolean
}

interface Emits {
  (e: 'showAll'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Catégories populaires (les 6 premières)
const popularCategories = computed(() => {
  return props.categories.slice(0, 6)
})

// Fonction pour obtenir le nombre d'établissements (simulé)
const getBusinessCount = (categoryId: string): number => {
  // TODO: Récupérer le vrai nombre d'établissements depuis la base
  const counts: Record<string, number> = {
    [categoryId]: Math.floor(Math.random() * 100) + 10
  }
  return counts[categoryId] || Math.floor(Math.random() * 50) + 1
}
</script>
