<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header avec informations utilisateur -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileHeader
          :user="user"
          :profile="profile"
          @edit-avatar="handleEditAvatar"
          @edit-profile="showSettings = true"
          @open-settings="showSettings = true"
          @share-profile="handleShareProfile"
        />
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistiques -->
      <div class="mb-8">
        <ProfileStats
          :reviews-count="reviewsCount"
          :photos-count="photosCount"
          :places-visited="placesVisited"
          :pending-count="pendingChecks.length"
        />
      </div>

      <!-- Navigation par onglets -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center gap-2">
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.label }}</span>
              <span
                v-if="tab.count > 0"
                class="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs"
              >
                {{ tab.count }}
              </span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="space-y-8">
        <!-- Onglet Avis -->
        <div v-if="activeTab === 'reviews'">
          <ProfileReviews
            :reviews="reviews"
            :loading="isLoading"
            @edit-review="handleEditReview"
            @delete-review="handleDeleteReview"
            @view-photo="handleViewPhoto"
            @view-business="handleViewBusiness"
            @discover-places="handleDiscoverPlaces"
          />
        </div>

        <!-- Onglet Photos -->
        <div v-if="activeTab === 'photos'">
          <ProfilePhotos
            :photos="photos"
            :loading="isLoading"
            @view-photo="handleViewPhoto"
            @delete-photo="handleDeletePhoto"
            @view-business="handleViewBusiness"
            @discover-places="handleDiscoverPlaces"
          />
        </div>

        <!-- Onglet Activité -->
        <div v-if="activeTab === 'activity'">
          <ProfileActivity
            :reviews="reviews"
            :pending-checks="pendingChecks"
            :loading="isLoading"
            @write-review="handleWriteReview"
            @view-review="handleViewReview"
            @view-business="handleViewBusiness"
            @discover-places="handleDiscoverPlaces"
          />
        </div>

        <!-- Onglet Paramètres -->
        <div v-if="activeTab === 'settings'">
          <ProfileSettings
            :profile="profile"
            @profile-updated="handleProfileUpdated"
          />
        </div>
      </div>
    </div>

    <!-- Modal des paramètres (version mobile) -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:hidden"
      @click="showSettings = false"
    >
      <div
        class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold">Paramètres</h2>
          <button
            @click="showSettings = false"
            class="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <ProfileSettings
            :profile="profile"
            @profile-updated="handleProfileUpdated"
          />
        </div>
      </div>
    </div>

    <!-- Modal de visualisation de photo -->
    <div
      v-if="photoModal.isOpen"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      @click="photoModal.isOpen = false"
    >
      <div class="max-w-4xl max-h-full">
        <img
          :src="photoModal.currentPhoto?.url"
          :alt="photoModal.currentPhoto?.description || 'Photo'"
          class="max-w-full max-h-full object-contain rounded-lg"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProfile } from '~/composables/useProfile'
import type { Photo, Review, Check } from '~/composables/useProfile'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import ProfileStats from '~/components/profile/ProfileStats.vue'
import ProfileSettings from '~/components/profile/ProfileSettings.vue'
import ProfileReviews from '~/components/profile/ProfileReviews.vue'
import ProfilePhotos from '~/components/profile/ProfilePhotos.vue'
import ProfileActivity from '~/components/profile/ProfileActivity.vue'

definePageMeta({
  middleware: 'auth',
  title: 'Mon Profil - Booly',
  description: 'Gérez votre profil et consultez votre historique'
})

const user = useSupabaseUser()
const { profile, reviews, photos, pendingChecks, isLoading, error, fetchProfile, fetchReviews, fetchPhotos, fetchPendingChecks } = useProfile()

// État local
const activeTab = ref('reviews')
const showSettings = ref(false)
const photoModal = ref({
  isOpen: false,
  currentPhoto: null as Photo | null
})

// Icônes pour les onglets (composants SVG simples)
const ReviewIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>`
}

const PhotoIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>`
}

const ActivityIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
}

const SettingsIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>`
}

// Configuration des onglets
const tabs = computed(() => [
  {
    id: 'reviews',
    label: 'Mes avis',
    icon: ReviewIcon,
    count: reviews.value.length
  },
  {
    id: 'photos',
    label: 'Mes photos',
    icon: PhotoIcon,
    count: photos.value.length
  },
  {
    id: 'activity',
    label: 'Activité',
    icon: ActivityIcon,
    count: pendingChecks.value.length
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: SettingsIcon,
    count: 0
  }
])

// Statistiques calculées
const reviewsCount = computed(() => reviews.value.length)
const photosCount = computed(() => photos.value.length)
const placesVisited = computed(() => {
  const businessIds = new Set()
  reviews.value.forEach(review => businessIds.add(review.business_id))
  pendingChecks.value.forEach(check => businessIds.add(check.business_id))
  return businessIds.size
})

// Gestionnaires d'événements
const handleEditAvatar = () => {
  // TODO: Implémenter l'édition d'avatar
  console.log('Éditer avatar')
}

const handleShareProfile = () => {
  // TODO: Implémenter le partage de profil
  console.log('Partager profil')
}

const handleProfileUpdated = async () => {
  await fetchProfile()
}

const handleEditReview = (review: Review) => {
  navigateTo(`/place/${review.business_id}/review?edit=${review.id}`)
}

const handleDeleteReview = async (review: Review) => {
  // TODO: Implémenter la suppression d'avis
  console.log('Supprimer avis:', review.id)
}

const handleViewPhoto = (photo: Photo) => {
  photoModal.value.currentPhoto = photo
  photoModal.value.isOpen = true
}

const handleDeletePhoto = async (photo: Photo) => {
  // TODO: Implémenter la suppression de photo
  console.log('Supprimer photo:', photo.id)
}

const handleViewBusiness = (business: any) => {
  if (business?.id) {
    navigateTo(`/place/${business.id}`)
  }
}

const handleWriteReview = (check: Check) => {
  navigateTo(`/place/${check.business_id}/review`)
}

const handleViewReview = (review: Review) => {
  navigateTo(`/place/${review.business_id}#review-${review.id}`)
}

const handleDiscoverPlaces = () => {
  navigateTo('/search')
}

// Charger les données au montage
onMounted(async () => {
  if (user.value) {
    await Promise.all([
      fetchProfile(),
      fetchReviews(),
      fetchPhotos(),
      fetchPendingChecks()
    ])
  }
})

// Surveiller les changements d'utilisateur
watch(user, async (newUser) => {
  if (newUser) {
    await Promise.all([
      fetchProfile(),
      fetchReviews(),
      fetchPhotos(),
      fetchPendingChecks()
    ])
  }
}, { immediate: true })
</script>
