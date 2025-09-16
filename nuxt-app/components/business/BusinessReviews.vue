<template>
  <div class="space-y-6">
    <!-- Header avec filtres -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Avis clients</h3>
        <div class="flex flex-wrap items-center gap-3">
          <USelect
            v-model="reviewFilter"
            :options="filterOptions"
            placeholder="Filtrer par note"
            size="sm"
            class="min-w-[140px]"
          />
          <USelect
            v-model="reviewSort"
            :options="sortOptions"
            placeholder="Trier par"
            size="sm"
            class="min-w-[140px]"
          />
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-if="!paginatedReviews.length" class="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
      <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon name="i-heroicons-chat-bubble-left-ellipsis" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun avis pour le moment</h3>
      <p class="text-gray-500">Soyez le premier à laisser un avis sur cet établissement.</p>
    </div>

    <!-- Liste des avis -->
    <div v-else class="space-y-4">
      <div 
        v-for="(review, idx) in paginatedReviews" 
        :key="reviewKey(review, idx)" 
        class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex gap-4">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {{ initials(review.profiles?.full_name) }}
            </div>
          </div>
          
          <!-- Contenu de l'avis -->
          <div class="flex-1 min-w-0">
            <!-- Header de l'avis -->
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-semibold text-gray-900 text-base">
                  {{ review.profiles?.full_name || 'Utilisateur anonyme' }}
                </h4>
                <div class="flex items-center gap-2 mt-1">
                  <!-- Étoiles -->
                  <div class="flex items-center">
                    <Icon 
                      v-for="i in 5" 
                      :key="i"
                      :name="i <= Math.round(Number(review.rating) || 0) ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                      :class="i <= Math.round(Number(review.rating) || 0) ? 'text-yellow-400' : 'text-gray-300'"
                      class="w-4 h-4"
                    />
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ Number(review.rating).toFixed(1) }}</span>
                </div>
              </div>
              <time class="text-sm text-gray-500 flex-shrink-0">
                {{ formatDate(review.created_at) }}
              </time>
            </div>
            
            <!-- Contenu textuel -->
            <div v-if="review.content" class="mb-4">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ review.content }}
              </p>
            </div>
            
            <!-- Photos de l'avis -->
            <div v-if="review.id && reviewPhotos[review.id]?.length" class="mb-4">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <div 
                  v-for="(photo, photoIdx) in reviewPhotos[review.id].slice(0, 4)" 
                  :key="photo.id"
                  class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                  @click="openPhotoModal(reviewPhotos[review.id], photoIdx)"
                >
                  <NuxtImg
                    :src="photo.url"
                    :alt="photo.description || `Photo ${photoIdx + 1}`"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <!-- Overlay pour plus de photos -->
                  <div 
                    v-if="photoIdx === 3 && reviewPhotos[review.id].length > 4"
                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  >
                    <span class="text-white font-semibold text-sm">
                      +{{ reviewPhotos[review.id].length - 4 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-6 text-sm">
              <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Icon name="i-heroicons-hand-thumb-up" class="w-4 h-4" />
                <span>Utile</span>
              </button>
              <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Icon name="i-heroicons-share" class="w-4 h-4" />
                <span>Partager</span>
              </button>
              <button class="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                <Icon name="i-heroicons-flag" class="w-4 h-4" />
                <span>Signaler</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bouton charger plus -->
    <div v-if="paginatedReviews.length < filteredSorted.length" class="text-center">
      <UButton 
        @click="loadMore" 
        variant="outline" 
        size="lg"
        class="px-8"
      >
        Charger plus d'avis ({{ filteredSorted.length - paginatedReviews.length }} restants)
      </UButton>
    </div>
  </div>
  
  <!-- Modal pour les photos -->
  <UModal v-model="photoModalOpen" class="max-w-4xl">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Photos de l'avis</h3>
        <UButton 
          @click="photoModalOpen = false" 
          variant="ghost" 
          icon="i-heroicons-x-mark"
          size="sm"
        />
      </div>
      <div v-if="selectedPhotos.length" class="space-y-4">
        <div class="relative">
          <NuxtImg
            :src="selectedPhotos[currentPhotoIndex].url"
            :alt="selectedPhotos[currentPhotoIndex].description || 'Photo'"
            class="w-full max-h-96 object-contain rounded-lg"
          />
        </div>
        <div v-if="selectedPhotos.length > 1" class="flex items-center justify-between">
          <UButton 
            @click="previousPhoto" 
            variant="outline" 
            icon="i-heroicons-chevron-left"
            :disabled="currentPhotoIndex === 0"
          >
            Précédent
          </UButton>
          <span class="text-sm text-gray-500">
            {{ currentPhotoIndex + 1 }} / {{ selectedPhotos.length }}
          </span>
          <UButton 
            @click="nextPhoto" 
            variant="outline" 
            icon="i-heroicons-chevron-right"
            :disabled="currentPhotoIndex === selectedPhotos.length - 1"
          >
            Suivant
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
  
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { Database } from '~/types/supabase'

type Photo = Database['public']['Tables']['photos']['Row']

interface Profile { 
  full_name: string | null 
  avatar_url?: string | null
}

interface ReviewItem {
  id?: string
  rating: number
  content?: string | null
  created_at?: string | null
  profiles?: Profile
}

const props = defineProps<{ 
  reviews: ReviewItem[] | null | undefined
  businessId?: string
}>()

const { getPhotos } = usePhotos()

// États réactifs
const reviewFilter = ref<'all' | '1' | '2' | '3' | '4' | '5'>('all')
const reviewSort = ref<'recent' | 'oldest' | 'highest' | 'lowest'>('recent')
const reviewPhotos = ref<Record<string, Photo[]>>({})
const photoModalOpen = ref(false)
const selectedPhotos = ref<Photo[]>([])
const currentPhotoIndex = ref(0)

// Options pour les selects
const filterOptions = [
  { label: 'Tous les avis', value: 'all' },
  { label: '5 étoiles', value: '5' },
  { label: '4 étoiles', value: '4' },
  { label: '3 étoiles', value: '3' },
  { label: '2 étoiles', value: '2' },
  { label: '1 étoile', value: '1' }
]

const sortOptions = [
  { label: 'Plus récents', value: 'recent' },
  { label: 'Plus anciens', value: 'oldest' },
  { label: 'Meilleures notes', value: 'highest' },
  { label: 'Notes les plus basses', value: 'lowest' }
]

const filteredSorted = computed(() => {
  let list = [...(props.reviews ?? [])]
  // Filter by rounded rating when a specific star value is chosen
  if (reviewFilter.value !== 'all') {
    const target = Number(reviewFilter.value)
    list = list.filter(r => Math.round(Number(r.rating) || 0) === target)
  }
  // Sort according to selection
  switch (reviewSort.value) {
    case 'oldest':
      list.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
      break
    case 'highest':
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      break
    case 'lowest':
      list.sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0))
      break
    default:
      list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }
  return list
})

