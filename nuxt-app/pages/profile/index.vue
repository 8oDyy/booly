<template>
  <UPage>
    <UPageHeader
      title="Mon profil"
      :links="links"
      class="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500"
      :ui="{
        container: 'relative py-4 flex flex-col items-center justify-center text-center',
        title: 'text-white text-2xl font-bold mb-0',
        wrapper: 'w-full max-w-6xl',
      }"
    >
      <UAvatar 
        :src="user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/300'" 
        alt="Photo de profil" 
        size="2xl"
        class="ring-4 ring-white dark:ring-gray-900 shadow-lg transform hover:scale-105 transition-transform duration-300"
      />
      <h2 class="text-2xl font-bold text-blue-700 dark:text-blue-400">{{ user?.user_metadata?.name || 'Utilisateur' }}</h2>
    </UPageHeader>

    <UPageBody>
      <!-- Profil utilisateur -->
      <UContainer class="py-8">
        <!-- Navigation par onglets -->
        <UTabs :defaultValue="'reviews'" :items="tabs" class="mb-8">
          
          <!-- Contenu de l'onglet Avis -->
          <template #reviews>
            <div class="py-4">
              <div v-if="isLoading" class="flex justify-center py-12">
                <UProgress animation="carousel" />
              </div>
              
              <div v-else-if="!reviews.length" class="text-center py-12">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Aucun avis pour le moment</h3>
                <p class="text-gray-500 mb-6">Vous n'avez pas encore laissé d'avis sur des établissements.</p>
                <UButton to="/" color="primary" label="Découvrir des établissements" />
              </div>
              
              <div v-else class="space-y-6">
                <UCard v-for="review in reviews" :key="review.id" class="border border-gray-200 hover:border-blue-300 transition-colors">
                  <div class="flex items-start gap-4">
                    <UAvatar :src="review.business?.image || 'https://picsum.photos/id/42/300'" size="lg" class="flex-shrink-0" />
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <h3 class="font-bold text-blue-700">{{ review.business?.name }}</h3>
                          <p class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</p>
                        </div>
                        <URating v-model="review.rating" :length="5" disabled />
                      </div>
                      <p class="mt-2 text-gray-700">{{ review.content }}</p>
                      
                      <div v-if="review.photos && review.photos.length" class="mt-4 flex gap-2 overflow-x-auto pb-2">
                        <UImage
                          v-for="(photo, index) in review.photos" 
                          :key="index" 
                          :src="photo.url" 
                          class="h-20 w-20 object-cover rounded-lg"
                          :alt="`Photo ${index + 1} de l'avis`"
                        />
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </template>
          
          <!-- Contenu de l'onglet Photos -->
          <template #photos>
            <div class="py-4">
              <div v-if="isLoading" class="flex justify-center py-12">
                <UProgress animation="carousel" />
              </div>
              
              <div v-else-if="!photos.length" class="text-center py-12">
                <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Aucune photo pour le moment</h3>
                <p class="text-gray-500 mb-6">Vous n'avez pas encore partagé de photos.</p>
                <UButton to="/search" color="primary" label="Découvrir des établissements" />
              </div>
              
              <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <UCard v-for="photo in photos" :key="photo.id" class="group cursor-pointer hover:shadow-md transition-shadow">
                  <div class="relative aspect-square">
                    <UImage 
                      :src="photo.url" 
                      class="absolute inset-0 h-full w-full object-cover rounded-t-lg"
                      :alt="photo.description || 'Photo utilisateur'"
                    />
                  </div>
                  <div class="p-3">
                    <p class="text-sm font-medium text-blue-700 truncate">{{ photo.business?.name || 'Sans établissement' }}</p>
                    <p class="text-xs text-gray-500">date de la photo</p>
                  </div>
                </UCard>
              </div>
            </div>
          </template>
          
          <!-- Contenu de l'onglet Lieux visités sans avis -->
          <template #pending>
            <div class="py-4">
              <div v-if="isLoading" class="flex justify-center py-12">
                <UProgress animation="carousel" />
              </div>
              
              <div v-else-if="!pendingChecks.length" class="text-center py-12">
                <UIcon name="i-heroicons-check-circle" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Vous avez laissé un avis sur tous les lieux visités</h3>
                <p class="text-gray-500 mb-6">Continuez à découvrir de nouveaux établissements.</p>
                <UButton to="/search" color="primary" label="Découvrir des établissements" />
              </div>
              
              <div v-else class="space-y-4">
                <UCard v-for="check in pendingChecks" :key="check.id" class="hover:shadow-md transition-all duration-200 p-6">
                  <div class="flex items-center gap-4">
                    <UAvatar :src="check.business?.image || 'https://picsum.photos/id/169/300'" size="lg" class="flex-shrink-0" />
                    <div class="flex-1">
                      <h3 class="font-bold text-blue-700">{{ check.business?.name }}</h3>
                      <p class="text-sm text-gray-500">Visité le {{ formatDate(check.created_at || '') }}</p>
                    </div>
                    <UButton 
                      color="primary" 
                      variant="soft" 
                      icon="i-heroicons-star" 
                      label="Laisser un avis"
                      :to="`/place/${check.business_id}/review`"
                    />
                  </div>
                </UCard>
              </div>
            </div>
          </template>
        </UTabs>
      </UContainer>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import { useProfile, type Review, type Photo, type Check } from '~/composables/useProfile'
