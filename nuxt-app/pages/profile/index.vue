<template>
  <UPage>
    <UPageHeader
      title="Mon Profil"
      class="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white"
      :ui="{
        container: 'relative py-4 flex flex-col items-center justify-center text-center',
        title: 'text-white text-2xl font-bold mb-0',
        wrapper: 'w-full max-w-6xl'
      }"
    >
      <template #headline>
        <UBadge color="primary" variant="solid" class="mb-4 bg-blue-50 text-blue-700 font-medium">Espace personnel</UBadge>
      </template>
    </UPageHeader>
    
    <UPageBody>
      <!-- Profil utilisateur -->
      <UContainer class="py-8">
        <UCard class="mb-8">
          <template #header>
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6 p-4">
              <UAvatar 
                :src="user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/300'" 
                alt="Photo de profil" 
                size="2xl"
                class="ring-4 ring-blue-500/20"
              />
              <div class="flex-1 text-center md:text-left">
                <h2 class="text-2xl font-bold text-blue-700">{{ user?.user_metadata?.name || 'Utilisateur' }}</h2>
                <p class="text-gray-500">{{ user?.email || 'email@exemple.com' }}</p>
                <div class="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <UBadge color="primary" class="text-sm">{{ reviewsCount }} avis</UBadge>
                  <UBadge color="warning" class="text-sm">{{ placesVisited }} lieux visités</UBadge>
                  <UBadge color="success" class="text-sm">{{ photosCount }} photos</UBadge>
                </div>
              </div>
              <div class="flex-shrink-0">
                <UButton 
                  to="/settings" 
                  color="neutral" 
                  variant="ghost" 
                  icon="i-heroicons-cog-6-tooth"
                  label="Paramètres"
                />
              </div>
            </div>
          </template>
        </UCard>

        <!-- Navigation par onglets -->
        <UTabs v-model="selectedTab" :items="tabs" class="mb-8">
          
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
                    <UAvatar :src="review.place.image" size="lg" class="flex-shrink-0" />
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <h3 class="font-bold text-blue-700">{{ review.place.name }}</h3>
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
                <UButton to="/" color="primary" label="Découvrir des établissements" />
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
                    <p class="text-sm font-medium text-blue-700 truncate">{{ photo.place.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(photo.created_at) }}</p>
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
              
              <div v-else-if="!pendingPlaces.length" class="text-center py-12">
                <UIcon name="i-heroicons-check-circle" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Vous avez laissé un avis sur tous les lieux visités</h3>
                <p class="text-gray-500 mb-6">Continuez à découvrir de nouveaux établissements.</p>
                <UButton to="/" color="primary" label="Découvrir des établissements" />
              </div>
              
              <div v-else class="space-y-4">
                <UCard v-for="place in pendingPlaces" :key="place.id" class="border border-gray-200 hover:border-blue-300 transition-colors">

                  <div class="flex items-center gap-4">
                    <UAvatar :src="place.image" size="lg" class="flex-shrink-0" />
                    <div class="flex-1">
                      <h3 class="font-bold text-blue-700">{{ place.name }}</h3>
                      <p class="text-sm text-gray-500">Visité le {{ formatDate(place.visited_at) }}</p>
                    </div>
                    <UButton 
                      color="primary" 
                      variant="soft" 
                      icon="i-heroicons-star" 
                      label="Laisser un avis"
                      :to="`/place/${place.id}/review`"
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
import { ref, computed, onMounted } from 'vue'
import type { User } from '@supabase/supabase-js'

definePageMeta({
  title: 'Mon Profil - Booly',
  description: 'Gérez votre profil et consultez votre historique'
})

// Interfaces pour les types de données
interface Place {
  id: number
  name: string
  image: string
}

interface Photo {
  id: number
  url: string
  created_at: string
  description?: string
  place: { name: string }
}

interface Review {
  id: number
  content: string
  rating: number
  created_at: string
  place: Place
  photos: Photo[]
}

interface PendingPlace {
  id: number
  name: string
  image: string
  visited_at: string
}

// État utilisateur
const user = ref<User | null>(null)
const isLoading = ref(true)