const visibleCount = ref(5)
const paginatedReviews = computed(() => filteredSorted.value.slice(0, visibleCount.value))
const loadMore = () => { visibleCount.value += 5 }

const reviewKey = (r: ReviewItem, idx: number): string => {
  if (r.id) return r.id
  if (r.created_at) return `created-${r.created_at}`
  return `idx-${idx}`
}

const initials = (name?: string | null) => {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
  return letters || 'U'
}

const formatDate = (iso?: string | null) => {
  if (!iso) return ''
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

// Fonctions pour les photos
const loadReviewPhotos = async () => {
  if (!props.reviews?.length) return
  
  const photosMap: Record<string, Photo[]> = {}
  
  for (const review of props.reviews) {
    if (review.id) {
      try {
        const photos = await getPhotos({
          reviewId: review.id,
          photoType: 'review_photo'
        })
        if (photos.length > 0) {
          photosMap[review.id] = photos
        }
      } catch (error) {
        console.error('Erreur chargement photos avis:', error)
      }
    }
  }
  
  reviewPhotos.value = photosMap
}

const openPhotoModal = (photos: Photo[], startIndex: number = 0) => {
  selectedPhotos.value = photos
  currentPhotoIndex.value = startIndex
  photoModalOpen.value = true
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < selectedPhotos.value.length - 1) {
    currentPhotoIndex.value++
  }
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

// Charger les photos au montage et quand les avis changent
onMounted(() => {
  loadReviewPhotos()
})

watch(() => props.reviews, () => {
  loadReviewPhotos()
}, { deep: true })
</script>
