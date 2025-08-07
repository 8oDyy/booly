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
            <UIcon name="i-heroicons-tag" class="w-4 h-4" />
            <span>{{ tag.name }}</span>
          </button>
          
          <!-- Bouton Plus avec Modal intégré -->
          <UModal title="Tous les tags" v-model="isTagsModalOpen" :ui="{ width: 'sm:max-w-3xl' }">

            <button
              class="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200"
              @click="isTagsModalOpen = true"
            >
              <UIcon name="i-heroicons-plus" class="w-4 h-4" />
              <span>Plus</span>
            </button>
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
                        class="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        :class="[
                          selectedTags.includes(tag.id) ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                        ]"
                      >
                        <UIcon name="i-heroicons-tag" class="w-4 h-4" />
                        <span>{{ tag.name }}</span>
                      </button>
                    </div>
                  </div>
                </div>
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
  import { ref, computed, watch } from 'vue'
  
  // Définition des événements émis par le composant
  const emit = defineEmits(['update:filters'])
  
  // Définition des props
  const props = defineProps({
    selectedPrices: {
      type: Array,
      default: () => []
    },
    minRating: {
      type: Number,
      default: 0
    },
    selectedTags: {
      type: Array,
      default: () => []
    }
  })
  
  // État local
  const selectedPrices = ref(props.selectedPrices)
  const selectedTags = ref(props.selectedTags)
  const selectedDistance = ref(10)
  const selectedRating = ref(props.minRating)

  // Watchers pour synchroniser les props avec l'état local
  watch(() => props.selectedPrices, (newPrices) => {
    selectedPrices.value = [...newPrices]
  })

  watch(() => props.selectedTags, (newTags) => {
    selectedTags.value = [...newTags]
  })

  watch(() => props.minRating, (newRating) => {
    selectedRating.value = newRating
  })
  
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
  
  // Tags suggérés (visibles par défaut) - récupérés dynamiquement
  const { popularTags, loading: loadingPopularTags } = usePopularTags()
  
  // Tous les tags récupérés depuis la base de données
  const { allTags, loading: loadingAllTags } = useAllTags()
  
  // Tous les tags organisés par catégorie
  // Pour l'instant, nous gardons la structure des catégories mais utilisons les tags réels
  const tagCategories = computed(() => {
    // Si les tags ne sont pas encore chargés, retourner la structure vide
    if (loadingAllTags.value || allTags.value.length === 0) {
      return [
        { name: 'Ambiance', tags: [] },
        { name: 'Services', tags: [] },
        { name: 'Cuisine', tags: [] },
        { name: 'Horaires', tags: [] }
      ]
    }
    
    // Catégorisation temporaire basée sur des mots-clés
    const ambiance = ['romantique', 'familial', 'business', 'décontracté', 'chic', 'animé']
    const services = ['wifi', 'parking', 'terrasse', 'accessible', 'climatisé', 'musique']
    const cuisine = ['végétarien', 'vegan', 'halal', 'bio', 'maison', 'local']
    const horaires = ['petit', 'brunch', 'déjeuner', 'diner', '24h', 'tard', 'matin', 'soir']
    
    // Fonction pour catégoriser un tag
    const categorizeTag = (tag) => {
      const name = tag.name.toLowerCase()
      
      if (ambiance.some(keyword => name.includes(keyword))) return 'Ambiance'
      if (services.some(keyword => name.includes(keyword))) return 'Services'
      if (cuisine.some(keyword => name.includes(keyword))) return 'Cuisine'
      if (horaires.some(keyword => name.includes(keyword))) return 'Horaires'
      
      // Par défaut, mettre dans Services
      return 'Services'
    }
    
    // Créer des objets pour chaque catégorie
    const categorized = {
      'Ambiance': [],
      'Services': [],
      'Cuisine': [],
      'Horaires': []
    }
    
    // Catégoriser chaque tag
    allTags.value.forEach(tag => {
      const category = categorizeTag(tag)
      categorized[category].push({
        id: tag.id,
        name: tag.name
      })
    })
    
    // Convertir en format attendu
    return Object.entries(categorized).map(([name, tags]) => ({
      name,
      tags
    }))
  })
  
  // Tags visibles par défaut
  const visibleTags = computed(() => popularTags.value)
  
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
    
    // Émettre l'événement update:filters avec les tags sélectionnés
    emit('update:filters', {
      tags: [...selectedTags.value]
    })
    console.log('🔍 Événement update:filters émis avec tags:', { tags: [...selectedTags.value] })
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
  
  const clearAllFilters = () => {
    // Réinitialiser tous les filtres
    selectedPrices.value = []
    selectedTags.value = []
    selectedDistance.value = 10
    selectedRating.value = 0
    quickFilters.value = {
      openNow: false,
      delivery: false,
      reservation: false
    }
    
    // Émettre l'événement pour synchroniser avec le parent
    emit('update:filters', {
      prices: [],
      tags: [],
      rating: 0
    })
    
    console.log('🔍 Tous les filtres ont été effacés')
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