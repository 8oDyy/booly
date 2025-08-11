<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Mes avis</h2>
          <p class="text-sm text-gray-500 mt-1">{{ reviews.length }} avis publiés</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Filtre par note -->
          <select
            v-model="selectedRating"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
          
          <!-- Recherche -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher..."
              class="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
            />
            <svg class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- État de chargement -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- État vide -->
      <div v-else-if="!filteredReviews.length" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery || selectedRating ? 'Aucun avis trouvé' : 'Aucun avis pour le moment' }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery || selectedRating ? 'Essayez de modifier vos critères de recherche' : 'Vous n\'avez pas encore laissé d\'avis sur des établissements.' }}
        </p>
        <button
          v-if="!searchQuery && !selectedRating"
          @click="$emit('discover-places')"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Découvrir des établissements
        </button>
      </div>

      <!-- Liste des avis -->
      <div v-else class="space-y-6">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
        >
          <div class="flex items-start gap-4">
            <!-- Image du business -->
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                :src="review.business?.image || 'https://picsum.photos/id/42/300'"
                :alt="review.business?.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>

            <div class="flex-1">
              <!-- En-tête de l'avis -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-blue-700 hover:text-blue-800 cursor-pointer">
                    {{ review.business?.name }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</p>
                </div>
                
                <!-- Note -->
                <div class="flex items-center gap-1">
                  <div class="flex">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'w-4 h-4',
                        i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-600 ml-1">{{ review.rating }}/5</span>
                </div>
              </div>

              <!-- Contenu de l'avis -->
              <p class="text-gray-700 mb-4 leading-relaxed">{{ review.content }}</p>

              <!-- Photos de l'avis -->
              <div v-if="review.photos && review.photos.length" class="flex gap-2 overflow-x-auto pb-2 mb-4">
                <div
                  v-for="(photo, index) in review.photos"
                  :key="index"
                  class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  @click="$emit('view-photo', photo)"
                >
                  <img
                    :src="photo.url"
                    :alt="`Photo ${index + 1} de l'avis`"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-4 text-sm">
                <button
                  @click="$emit('edit-review', review)"
                  class="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
                
                <button
                  @click="$emit('delete-review', review)"
                  class="text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>

                <button
                  @click="$emit('view-business', review.business)"
                  class="text-gray-600 hover:text-gray-700 flex items-center gap-1 ml-auto"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Review } from '~/composables/useProfile'

interface Props {
  reviews: Review[]
  loading?: boolean
}

interface Emits {
  (e: 'edit-review', review: Review): void
  (e: 'delete-review', review: Review): void
  (e: 'view-photo', photo: any): void
  (e: 'view-business', business: any): void
  (e: 'discover-places'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<Emits>()

// État local pour les filtres
const searchQuery = ref('')
const selectedRating = ref('')

// Avis filtrés
const filteredReviews = computed(() => {
  let filtered = props.reviews

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(review =>
      (review.content?.toLowerCase() || '').includes(query) ||
      review.business?.name.toLowerCase().includes(query)
    )
  }

  // Filtre par note
  if (selectedRating.value) {
    const rating = parseInt(selectedRating.value)
    filtered = filtered.filter(review => review.rating === rating)
  }

  return filtered
})

// Formater les dates
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

// Gestion des erreurs d'image
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://picsum.photos/id/42/300'
}
</script>
