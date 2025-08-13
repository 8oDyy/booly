<template>
  <NuxtLink
    :to="`/search?category=${category.id}`"
    class="group block"
  >
    <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200">
      <div class="flex items-center gap-6">
        <!-- Icône -->
        <div class="flex-shrink-0">
          <div class="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
            <UIcon 
              :name="category.icon || 'i-heroicons-building-storefront'" 
              class="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors"
            />
          </div>
        </div>
        
        <!-- Contenu principal -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {{ category.name }}
              </h3>
              
              <p v-if="category.description" class="text-gray-600 text-sm leading-relaxed mb-3">
                {{ category.description }}
              </p>
              
              <!-- Statistiques -->
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-building-storefront" class="w-3 h-3" />
                  <span>{{ businessCount }} établissements</span>
                </div>
                
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                  <span>Créée {{ formatDate(category.created_at) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Action -->
            <div class="flex-shrink-0 ml-4">
              <div class="flex items-center gap-2 text-blue-600 text-sm font-medium">
                <span>Explorer</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
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

// Nombre d'établissements (simulé pour l'instant)
const businessCount = computed(() => {
  // TODO: Récupérer le vrai nombre d'établissements depuis la base
  return Math.floor(Math.random() * 50) + 1
})

// Fonction pour formater la date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'hier'
  } else if (diffDays < 30) {
    return `il y a ${diffDays} jours`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `il y a ${months} mois`
  } else {
    const years = Math.floor(diffDays / 365)
    return `il y a ${years} an${years > 1 ? 's' : ''}`
  }
}
</script>
