<template>
  <NuxtLink
    :to="`/search?category=${category.id}`"
    class="group block h-full"
  >
    <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full flex flex-col">
      <!-- Icône -->
      <div class="flex-shrink-0 mb-4">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
          <UIcon 
            :name="category.icon || 'i-heroicons-building-storefront'" 
            class="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors"
          />
        </div>
      </div>
      
      <!-- Contenu -->
      <div class="flex-1 flex flex-col">
        <h3 class="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {{ category.name }}
        </h3>
        
        <p v-if="category.description" class="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
          {{ truncateDescription(category.description) }}
        </p>
        
        <!-- Statistiques -->
        <div class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-building-storefront" class="w-3 h-3" />
            <span>100 établissements</span>
          </div>
          
          <div class="flex items-center gap-1 text-blue-600">
            <span class="font-medium">Explorer</span>
            <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

type Category = Database['public']['Tables']['categories']['Row']


interface Props {
  category: Category
}

const props = defineProps<Props>()


// Fonction pour tronquer la description
const truncateDescription = (description: string, maxLength: number = 100): string => {
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength).trim() + '...'
}
</script>
