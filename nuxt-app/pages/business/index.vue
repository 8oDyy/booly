<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section avec photos -->

    <!-- Informations principales -->

    <!-- Contenu principal -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Contenu des onglets -->
        <div class="lg:col-span-2 space-y-8">
          <UTabs :items="tabs" v-model="activeTab">

          <!-- Onglet Aperçu -->
            <template #overview>
              <section v-show="activeTab === 'overview'" class="space-y-8">
                <!-- Description -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 class="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
                  <p class="text-gray-700 leading-relaxed">{{ business.description }}</p>
                  
                  <div v-if="business.amenities.length" class="mt-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Équipements et services</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div
                        v-for="amenity in business.amenities"
                        :key="amenity"
                        class="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckIcon class="w-4 h-4 text-green-500" />
                        <span>{{ amenity }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Avis récents -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">Avis récents</h2>
                    <button
                      @click="activeTab = 'reviews'"
                      class="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Voir tous les avis
                    </button>
                  </div>
                  
                  <div class="space-y-6">
                    <div
                      v-for="review in business.recentReviews.slice(0, 3)"
                      :key="review.id"
                      class="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                    >
                      <div class="flex items-start gap-4">
                        <img
                          :src="review.user.avatar"
                          :alt="review.user.name"
                          class="w-12 h-12 rounded-full object-cover"
                        />
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-2">
                            <div>
                              <h4 class="font-medium text-gray-900">{{ review.user.name }}</h4>
                              <div class="flex items-center gap-2 mt-1">
                                <div class="flex items-center">
                                  <StarIcon
                                    v-for="i in 5"
                                    :key="i"
                                    class="w-4 h-4"
                                    :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                                  />
                                </div>
                                <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
                              </div>
                            </div>
                          </div>
                          <p class="text-gray-700 text-sm leading-relaxed">{{ review.content }}</p>
                          
                          <div v-if="review.photos.length" class="flex gap-2 mt-3">
                            <img
                              v-for="photo in review.photos.slice(0, 3)"
                              :key="photo.id"
                              :src="photo.url"
                              class="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                              @click="openPhotoGallery(business.photos.findIndex(p => p.id === photo.id))"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </template>

            <!-- Onglet Avis -->
            <template #reviews>
              <section class="space-y-6">
                <!-- Filtres et tri -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div class="flex items-center gap-4">
                      <select
                        v-model="reviewFilter"
                        class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Tous les avis</option>
                        <option value="5">5 étoiles</option>
                        <option value="4">4 étoiles</option>
                        <option value="3">3 étoiles</option>
                        <option value="2">2 étoiles</option>
                        <option value="1">1 étoile</option>
                      </select>
                      
                      <select
                        v-model="reviewSort"
                        class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="recent">Plus récents</option>
                        <option value="oldest">Plus anciens</option>
                        <option value="highest">Meilleures notes</option>
                        <option value="lowest">Notes les plus basses</option>
                      </select>
                    </div>
                    
                    <button
                      @click="showWriteReview = true"
                      class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <PenToolIcon class="w-4 h-4" />
                      Écrire un avis
                    </button>
                  </div>
                </div>

                <!-- Liste des avis -->
                <div class="space-y-6">
                  <div
                    v-for="review in filteredReviews"
                    :key="review.id"
                    class="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div class="flex items-start gap-4">
                      <img
                        :src="review.user.avatar"
                        :alt="review.user.name"
                        class="w-12 h-12 rounded-full object-cover"
                      />
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-3">
                          <div>
                            <h4 class="font-medium text-gray-900">{{ review.user.name }}</h4>
                            <div class="flex items-center gap-2 mt-1">
                              <div class="flex items-center">
                                <StarIcon
                                  v-for="i in 5"
                                  :key="i"
                                  class="w-4 h-4"
                                  :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                                />
                              </div>
                              <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
                            </div>
                          </div>
                          
                          <div class="flex items-center gap-2">
                            <button
                              @click="toggleReviewLike(review.id)"
                              class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <ThumbsUpIcon class="w-4 h-4" />
                              <span>{{ review.likes }}</span>
                            </button>
                          </div>
                        </div>
                        
                        <p class="text-gray-700 leading-relaxed mb-4">{{ review.content }}</p>
                        
                        <div v-if="review.photos.length" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <img
                            v-for="photo in review.photos"
                            :key="photo.id"
                            :src="photo.url"
                            class="w-full h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            @click="openPhotoGallery(business.photos.findIndex(p => p.id === photo.id))"
                          />
                        </div>
                        
                        <div class="flex items-center gap-4 text-sm text-gray-500">
                          <button class="hover:text-blue-600 transition-colors">Utile</button>
                          <button class="hover:text-blue-600 transition-colors">Partager</button>
                          <button class="hover:text-blue-600 transition-colors">Signaler</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="flex justify-center">
                  <button class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Charger plus d'avis
                  </button>
                </div>
              </section>
            </template>

            <template #photos>
              <section v-show="activeTab === 'photos'" class="space-y-6">
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">
                      {{ business.photos.length }} photos
                    </h2>
                    <button
                      @click="showAddPhoto = true"
                      class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <CameraIcon class="w-4 h-4" />
                      Ajouter une photo
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div
                      v-for="(photo, index) in business.photos"
                      :key="photo.id"
                      class="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      @click="openPhotoGallery(index)"
                    >
                      <img
                        :src="photo.url"
                        :alt="`Photo ${index + 1}`"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </template>
          </UTabs>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6 sticky top-24">
          <!-- Carte -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
            <div class="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <MapPinIcon class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ business.fullAddress }}</p>
            <button
              @click="getDirections"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <NavigationIcon class="w-4 h-4" />
              Obtenir l'itinéraire
            </button>
          </div>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Horaires d'ouverture</h2>
            </template>
            <div class="space-y-4">
              <div v-for="(hours, day) in business.hours" :key="day" class="flex justify-between items-center py-2">
                <span class="font-medium text-gray-900 capitalize">{{ day }}</span>
                <span class="text-gray-600">{{ hours }}</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div class="space-y-4">
                <div v-if="business.phone" class="flex items-center gap-3">
                  <PhoneIcon class="w-5 h-5 text-gray-400" />
                  <span class="text-gray-700">{{ business.phone }}</span>
                </div>
                <div v-if="business.email" class="flex items-center gap-3">
                  <MailIcon class="w-5 h-5 text-gray-400" />
                  <span class="text-gray-700">{{ business.email }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <MapPinIcon class="w-5 h-5 text-gray-400 mt-0.5" />
                  <span class="text-gray-700">{{ business.fullAddress }}</span>
                </div>
                <div v-if="business.website" class="flex items-center gap-3">
                  <GlobeIcon class="w-5 h-5 text-gray-400" />
                  <a
                    :href="business.website"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {{ business.website }}
                  </a>
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <!-- Lieux similaires -->
      <h2 class="text-lg font-semibold text-gray-900 mb-4 mt-8">Lieux similaires</h2>
      <UPageGrid :cols="{base: 1, md: 2, lg: 3}" class="gap-7">
        <UCard 
          v-for="business in popularBusinesses" 
          :key="business.id" 
          class="bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 overflow-hidden group"
        >
          <template #header>
            <div class="relative h-48 bg-gray-200 overflow-hidden">
              <img 
                :src="business.image" 
                :alt="business.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500'; this.onerror=null;"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <div class="flex justify-between items-end">
                  <div>
                    <h3 class="text-xl font-bold text-white drop-shadow-sm">{{ business.name }}</h3>
                  </div>
                  <UBadge color="white" variant="solid" class="text-blue-700 shadow-sm">
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-solid-star" class="mr-1 text-amber-500" />
                      {{ business.rating }}
                    </span>
                  </UBadge>
                </div>
              </div>
            </div>
          </template>
          
          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <UBadge color="blue" size="xs" class="bg-blue-100 text-blue-700 font-medium">Populaire</UBadge>
              <UBadge color="green" variant="outline" size="xs" class="border-green-300 text-green-600">Ouvert</UBadge>
            </div>
            
            <p class="text-gray-700 mb-3 line-clamp-2 font-inter">{{ business.description }}</p>
            
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center text-gray-600">
                <UIcon name="i-heroicons-solid-map-pin" class="w-4 h-4 text-blue-500 mr-1" />
                <span>{{ business.address.split(',')[0] }}</span>
              </div>
              
              <div class="flex items-center text-gray-600">
                <UIcon name="i-heroicons-solid-chat-bubble-left" class="w-4 h-4 text-blue-500 mr-1" />
                <span>{{ business.reviewCount }} avis</span>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center text-sm text-blue-600">
                <UIcon name="i-heroicons-solid-check-badge" class="w-5 h-5 text-blue-500 mr-1" />
                <span>Vérifié par NFC</span>
              </div>
              
              <UButton 
                size="xs" 
                color="blue" 
                variant="ghost" 
                to="/business/1" 
                trailing-icon="i-heroicons-solid-arrow-right"
              >
                Détails
              </UButton>
            </div>
          </div>
        </UCard>
      </UPageGrid>
    </main>

    <!-- Modal Galerie Photos -->
    <div
      v-if="photoGallery.isOpen"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      @click="closePhotoGallery"
      @keydown.escape="closePhotoGallery"
    >
      <div class="relative max-w-4xl max-h-full p-4" @click.stop>
        <button
          @click="closePhotoGallery"
          class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <XIcon class="w-8 h-8" />
        </button>
      
        <img
          :src="photoGallery.currentPhoto?.url"
          :alt="photoGallery.currentPhoto?.alt"
          class="max-w-full max-h-full object-contain"
        />
        
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <button
            @click="previousPhoto"
            :disabled="photoGallery.currentIndex === 0"
            class="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <ChevronLeftIcon class="w-6 h-6" />
          </button>
          
          <span class="text-white text-sm">
            {{ photoGallery.currentIndex + 1 }} / {{ business.photos.length }}
          </span>
          
          <button
            @click="nextPhoto"
            :disabled="photoGallery.currentIndex === business.photos.length - 1"
            class="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <ChevronRightIcon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  TagIcon,
  StarIcon,
  PhoneIcon,
  NavigationIcon,
  GlobeIcon,
  CheckIcon,
  PenToolIcon,
  ThumbsUpIcon,
  CameraIcon,
  MailIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon
} from 'lucide-vue-next'


// État réactif
const activeTab = ref('overview')
const isFavorite = ref(false)
const reviewFilter = ref('all')
const reviewSort = ref('recent')
const showWriteReview = ref(false)
const showAddPhoto = ref(false)

// Galerie photos
const photoGallery = ref({
  isOpen: false,
  currentIndex: 0,
  currentPhoto: null
})

// Nouveau avis
const newReview = ref({
  rating: 0,
  content: ''
})

// Données pour les commerces populaires
const popularBusinesses = [
  {
    id: 1,
    name: 'Le Bistrot Parisien',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500',
    rating: 4.8,
    reviewCount: 156,
    description: 'Cuisine française traditionnelle dans un cadre élégant et chaleureux. Produits frais et de saison.',
    address: '15 rue des Fleurs, Paris'
  },
  {
    id: 2,
    name: 'Hôtel du Parc',
    category: 'Hôtel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500',
    rating: 4.6,
    reviewCount: 87,
    description: 'Établissement 4 étoiles avec vue panoramique, spa et service personnalisé.',
    address: '8 avenue du Parc, Lyon'
  },
  {
    id: 3,
    name: 'Boutique Mode & Style',
    category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500',
    rating: 4.5,
    reviewCount: 62,
    description: 'Vêtements et accessoires de créateurs locaux et internationaux pour homme et femme.',
    address: '23 rue du Commerce, Marseille'
  }
];


// Configuration des onglets
const tabs = [
  {
    slot: 'overview',
    label: 'Aperçu',
    icon: 'i-heroicons-chat-bubble-left-right',
    value: 'overview'
  },
  {
    slot: 'reviews',
    label: 'Avis',
    icon: 'i-heroicons-chat-bubble-left-right',
    value: 'reviews'
  },
  {
    slot: 'photos',
    label: 'Photos',
    icon: 'i-heroicons-chat-bubble-left-right',
    value: 'photos'
  }
]

// Données mockées du business
const business = ref({
  id: 1,
  name: "Le Petit Bistrot",
  address: "15 Rue de la Paix, Paris",
  fullAddress: "15 Rue de la Paix, 75001 Paris, France",
  category: "Restaurant français",
  rating: 4.3,
  reviewCount: 127,
  priceRange: "€€",
  isOpen: true,
  phone: "+33 1 42 86 87 88",
  email: "contact@lepetitbistrot.fr",
  website: "https://lepetitbistrot.fr",
  description: "Authentique bistrot parisien proposant une cuisine française traditionnelle dans un cadre chaleureux et convivial. Notre chef privilégie les produits frais et de saison pour vous offrir une expérience culinaire mémorable.",
  tags: ["Cuisine française", "Terrasse", "Réservation", "Groupe", "Romantique"],
  amenities: [
    "WiFi gratuit",
    "Terrasse",
    "Accessible PMR",
    "Parking",
    "Climatisation",
    "Animaux acceptés"
  ],
  hours: {
    lundi: "12h00 - 14h30, 19h00 - 22h30",
    mardi: "12h00 - 14h30, 19h00 - 22h30",
    mercredi: "12h00 - 14h30, 19h00 - 22h30",
    jeudi: "12h00 - 14h30, 19h00 - 22h30",
    vendredi: "12h00 - 14h30, 19h00 - 23h00",
    samedi: "12h00 - 14h30, 19h00 - 23h00",
    dimanche: "Fermé"
  },
  photos: [
    { id: 1, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop", alt: "Intérieur du restaurant" },
    { id: 2, url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop", alt: "Plat signature" },
    { id: 3, url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop", alt: "Terrasse" },
    { id: 4, url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop", alt: "Bar" },
    { id: 5, url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop", alt: "Cuisine" },
    { id: 6, url: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?q=80&w=800&auto=format&fit=crop", alt: "Dessert" }
  ],
  recentReviews: [
    {
      id: 1,
      user: {
        name: "Marie Dubois",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      rating: 5,
      date: "2024-01-15",
      content: "Excellente expérience ! Le service était impeccable et les plats délicieux. Je recommande vivement le bœuf bourguignon.",
      likes: 12,
      photos: [
        { id: 101, url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=400&auto=format&fit=crop" }
      ]
    },
    {
      id: 2,
      user: {
        name: "Pierre Martin",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      rating: 4,
      date: "2024-01-10",
      content: "Très bon restaurant avec une ambiance chaleureuse. Les prix sont corrects pour la qualité proposée.",
      likes: 8,
      photos: []
    },
    {
      id: 3,
      user: {
        name: "Sophie Laurent",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      rating: 5,
      date: "2024-01-08",
      content: "Un vrai régal ! L'équipe est aux petits soins et la carte des vins est remarquable.",
      likes: 15,
      photos: [
        { id: 102, url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400&auto=format&fit=crop" },
        { id: 103, url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop" }
      ]
    }
  ]
})

// Lieux similaires
const similarPlaces = ref([
  {
    id: 2,
    name: "Chez Marcel",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "La Table du Chef",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Le Comptoir",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=200&auto=format&fit=crop"
  }
])

// Avis filtrés
const filteredReviews = computed(() => {
  let reviews = [...business.value.recentReviews]
  
  // Filtrage par note
  if (reviewFilter.value !== 'all') {
    const rating = parseInt(reviewFilter.value)
    reviews = reviews.filter(review => review.rating === rating)
  }
  
  // Tri
  reviews.sort((a, b) => {
    switch (reviewSort.value) {
      case 'recent':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })
  
  return reviews
})

// Fonctions
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const sharePlace = () => {
  if (navigator.share) {
    navigator.share({
      title: business.value.name,
      text: `Découvrez ${business.value.name} - ${business.value.category}`,
      url: window.location.href
    })
  } else {
    // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié dans le presse-papiers !')
  }
}

const callBusiness = () => {
  window.location.href = `tel:${business.value.phone}`
}

const getDirections = () => {
  const address = encodeURIComponent(business.value.fullAddress)
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
}

const visitWebsite = () => {
  window.open(business.value.website, '_blank')
}

const visitPlace = (placeId) => {
  // Navigation vers une autre page business
  console.log('Naviguer vers le lieu:', placeId)
}

const openPhotoGallery = (index) => {
  photoGallery.value = {
    isOpen: true,
    currentIndex: index,
    currentPhoto: business.value.photos[index]
  }
}

const closePhotoGallery = () => {
  photoGallery.value.isOpen = false
}

const nextPhoto = () => {
  if (photoGallery.value.currentIndex < business.value.photos.length - 1) {
    photoGallery.value.currentIndex++
    photoGallery.value.currentPhoto = business.value.photos[photoGallery.value.currentIndex]
  }
}

const previousPhoto = () => {
  if (photoGallery.value.currentIndex > 0) {
    photoGallery.value.currentIndex--
    photoGallery.value.currentPhoto = business.value.photos[photoGallery.value.currentIndex]
  }
}

const toggleReviewLike = (reviewId) => {
  const review = business.value.recentReviews.find(r => r.id === reviewId)
  if (review) {
    review.likes++
  }
}

const submitReview = () => {
  if (newReview.value.rating === 0 || !newReview.value.content.trim()) {
    alert('Veuillez donner une note et écrire un commentaire.')
    return
  }
  
  // Ajouter le nouvel avis
  const review = {
    id: Date.now(),
    user: {
      name: "Vous",
      avatar: "https://i.pravatar.cc/150?img=10"
    },
    rating: newReview.value.rating,
    date: new Date().toISOString().split('T')[0],
    content: newReview.value.content,
    likes: 0,
    photos: []
  }
  
  business.value.recentReviews.unshift(review)
  business.value.reviewCount++
  
  // Réinitialiser le formulaire
  newReview.value = { rating: 0, content: '' }
  showWriteReview.value = false
  
  alert('Votre avis a été publié avec succès !')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Navigation clavier pour la galerie
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (photoGallery.value.isOpen) {
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') previousPhoto()
      if (e.key === 'Escape') closePhotoGallery()
    }
  })
})
</script>

<style scoped>
/* Styles pour les transitions et animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>