import { ref, computed, onMounted, nextTick } from 'vue'
import type { User } from '@supabase/supabase-js'

definePageMeta({
  title: 'Mon Profil - Booly',
  description: 'Gérez votre profil et consultez votre historique'
})

// Récupération du profil utilisateur et des données associées
const { 
  profile, 
  reviews, 
  photos, 
  pendingChecks,
  isLoading, 
  error, 
  loadProfileData,
  filterReviews,
  filterPhotos
} = useProfile()

// État local pour la recherche
const searchQuery = ref('')
const user = useSupabaseUser()

// Filtrer les avis en fonction de la recherche
const filteredReviews = computed(() => {
  return filterReviews(searchQuery.value)
})

// Filtrer les photos en fonction de la recherche
const filteredPhotos = computed(() => {
  return filterPhotos(searchQuery.value)
})

// Compteurs
const reviewsCount = computed(() => reviews.value.length)
const photosCount = computed(() => photos.value.length)
const placesVisited = computed(() => {
  // Nombre total de lieux visités (avec ou sans avis)
  return reviews.value.length + pendingChecks.value.length
})

// Configuration de la barre de navigation
const links = ref([
  {
    label: 'Paramètres',
    icon: 'i-heroicons-cog',
    to: '/settings',
  }
])


// Configuration des onglets - l'onglet par défaut est défini directement dans UTabs avec defaultValue

const tabs = computed(() => [
  {
    slot: 'reviews',
    label: 'Mes avis',
    icon: 'i-heroicons-chat-bubble-left-right',
    badge: reviewsCount.value ? { label: reviewsCount.value.toString(), color: 'primary' } : undefined,
    value: 'reviews'
  },
  {
    slot: 'photos',
    label: 'Mes photos',
    icon: 'i-heroicons-photo',
    badge: photosCount.value ? { label: photosCount.value.toString(), color: 'success' } : undefined,
    value: 'photos'
  },
  {
    slot: 'pending',
    label: 'En attente d\'avis',
    icon: 'i-heroicons-clock',
    badge: pendingChecks.value.length ? { label: pendingChecks.value.length.toString(), color: 'warning' } : undefined,
    value: 'pending'
  }
])

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

// Modal pour afficher les photos en grand
const photoModal = reactive({
  isOpen: false,
  currentPhoto: null as Photo | null
})

const openPhotoModal = (photo: Photo) => {
  photoModal.currentPhoto = photo
  photoModal.isOpen = true
}

// Récupération des données au chargement de la page
onMounted(async () => {
  await loadProfileData()
})
</script>
