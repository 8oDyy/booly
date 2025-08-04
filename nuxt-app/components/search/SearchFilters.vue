<template>
    <div class="p-6 bg-white dark:bg-gray-900 h-full overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Filtres</h2>
        <button 
          @click="clearAllFilters"
          class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Tout effacer
        </button>
      </div>
  
      <!-- Filtre par prix -->
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Gamme de prix</h3>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="price in priceRanges"
            :key="price.value"
            @click="togglePrice(price.value)"
            :class="[
              'flex flex-col items-center justify-center h-16 rounded-lg border-2 transition-all duration-200',
              selectedPrices.includes(price.value) 
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
            ]"
          >
            <span class="text-lg font-bold">{{ price.symbols }}</span>
            <span class="text-xs">{{ price.label }}</span>
          </button>
        </div>
      </div>
  
      <!-- Tags suggérés -->
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Tags populaires</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in visibleTags"
            :key="tag.id"
            @click="toggleTag(tag.id)"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedTags.includes(tag.id) 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
          >
            <UIcon :name="tag.icon" class="w-4 h-4" />
            <span>{{ tag.name }}</span>
          </button>
          
          <!-- Bouton Plus avec Modal intégré -->
          <UModal v-model="isTagsModalOpen" :ui="{ width: 'sm:max-w-3xl' }">
            <!-- Le bouton qui ouvre le modal -->
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200"
              @click="isTagsModalOpen = true"
            >
              <UIcon name="i-heroicons-plus" class="w-4 h-4" />
              <span>Plus</span>
            </button>

            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Tous les tags</h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="isTagsModalOpen = false"
                />
              </div>
            </template>
            
            <!-- Contenu du modal -->
            <template #body>
              <UCard>
                <div class="space-y-6 max-h-96 overflow-y-auto">
                  <div
                    v-for="category in tagCategories"
                    :key="category.name"
                    class="space-y-3"
                  >
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 pb-2">
                      {{ category.name }}
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="tag in category.tags"
                        :key="tag.id"
                        @click="toggleTag(tag.id)"
                        :class="[
                          'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200',
                          selectedTags.includes(tag.id) 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        ]"
                      >
                        <UIcon :name="tag.icon" class="w-4 h-4" />
                        <span>{{ tag.name }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <template #footer>
                  <div class="flex justify-between">
                    <UButton variant="ghost" @click="clearAllTags" color="red">
                      Effacer les tags
                    </UButton>
                    <UButton @click="isTagsModalOpen = false" color="blue">
                      Appliquer ({{ selectedTags.length }})
                    </UButton>
                  </div>
                </template>
              </UCard>
            </template>
          </UModal>
        </div>
      </div>
  
      <!-- Distance -->
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Distance</h3>
        <div class="space-y-4">
          <!-- Slider -->
          <div class="px-2">
            <input
              v-model="selectedDistance"
              type="range"
              min="1"
              max="50"
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
            />
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>1 km</span>
              <span class="font-semibold text-blue-600 dark:text-blue-400">{{ selectedDistance }} km</span>
              <span>50 km</span>
            </div>
          </div>
          
          <!-- Boutons rapides -->
          <div class="flex gap-2">
            <button
              v-for="distance in quickDistances"
              :key="distance"
              @click="selectedDistance = distance"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-all duration-200',
                selectedDistance === distance 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              {{ distance }}km
            </button>
          </div>
        </div>
      </div>
  
      <!-- Note minimum -->
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Note minimum</h3>
        <div class="space-y-2">
          <button
            v-for="rating in ratingOptions"
            :key="rating.value"
            @click="setMinRating(rating.value)"
            :class="[
              'flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200',
              selectedRating === rating.value 
                ? 'bg-blue-50 border-2 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
            ]"
          >
            <div class="flex items-center gap-2">
              <div class="flex">
                <UIcon 
                  v-for="star in 5" 
                  :key="star"
                  :name="star <= rating.value ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                  :class="star <= rating.value ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                  class="w-4 h-4"
                />
              </div>
              <span class="text-sm font-medium">{{ rating.value }}+ étoiles</span>
            </div>
          </button>
        </div>
      </div>
  
      <!-- Filtres rapides -->
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Filtres rapides</h3>
        <div class="space-y-2">
          <button
            @click="toggleQuickFilter('openNow')"
            :class="[
              'flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200',
              quickFilters.openNow 
                ? 'bg-green-50 border-2 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-300' 
                : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
            ]"
          >
            <UIcon name="i-heroicons-clock" class="w-5 h-5" />
            <span class="font-medium">Ouvert maintenant</span>
          </button>
          
          <button
            @click="toggleQuickFilter('delivery')"
            :class="[
              'flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200',
              quickFilters.delivery 
                ? 'bg-orange-50 border-2 border-orange-500 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' 
                : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
            ]"
          >
            <UIcon name="i-heroicons-truck" class="w-5 h-5" />
            <span class="font-medium">Livraison</span>
          </button>
          
          <button
            @click="toggleQuickFilter('reservation')"
            :class="[
              'flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200',
              quickFilters.reservation 
                ? 'bg-purple-50 border-2 border-purple-500 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' 
                : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
            ]"
          >
            <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
            <span class="font-medium">Réservation</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // Définition des événements émis par le composant
  const emit = defineEmits(['update:filters'])
  
  // État local
  const selectedPrices = ref([])
  const selectedTags = ref([])
  const selectedDistance = ref(10)
  const selectedRating = ref(0)
  const quickFilters = ref({
    openNow: false,
    delivery: false,
    reservation: false
  })
  const isTagsModalOpen = ref(false) // Assurez-vous que le modal est fermé par défaut
  
  // Données en dur
  const priceRanges = [
    { value: 1, symbols: '$', label: 'Éco' },
    { value: 2, symbols: '$$', label: 'Mod' },
    { value: 3, symbols: '$$$', label: 'Cher' },
    { value: 4, symbols: '$$$$', label: 'Luxe' }
  ]
  
  const quickDistances = [5, 10, 25, 50]
  
  const ratingOptions = [
    { value: 1, label: '1+ étoiles' },
    { value: 2, label: '2+ étoiles' },
    { value: 3, label: '3+ étoiles' },
    { value: 4, label: '4+ étoiles' }
  ]
  
  // Tags suggérés (visibles par défaut)
  const popularTags = [
    { id: 'terrasse', name: 'Terrasse', icon: 'i-heroicons-sun' },
    { id: 'romantique', name: 'Romantique', icon: 'i-heroicons-heart' },
    { id: 'familial', name: 'Familial', icon: 'i-heroicons-user-group' },
    { id: 'wifi', name: 'WiFi', icon: 'i-heroicons-wifi' },
    { id: 'parking', name: 'Parking', icon: 'i-heroicons-truck' }
  ]
  
  // Tous les tags organisés par catégorie
  const tagCategories = [
    {
      name: 'Ambiance',
      tags: [
        { id: 'romantique', name: 'Romantique', icon: 'i-heroicons-heart' },
        { id: 'familial', name: 'Familial', icon: 'i-heroicons-user-group' },
        { id: 'business', name: 'Business', icon: 'i-heroicons-briefcase' },
        { id: 'decontracte', name: 'Décontracté', icon: 'i-heroicons-face-smile' },
        { id: 'chic', name: 'Chic', icon: 'i-heroicons-sparkles' },
        { id: 'anime', name: 'Animé', icon: 'i-heroicons-speaker-wave' }
      ]
    },
    {
      name: 'Services',
      tags: [
        { id: 'wifi', name: 'WiFi', icon: 'i-heroicons-wifi' },
        { id: 'parking', name: 'Parking', icon: 'i-heroicons-truck' },
        { id: 'terrasse', name: 'Terrasse', icon: 'i-heroicons-sun' },
        { id: 'accessible', name: 'Accessible PMR', icon: 'i-heroicons-user' },
        { id: 'climatise', name: 'Climatisé', icon: 'i-heroicons-snowflake' },
        { id: 'musique', name: 'Musique live', icon: 'i-heroicons-musical-note' }
      ]
    },
    {
      name: 'Cuisine',
      tags: [
        { id: 'vegetarien', name: 'Végétarien', icon: 'i-heroicons-leaf' },
        { id: 'vegan', name: 'Vegan', icon: 'i-heroicons-leaf' },
        { id: 'halal', name: 'Halal', icon: 'i-heroicons-check-badge' },
        { id: 'bio', name: 'Bio', icon: 'i-heroicons-heart' },
        { id: 'fait-maison', name: 'Fait maison', icon: 'i-heroicons-home' },
        { id: 'local', name: 'Produits locaux', icon: 'i-heroicons-map-pin' }
      ]
    },
    {
      name: 'Horaires',
      tags: [
        { id: 'petit-dej', name: 'Petit-déjeuner', icon: 'i-heroicons-sun' },
        { id: 'brunch', name: 'Brunch', icon: 'i-heroicons-cake' },
        { id: 'dejeuner', name: 'Déjeuner', icon: 'i-heroicons-clock' },
        { id: 'diner', name: 'Dîner', icon: 'i-heroicons-moon' },
        { id: '24h', name: '24h/24', icon: 'i-heroicons-clock' },
        { id: 'tard', name: 'Ouvert tard', icon: 'i-heroicons-moon' }
      ]
    }
  ]
  
  // Tags visibles par défaut
  const visibleTags = computed(() => popularTags)
  
  // Méthodes
  const togglePrice = (value) => {
    console.log('🔍 togglePrice appelé avec:', value)
    const alreadySelected = selectedPrices.value.includes(value)
    selectedPrices.value = alreadySelected
      ? selectedPrices.value.filter((p) => p !== value)
      : [...selectedPrices.value, value]

    console.log('🔍 selectedPrices après mise à jour:', selectedPrices.value)
    
    emit('update:filters', {
      prices: [...selectedPrices.value]
    })
    console.log('🔍 Événement update:filters émis avec:', { prices: [...selectedPrices.value] })
  }
  
  const toggleTag = (tagId) => {
    const index = selectedTags.value.indexOf(tagId)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    } else {
      selectedTags.value.push(tagId)
    }
  }
  
  const setMinRating = (rating) => {
    selectedRating.value = selectedRating.value === rating ? 0 : rating
    
    // Émettre l'événement update:filters avec la note sélectionnée
    emit('update:filters', {
      rating: selectedRating.value
    })
    console.log('🔍 Événement update:filters émis avec rating:', { rating: selectedRating.value })
  }
  
  const toggleQuickFilter = (filter) => {
    quickFilters.value[filter] = !quickFilters.value[filter]
  }

  const togglePriceRange = (priceRange) => {
    const index = selectedPrices.value.indexOf(priceRange)
    if (index > -1) {
      selectedPrices.value.splice(index, 1)
    } else {
      selectedPrices.value.push(priceRange)
    }
  }

  
  const clearAllTags = () => {
    selectedTags.value = []
  }
  
  const clearAllFilters = () => {
    selectedPrices.value = []
    selectedTags.value = []
    selectedDistance.value = 10
    selectedRating.value = 0
    quickFilters.value = {
      openNow: false,
      delivery: false,
      reservation: false
    }
  }
  </script>
  
  <style scoped>
  /* Style pour le slider */
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  </style>