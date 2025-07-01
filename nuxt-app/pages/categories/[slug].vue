<template>
  <div>
    <UContainer class="py-12">
      <!-- En-tête avec titre de la catégorie -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <UButton 
            to="/categories" 
            variant="ghost" 
            color="gray" 
            icon="i-heroicons-arrow-left"
            class="!p-1"
          />
          <h1 class="text-3xl font-bold">{{ categoryInfo?.name || 'Catégorie' }}</h1>
        </div>
        <p class="text-gray-600">{{ categoryInfo?.count || 0 }} établissements trouvés</p>
      </div>
      
      <!-- Filtres et tri -->
      <div class="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div class="flex flex-wrap gap-2">
          <UButton 
            v-for="filter in filters" 
            :key="filter.id" 
            :variant="activeFilters.includes(filter.id) ? 'solid' : 'outline'" 
            :color="activeFilters.includes(filter.id) ? 'primary' : 'gray'"
            size="sm"
            @click="toggleFilter(filter.id)"
          >
            {{ filter.name }}
          </UButton>
        </div>
        
        <USelectMenu
          v-model="sortOption"
          :options="sortOptions"
          placeholder="Trier par"
          size="sm"
          class="w-full md:w-48"
        />
      </div>
      
      <!-- Affichage des résultats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Liste des commerces -->
        <div class="lg:col-span-2">
          <div v-if="businesses.length > 0" class="space-y-6">
            <UCard v-for="business in businesses" :key="business.id" class="overflow-hidden">
              <div class="flex flex-col md:flex-row">
                <!-- Image du commerce -->
                <div class="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden"></div>
                  <div class="absolute top-2 left-2 md:hidden">
                    <UBadge v-if="business.verified" color="success">Vérifié par NFC</UBadge>
                  </div>
                </div>
                
                <!-- Informations du commerce -->
                <div class="p-4 md:p-6 md:w-2/3">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-xl font-bold mb-1">{{ business.name }}</h3>
                      <div class="flex items-center mb-2">
                        <div class="flex text-amber-400">
                          <UIcon 
                            v-for="i in 5" 
                            :key="i" 
                            :name="i <= Math.floor(business.rating) ? 'i-heroicons-star-solid' : (i - 0.5 <= business.rating ? 'i-heroicons-star-half' : 'i-heroicons-star')" 
                            class="w-4 h-4"
                          />
                        </div>
                        <span class="ml-2 text-sm text-gray-600">{{ business.reviewCount }} avis</span>
                      </div>
                    </div>
                    
                    <div class="hidden md:block">
                      <UBadge v-if="business.verified" color="success">Vérifié par NFC</UBadge>
                    </div>
                  </div>
                  
                  <p class="text-gray-700 mb-3">{{ business.description }}</p>
                  
                  <div class="flex flex-wrap gap-2 mb-4">
                    <UBadge v-for="tag in business.tags" :key="tag" color="gray" variant="subtle">
                      {{ tag }}
                    </UBadge>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                      <div class="flex items-center">
                        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
                        <span>{{ business.distance }} km</span>
                      </div>
                    </div>
                    
                    <UButton 
                      :to="`/business/${business.id}`" 
                      color="primary" 
                      variant="ghost"
                      trailing-icon="i-heroicons-arrow-right"
                    >
                      Voir détails
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
          
          <!-- Message si aucun résultat -->
          <div v-else class="text-center py-12">
            <UIcon name="i-heroicons-face-frown" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 class="text-xl font-medium text-gray-700 mb-2">Aucun établissement trouvé</h3>
            <p class="text-gray-500">Essayez avec d'autres filtres</p>
            <UButton class="mt-4" @click="resetFilters">Réinitialiser les filtres</UButton>
          </div>
          
          <!-- Pagination -->
          <div v-if="businesses.length > 0" class="mt-8 flex justify-center">
            <UPagination v-model="currentPage" :total="totalPages" :ui="{ wrapper: 'gap-1' }" />
          </div>
        </div>
        
        <!-- Carte -->
        <div class="lg:col-span-1 order-first lg:order-last mb-8 lg:mb-0">
          <UCard class="sticky top-4">
            <div class="p-4">
              <h3 class="font-medium mb-4">Carte des établissements</h3>
              <div class="bg-gray-200 h-64 rounded flex items-center justify-center">
                <p class="text-gray-500 text-sm">Carte interactive (à implémenter)</p>
              </div>
              <p class="mt-4 text-sm text-gray-600">
                {{ businesses.length }} établissements affichés sur la carte
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = computed(() => route.params.slug);

