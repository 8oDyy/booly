<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Activité récente</h2>
          <p class="text-sm text-gray-500 mt-1">Vos dernières visites et avis en attente</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Filtre par type -->
          <select
            v-model="selectedFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toute l'activité</option>
            <option value="pending">En attente d'avis</option>
            <option value="recent">Avis récents</option>
          </select>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- État de chargement -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- État vide -->
      <div v-else-if="!filteredActivity.length" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune activité récente</h3>
        <p class="text-gray-500 mb-6">Continuez à découvrir de nouveaux établissements.</p>
        <button
          @click="$emit('discover-places')"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Découvrir des établissements
        </button>
      </div>

      <!-- Timeline d'activité -->
      <div v-else class="space-y-6">
        <div
          v-for="item in filteredActivity"
          :key="item.id"
          class="relative flex gap-4"
        >
          <!-- Timeline indicator -->
          <div class="flex flex-col items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              item.type === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
            ]">
              <svg v-if="item.type === 'pending'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div v-if="item !== filteredActivity[filteredActivity.length - 1]" class="w-px h-8 bg-gray-200 mt-2"></div>
          </div>

          <!-- Contenu -->
          <div class="flex-1 pb-8">
            <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
              <div class="flex items-start gap-4">
                <!-- Image du business -->
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    :src="item.business?.image || 'https://picsum.photos/id/169/300'"
                    :alt="item.business?.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>

                <div class="flex-1">
                  <!-- En-tête -->
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ item.business?.name }}</h3>
                      <p class="text-sm text-gray-500">{{ formatDate(item.created_at) }}</p>
                    </div>
                    
                    <!-- Badge de statut -->
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      item.type === 'pending' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-green-100 text-green-700'
                    ]">
                      {{ item.type === 'pending' ? 'En attente' : 'Avis publié' }}
                    </span>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-gray-600 mb-3">
                    <span v-if="item.type === 'pending'">
                      Vous avez visité cet établissement. Partagez votre expérience !
                    </span>
                    <span v-else>
                      Vous avez publié un avis {{ item.rating }}/5 étoiles
                    </span>
                  </p>

                  <!-- Contenu de l'avis si disponible -->
                  <p v-if="item.content && item.type === 'review'" class="text-sm text-gray-700 mb-3 italic">
                    "{{ item.content.substring(0, 100) }}{{ item.content.length > 100 ? '...' : '' }}"
                  </p>

                  <!-- Actions -->
                  <div class="flex items-center gap-3">
                    <button
                      v-if="item.type === 'pending'"
                      @click="handleWriteReview(item)"
                      class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Laisser un avis
                    </button>

                    <button
                      v-else
                      @click="handleViewReview(item)"
                      class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir l'avis
                    </button>

                    <button
                      @click="$emit('view-business', item.business)"
                      class="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Voir l'établissement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Review, Check } from '~/composables/useProfile'

// Types pour l'activité combinée
interface ActivityItem {
  id: string
  type: 'pending' | 'review'
  created_at: string | null
  business?: any
  content?: string | null
  rating?: number
}

interface Props {
  reviews: Review[]
  pendingChecks: Check[]
  loading?: boolean
}

interface Emits {
  (e: 'write-review', check: Check): void
  (e: 'view-review', review: Review): void
  (e: 'view-business', business: any): void
  (e: 'discover-places'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// État local
const selectedFilter = ref('all')

// Activité combinée et triée
const allActivity = computed(() => {
  const activity: ActivityItem[] = []

  // Ajouter les checks en attente
  props.pendingChecks.forEach(check => {
    activity.push({
      id: check.id,
      type: 'pending',
      created_at: check.created_at,
      business: check.business
    })
  })

  // Ajouter les avis récents (derniers 30 jours)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  props.reviews
    .filter(review => {
      if (!review.created_at) return false
      return new Date(review.created_at) > thirtyDaysAgo
    })
    .forEach(review => {
      activity.push({
        id: review.id,
        type: 'review',
        created_at: review.created_at,
        business: review.business,
        content: review.content,
        rating: review.rating
      })
    })

  // Trier par date décroissante
  return activity.sort((a, b) => {
    const dateA = new Date(a.created_at || 0)
    const dateB = new Date(b.created_at || 0)
    return dateB.getTime() - dateA.getTime()
  })
})

// Activité filtrée
const filteredActivity = computed(() => {
  if (selectedFilter.value === 'all') return allActivity.value
  if (selectedFilter.value === 'pending') return allActivity.value.filter(item => item.type === 'pending')
  if (selectedFilter.value === 'recent') return allActivity.value.filter(item => item.type === 'review')
  return allActivity.value
})

// Formater les dates
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`
  
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

// Gestionnaires d'événements
const handleWriteReview = (item: ActivityItem) => {
  if (item.type === 'pending') {
    // Créer un objet Check à partir de l'ActivityItem
    const check = props.pendingChecks.find(c => c.id === item.id)
    if (check) {
      emit('write-review', check)
    }
  }
}

const handleViewReview = (item: ActivityItem) => {
  if (item.type === 'review') {
    // Créer un objet Review à partir de l'ActivityItem
    const review = props.reviews.find(r => r.id === item.id)
    if (review) {
      emit('view-review', review)
    }
  }
}

// Gestion des erreurs d'image
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://picsum.photos/id/169/300'
}
</script>