// Données
const reviews = ref<Review[]>([])
const photos = ref<Photo[]>([])
const pendingPlaces = ref<PendingPlace[]>([])

// Compteurs
const reviewsCount = computed(() => reviews.value.length)
const photosCount = computed(() => photos.value.length)
const placesVisited = computed(() => {
  // Nombre total de lieux visités (avec ou sans avis)
  return reviews.value.length + pendingPlaces.value.length
})

// Configuration des onglets
const selectedTab = ref('reviews')

const tabs = computed(() => [
  {
    slot: 'reviews',
    label: 'Mes avis',
    icon: 'i-heroicons-chat-bubble-left-right',
    badge: reviewsCount.value ? { label: reviewsCount.value.toString() } : undefined
  },
  {
    slot: 'photos',
    label: 'Mes photos',
    icon: 'i-heroicons-photo',
    badge: photosCount.value ? { label: photosCount.value.toString() } : undefined
  },
  {
    slot: 'pending',
    label: 'En attente d\'avis',
    icon: 'i-heroicons-clock',
    badge: pendingPlaces.value.length ? { label: pendingPlaces.value.length.toString() } : undefined
  }
])

// Formater les dates
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date)
}

// Récupération des données
onMounted(async () => {
  try {
    const supabase = useSupabaseClient()
    
    // Récupérer les informations utilisateur
    const { data: { user: userData } } = await supabase.auth.getUser()
    user.value = userData
    
    // Charger les données immédiatement (sans setTimeout)
    // Exemple de données pour les avis
    reviews.value = [
      {
        id: 1,
        content: "Excellent service et ambiance chaleureuse. Je recommande vivement ce restaurant pour ses plats savoureux et son personnel attentionné.",
        rating: 5,
        created_at: '2025-06-15T14:30:00',
        place: {
          id: 101,
          name: "Restaurant Le Gourmet",
          image: "https://picsum.photos/id/42/300"
        },
        photos: [
          { id: 1, url: "https://picsum.photos/id/292/300", created_at: "2025-06-15T14:35:00", place: { name: "Restaurant Le Gourmet" } },
          { id: 2, url: "https://picsum.photos/id/431/300", created_at: "2025-06-15T14:40:00", place: { name: "Restaurant Le Gourmet" } }
        ]
      },
      {
        id: 2,
        content: "Bon café mais service un peu lent aux heures de pointe. Les pâtisseries sont délicieuses.",
        rating: 4,
        created_at: '2025-06-01T09:15:00',
        place: {
          id: 102,
          name: "Café des Artistes",
          image: "https://picsum.photos/id/225/300"
        },
        photos: []
      }
    ]
    
    // Exemple de données pour les photos
    photos.value = [
      {
        id: 1,
        url: "https://picsum.photos/id/292/300",
        created_at: '2025-06-15T14:35:00',
        description: "Plat signature",
        place: { name: "Restaurant Le Gourmet" }
      },
      {
        id: 2,
        url: "https://picsum.photos/id/431/300",
        created_at: '2025-06-15T14:40:00',
        description: "Dessert du jour",
        place: { name: "Restaurant Le Gourmet" }
      },
      {
        id: 3,
        url: "https://picsum.photos/id/24/300",
        created_at: '2025-05-20T18:22:00',
        description: "Vue de la terrasse",
        place: { name: "Bar Le Panorama" }
      },
      {
        id: 4,
        url: "https://picsum.photos/id/96/300",
        created_at: '2025-05-10T12:15:00',
        description: "Cocktail maison",
        place: { name: "Bar Le Panorama" }
      }
    ]
    
    // Exemple de données pour les lieux visités sans avis
    pendingPlaces.value = [
      {
        id: 103,
        name: "Librairie Page & Plume",
        image: "https://picsum.photos/id/169/300",
        visited_at: '2025-07-01T16:45:00'
      },
      {
        id: 104,
        name: "Boutique Mode & Style",
        image: "https://picsum.photos/id/1011/300",
        visited_at: '2025-06-28T11:20:00'
      }
    ]
    
    // Mettre fin au chargement
    isLoading.value = false
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    isLoading.value = false
  }
})
</script>
