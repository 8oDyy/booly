<template>
  <section class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 text-white overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0">
      <div class="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div class="text-center">
        <!-- Badge -->
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-8">
          <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-2" />
          Avis 100% vérifiés par NFC/QR Code
        </div>
        
        <!-- Main heading -->
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Trouvez les meilleurs
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
            services locaux
          </span>
        </h1>
        
        <!-- Subheading -->
        <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
          Des avis authentiques, des services de qualité. Découvrez et partagez vos expériences avec la communauté locale.
        </p>
        
        <!-- Search bar -->
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl p-2 shadow-2xl">
            <div class="flex flex-col md:flex-row gap-2">
              <!-- Service search -->
              <div class="flex-1 relative">
                <UIcon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <UInput
                  v-model="searchQuery"
                  placeholder="Que recherchez-vous ? (restaurant, coiffeur, garage...)"
                  class="pl-12 h-14 text-lg border-0 focus:ring-0"
                  :ui="{ 
                    base: 'w-full h-14 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 rounded-xl'
                  }"
                  @keyup.enter="handleSearch"
                />
              </div>
              
              <!-- Location search -->
              <div class="md:w-80 relative">
                <UIcon name="i-heroicons-map-pin" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <UInput
                  v-model="locationQuery"
                  placeholder="Où ?"
                  class="pl-12 h-14 text-lg border-0 focus:ring-0"
                  :ui="{ 
                    base: 'w-full h-14 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 rounded-xl'
                  }"
                  @keyup.enter="handleSearch"
                />
              </div>
              
              <!-- Search button -->
              <UButton
                @click="handleSearch"
                size="xl"
                class="h-14 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 mr-2" />
                Rechercher
              </UButton>
            </div>
          </div>
          
          <!-- Popular searches -->
          <div class="mt-6 text-center">
            <p class="text-blue-200 text-sm mb-3">Recherches populaires :</p>
            <div class="flex flex-wrap justify-center gap-2">
              <UButton
                v-for="tag in popularSearches"
                :key="tag"
                variant="ghost"
                size="sm"
                class="text-white border-white/30 hover:bg-white/20 rounded-full"
                @click="searchQuery = tag; handleSearch()"
              >
                {{ tag }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const locationQuery = ref('')

const popularSearches = [
  'Restaurant',
  'Coiffeur',
  'Garage',
  'Médecin',
  'Plombier',
  'Boulangerie'
]

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  navigateTo({
    path: '/search',
    query: {
      q: searchQuery.value,
      location: locationQuery.value || undefined
    }
  })
}
</script>
