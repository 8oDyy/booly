<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Mes photos</h2>
          <p class="text-sm text-gray-500 mt-1">{{ photos.length }} photos partagées</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Vue en grille/liste -->
          <div class="flex border border-gray-300 rounded-lg">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-1 text-sm rounded-l-lg transition-colors',
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-1 text-sm rounded-r-lg transition-colors',
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
          
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
      <div v-else-if="!filteredPhotos.length" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery ? 'Aucune photo trouvée' : 'Aucune photo pour le moment' }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery ? 'Essayez de modifier votre recherche' : 'Vous n\'avez pas encore partagé de photos.' }}
        </p>
        <button
          v-if="!searchQuery"
          @click="$emit('discover-places')"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Découvrir des établissements
        </button>
      </div>

      <!-- Vue en grille -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="photo in filteredPhotos"
          :key="photo.id"
          class="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
          @click="$emit('view-photo', photo)"
        >
          <img
            :src="photo.url"
            :alt="photo.description || 'Photo'"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="handleImageError"
          />
          
          <!-- Overlay avec informations -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p class="text-white text-sm font-medium truncate">
                {{ photo.business?.name }}
              </p>
              <p class="text-white/80 text-xs">
                {{ formatDate(photo.created_at) }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="flex gap-1">
              <button
                @click.stop="$emit('delete-photo', photo)"
                class="w-8 h-8 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue en liste -->
      <div v-else class="space-y-4">
        <div
          v-for="photo in filteredPhotos"
          :key="photo.id"
          class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
        >
          <!-- Miniature -->
          <div
            class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
            @click="$emit('view-photo', photo)"
          >
            <img
              :src="photo.url"
              :alt="photo.description || 'Photo'"
              class="w-full h-full object-cover hover:scale-105 transition-transform"
              @error="handleImageError"
            />
          </div>

          <!-- Informations -->
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ photo.business?.name }}</h3>
            <p v-if="photo.description" class="text-sm text-gray-600 mt-1">{{ photo.description }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{{ formatDate(photo.created_at) }}</span>
              <span v-if="photo.review">Associée à un avis</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="$emit('view-business', photo.business)"
              class="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Voir l'établissement"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            
            <button
              @click="$emit('delete-photo', photo)"
              class="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Supprimer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Photo } from '~/composables/useProfile'

interface Props {
  photos: Photo[]
  loading?: boolean
}

interface Emits {
  (e: 'view-photo', photo: Photo): void
  (e: 'delete-photo', photo: Photo): void
  (e: 'view-business', business: any): void
  (e: 'discover-places'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<Emits>()

// État local
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Photos filtrées
const filteredPhotos = computed(() => {
  if (!searchQuery.value) return props.photos

  const query = searchQuery.value.toLowerCase()
  return props.photos.filter(photo =>
    (photo.description?.toLowerCase() || '').includes(query) ||
    photo.business?.name.toLowerCase().includes(query)
  )
})

// Formater les dates
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

// Gestion des erreurs d'image
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://picsum.photos/id/42/300'
}
</script>
