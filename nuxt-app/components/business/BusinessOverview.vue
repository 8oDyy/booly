<template>
  <div class="space-y-6">
    <!-- Description -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900">À propos</h2>
      </div>
      
      <div class="prose prose-gray max-w-none">
        <p class="text-gray-700 leading-relaxed text-base">{{ business.description }}</p>
      </div>
      
      <div v-if="business.amenities?.length" class="mt-8">
        <div class="flex items-center gap-2 mb-4">
          <Icon name="i-heroicons-check-badge" class="w-5 h-5 text-green-600" />
          <h3 class="text-lg font-semibold text-gray-900">Équipements et services</h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="amenity in business.amenities"
            :key="amenity"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="i-heroicons-check" class="w-4 h-4 text-green-600" />
            </div>
            <span class="text-sm font-medium text-gray-700">{{ amenity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Avis récents -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icon name="i-heroicons-star" class="w-5 h-5 text-yellow-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Avis récents</h2>
        </div>
        <UButton
          variant="ghost"
          size="sm"
          class="text-blue-600 hover:text-blue-700"
        >
          Voir tous les avis
          <Icon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
        </UButton>
      </div>
      
      <!-- État vide -->
      <div v-if="!recentReviews.length" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="i-heroicons-chat-bubble-left-ellipsis" class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun avis pour le moment</h3>
        <p class="text-gray-500">Les premiers avis apparaîtront ici.</p>
      </div>
      
      <!-- Liste des avis -->
      <div v-else class="space-y-6">
        <div 
          v-for="review in recentReviews" 
          :key="review.id"
          class="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start gap-4">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div 
                v-if="review.profiles?.avatar_url"
                class="w-12 h-12 rounded-full overflow-hidden"
              >
                <NuxtImg
                  :src="review.profiles.avatar_url"
                  :alt="review.profiles?.full_name || 'Utilisateur'"
                  class="w-full h-full object-cover"
                />
              </div>
              <div 
                v-else
                class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
              >
                {{ initials(review.profiles?.full_name) }}
              </div>
            </div>
            
            <!-- Contenu -->
            <div class="flex-1 min-w-0">
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
                <p class="text-gray-700 leading-relaxed line-clamp-3">
                  {{ review.content }}
                </p>
              </div>
              
              <!-- Photos miniatures -->
              <div v-if="reviewPhotos[review.id]?.length" class="flex gap-2">
                <div 
                  v-for="(photo, photoIdx) in reviewPhotos[review.id].slice(0, 3)" 
                  :key="photo.id"
                  class="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
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
                    v-if="photoIdx === 2 && reviewPhotos[review.id].length > 3"
                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  >
                    <span class="text-white font-semibold text-xs">
                      +{{ reviewPhotos[review.id].length - 3 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

const props = defineProps<{ business: any }>()

interface Profile {
  full_name: string | null;
  avatar_url?: string | null
}

interface ReviewItem {
  id?: string
  rating: number
  content?: string | null
  created_at?: string | null
  profiles?: Profile
  photos?: any[]
}

const { getPhotos } = usePhotos()

// États pour les photos
const reviewPhotos = ref<Record<string, Photo[]>>({})
const photoModalOpen = ref(false)
const selectedPhotos = ref<Photo[]>([])
const currentPhotoIndex = ref(0)

const dayLabels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const formatDate = (dateString?: string | null) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
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

const initials = (name?: string | null) => {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
  return letters || 'U'
}

const recentReviews = computed(() => {
  const list = [...(props.business?.reviews ?? [])]
  return list
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 3)
})

const weekHours = computed(() => {
  const map: Record<number, string[]> = {}
  const hrs = props.business?.opening_hours ?? []
  for (const h of hrs) {
    map[h.day_of_week] = h.opening_times || []
  }
  return dayLabels.map((label, i) => ({ label, times: map[i] || [] }))
})

// Fonctions pour les photos
const loadReviewPhotos = async () => {
  if (!recentReviews.value?.length) return
  
  const photosMap: Record<string, Photo[]> = {}
  
  for (const review of recentReviews.value) {
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

watch(() => recentReviews.value, () => {
  loadReviewPhotos()
}, { deep: true })
</script>