// Informations sur la catégorie
const categoryInfo = computed(() => {
  const categories = {
    'restaurants': { name: 'Restaurants', count: 1245, icon: 'i-heroicons-utensils' },
    'hotels': { name: 'Hôtels', count: 568, icon: 'i-heroicons-home' },
    'shopping': { name: 'Shopping', count: 982, icon: 'i-heroicons-shopping-bag' },
    'services': { name: 'Services', count: 754, icon: 'i-heroicons-wrench-screwdriver' },
    'beauty-wellness': { name: 'Beauté & Bien-être', count: 421, icon: 'i-heroicons-sparkles' },
    'health': { name: 'Santé', count: 387, icon: 'i-heroicons-heart' },
    'automotive': { name: 'Automobile', count: 246, icon: 'i-heroicons-truck' },
    'entertainment': { name: 'Divertissement', count: 312, icon: 'i-heroicons-musical-note' },
    'education': { name: 'Éducation', count: 189, icon: 'i-heroicons-academic-cap' },
    'sports-recreation': { name: 'Sports & Loisirs', count: 278, icon: 'i-heroicons-trophy' },
    'real-estate': { name: 'Immobilier', count: 203, icon: 'i-heroicons-building-office' },
    'financial-services': { name: 'Services financiers', count: 156, icon: 'i-heroicons-banknotes' },
  };
  
  return categories[slug.value] || { name: 'Catégorie inconnue', count: 0 };
});

// Options de filtrage
const filters = [
  { id: 'verified', name: 'Vérifiés par NFC' },
  { id: 'open_now', name: 'Ouvert maintenant' },
  { id: 'offers', name: 'Offres spéciales' },
  { id: 'price_1', name: '€' },
  { id: 'price_2', name: '€€' },
  { id: 'price_3', name: '€€€' },
  { id: 'rating_4plus', name: '4★ et plus' }
];

const activeFilters = ref(['verified']);

const toggleFilter = (filterId) => {
  const index = activeFilters.value.indexOf(filterId);
  if (index === -1) {
    activeFilters.value.push(filterId);
  } else {
    activeFilters.value.splice(index, 1);
  }
  // Ici, vous pourriez déclencher une requête pour filtrer les résultats
};

const resetFilters = () => {
  activeFilters.value = [];
  // Ici, vous pourriez déclencher une requête pour réinitialiser les résultats
};

// Options de tri
const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Note la plus élevée', value: 'rating_desc' },
  { label: 'Distance', value: 'distance' },
  { label: 'Nombre d\'avis', value: 'review_count' }
];

const sortOption = ref('relevance');

// Pagination
const currentPage = ref(1);
const totalPages = 10;

// Données de démonstration pour les commerces
const businesses = ref([
  {
    id: 1,
    name: 'Le Bistrot Parisien',
    rating: 4.5,
    reviewCount: 128,
    description: 'Restaurant français traditionnel avec une ambiance chaleureuse et conviviale.',
    tags: ['Français', 'Traditionnel', 'Vin'],
    distance: 1.2,
    verified: true
  },
  {
    id: 2,
    name: 'Sushi Master',
    rating: 4.8,
    reviewCount: 95,
    description: 'Restaurant japonais spécialisé dans les sushis et sashimis frais.',
    tags: ['Japonais', 'Sushi', 'Asiatique'],
    distance: 2.5,
    verified: true
  },
  {
    id: 3,
    name: 'Pizzeria Napoli',
    rating: 4.2,
    reviewCount: 210,
    description: 'Pizzas authentiques cuites au feu de bois selon la tradition napolitaine.',
    tags: ['Italien', 'Pizza', 'Pâtes'],
    distance: 0.8,
    verified: false
  },
  {
    id: 4,
    name: 'Le Petit Café',
    rating: 4.0,
    reviewCount: 76,
    description: 'Café cosy proposant des pâtisseries maison et des boissons artisanales.',
    tags: ['Café', 'Pâtisserie', 'Brunch'],
    distance: 1.7,
    verified: true
  },
  {
    id: 5,
    name: 'Burger House',
    rating: 3.9,
    reviewCount: 154,
    description: 'Burgers gourmet avec des ingrédients frais et locaux.',
    tags: ['Burger', 'Fast-food', 'Américain'],
    distance: 3.1,
    verified: false
  }
]);

// Dans une application réelle, vous feriez un appel API ici pour récupérer les données
// en fonction de la catégorie (slug), des filtres et de la pagination
</script>
