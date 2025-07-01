<template>
  <div>
    <!-- Hero Section avec barre de recherche -->
    <section class="relative bg-primary-500 text-white">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-90"></div>
      <UContainer class="relative py-16 md:py-24">
        <div class="max-w-3xl mx-auto text-center space-y-6">
          <h1 class="text-4xl md:text-5xl font-bold">Découvrez les meilleurs commerces près de chez vous</h1>
          <p class="text-xl">Notez uniquement après avoir visité - Validation par NFC</p>
          
          <!-- Barre de recherche principale -->
          <div class="mt-8">
            <form @submit.prevent="onSearch" class="flex flex-col md:flex-row gap-2">
              <UInput 
                v-model="searchQuery" 
                placeholder="Restaurants, hôtels, services..." 
                size="xl"
                class="flex-grow"
                :ui="{ icon: { trailing: { pointer: '' } } }"
                trailing-icon="i-heroicons-magnifying-glass"
              />
              <UInput 
                v-model="locationQuery" 
                placeholder="Adresse, quartier, ville..." 
                size="xl"
                class="flex-grow"
                :ui="{ icon: { trailing: { pointer: '' } } }"
                trailing-icon="i-heroicons-map-pin"
              />
              <UButton type="submit" color="white" variant="solid" size="xl" class="whitespace-nowrap">
                Rechercher
              </UButton>
            </form>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Section Catégories -->
    <section class="py-12 bg-gray-50">
      <UContainer>
        <h2 class="text-2xl font-bold mb-8 text-center">Explorez par catégorie</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink to="/categories/restaurants" class="group">
            <UCard class="text-center hover:shadow-lg transition-all">
              <div class="p-4">
                <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <UIcon name="i-heroicons-utensils" class="text-primary-500 w-8 h-8" />
                </div>
                <h3 class="font-medium">Restaurants</h3>
              </div>
            </UCard>
          </NuxtLink>
          
          <NuxtLink to="/categories/hotels" class="group">
            <UCard class="text-center hover:shadow-lg transition-all">
              <div class="p-4">
                <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <UIcon name="i-heroicons-home" class="text-primary-500 w-8 h-8" />
                </div>
                <h3 class="font-medium">Hôtels</h3>
              </div>
            </UCard>
          </NuxtLink>
          
          <NuxtLink to="/categories/shopping" class="group">
            <UCard class="text-center hover:shadow-lg transition-all">
              <div class="p-4">
                <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <UIcon name="i-heroicons-shopping-bag" class="text-primary-500 w-8 h-8" />
                </div>
                <h3 class="font-medium">Shopping</h3>
              </div>
            </UCard>
          </NuxtLink>
          
          <NuxtLink to="/categories/services" class="group">
            <UCard class="text-center hover:shadow-lg transition-all">
              <div class="p-4">
                <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <UIcon name="i-heroicons-wrench-screwdriver" class="text-primary-500 w-8 h-8" />
                </div>
                <h3 class="font-medium">Services</h3>
              </div>
            </UCard>
          </NuxtLink>
        </div>
        
        <div class="mt-8 text-center">
          <UButton to="/categories" variant="outline" color="primary">
            Voir toutes les catégories
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- Section Commerces populaires -->
    <section class="py-12">
      <UContainer>
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold">Commerces populaires près de chez vous</h2>
          <UButton variant="ghost" to="/search" color="primary" trailing-icon="i-heroicons-arrow-right">
            Voir plus
          </UButton>
        </div>
        
        <!-- Liste des commerces (placeholder) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UCard v-for="i in 3" :key="i">
            <template #header>
              <div class="relative h-48 bg-gray-200">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div class="absolute bottom-4 left-4">
                  <UBadge color="white" variant="solid" class="mb-2">Restaurant</UBadge>
                  <h3 class="text-xl font-bold text-white">Restaurant Exemple {{ i }}</h3>
                </div>
              </div>
            </template>
            
            <div class="p-4">
              <div class="flex items-center mb-2">
                <div class="flex text-amber-400">
                  <UIcon v-for="star in 5" :key="star" :name="star <= 4 ? 'i-heroicons-star-solid' : 'i-heroicons-star-half'" class="w-5 h-5" />
                </div>
                <span class="ml-2 text-sm text-gray-600">128 avis</span>
              </div>
              
              <p class="text-gray-700 mb-4">Cuisine française • €€ • 2.3 km</p>
              
              <div class="flex items-center text-sm text-gray-600">
                <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-primary-500 mr-2" />
                <span>Vérifié par NFC</span>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- Section Comment ça marche -->
    <section class="py-12 bg-gray-50">
      <UContainer>
        <h2 class="text-2xl font-bold mb-8 text-center">Comment ça marche</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-map" class="text-primary-500 w-10 h-10" />
            </div>
            <h3 class="text-xl font-medium mb-2">1. Trouvez</h3>
            <p class="text-gray-600">Découvrez les meilleurs commerces et services près de chez vous</p>
          </div>
          
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-device-phone-mobile" class="text-primary-500 w-10 h-10" />
            </div>
            <h3 class="text-xl font-medium mb-2">2. Scannez</h3>
            <p class="text-gray-600">Utilisez votre téléphone pour scanner la puce NFC du commerce</p>
          </div>
          
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-star" class="text-primary-500 w-10 h-10" />
            </div>
            <h3 class="text-xl font-medium mb-2">3. Notez</h3>
            <p class="text-gray-600">Partagez votre expérience avec des avis authentiques et vérifiés</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Section Pour les professionnels -->
    <section class="py-12 bg-primary-500 text-white">
      <UContainer>
        <div class="md:flex items-center justify-between">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h2 class="text-3xl font-bold mb-4">Vous êtes un professionnel ?</h2>
            <p class="text-xl mb-6">Rejoignez notre plateforme et bénéficiez d'avis authentiques et vérifiés par NFC</p>
            <UButton to="/business/register" color="white" variant="solid" size="lg">
              Inscrivez votre commerce
            </UButton>
          </div>
          
          <div class="md:w-1/3">
            <UCard class="text-gray-800">
              <div class="p-4">
                <h3 class="text-xl font-bold mb-4">Avantages pour les professionnels</h3>
                <ul class="space-y-2">
                  <li class="flex items-start">
                    <UIcon name="i-heroicons-check-circle" class="text-primary-500 w-5 h-5 mr-2 mt-1" />
                    <span>Des avis authentiques vérifiés par NFC</span>
                  </li>
                  <li class="flex items-start">
                    <UIcon name="i-heroicons-check-circle" class="text-primary-500 w-5 h-5 mr-2 mt-1" />
                    <span>Tableau de bord avec statistiques détaillées</span>
                  </li>
                  <li class="flex items-start">
                    <UIcon name="i-heroicons-check-circle" class="text-primary-500 w-5 h-5 mr-2 mt-1" />
                    <span>Visibilité accrue auprès des clients potentiels</span>
                  </li>
                </ul>
              </div>
            </UCard>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup>
const searchQuery = ref('');
const locationQuery = ref('');

const onSearch = () => {
  // Rediriger vers la page de recherche avec les paramètres
  navigateTo({
    path: '/search',
    query: {
      q: searchQuery.value,
      location: locationQuery.value
    }
  });
};
</script>
