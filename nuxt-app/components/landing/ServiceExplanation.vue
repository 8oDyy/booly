<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left content -->
        <div>
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-2 text-blue-600" />
            Avis 100% authentiques
          </div>
          
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Des avis que vous pouvez 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              vraiment faire confiance
            </span>
          </h2>
          
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Contrairement aux autres plateformes, nos avis sont vérifiés par technologie NFC ou QR Code. 
            Seuls les vrais clients peuvent laisser un avis après leur visite.
          </p>
          
          <!-- Features list -->
          <div class="space-y-4 mb-8">
            <div class="flex items-start">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-blue-600" />
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-gray-900 mb-1">Scan NFC/QR obligatoire</h3>
                <p class="text-gray-600">Chaque avis nécessite un scan de puce NFC ou QR Code en magasin</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-blue-600" />
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-gray-900 mb-1">Géolocalisation vérifiée</h3>
                <p class="text-gray-600">Impossible de laisser un avis sans être physiquement présent</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-blue-600" />
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-gray-900 mb-1">Communauté locale</h3>
                <p class="text-gray-600">Découvrez les meilleurs services recommandés par vos voisins</p>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton
              to="/search"
              size="lg"
              class="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              Découvrir les services
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
            </UButton>
            
            <UButton
              to="footer_link/how-it-works"
              variant="outline"
              size="lg"
              color="secondary"
              class="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Comment ça marche ?
            </UButton>
          </div>
        </div>
        
        <!-- Right visual -->
        <div class="relative">
          <!-- Main illustration -->
          <div class="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 lg:p-12">
            <!-- Phone mockup -->
            <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-building-storefront" class="w-4 h-4 text-white" />
                  </div>
                  <div class="ml-3">
                    <h4 class="font-semibold text-gray-900 text-sm">Le Bistrot Parisien</h4>
                    <p class="text-gray-500 text-xs">Restaurant</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                  <span class="text-sm font-medium text-gray-900 ml-1">4.8</span>
                </div>
              </div>
              
              <!-- NFC scan animation -->
              <div class="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 mb-4 text-center">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <UIcon name="i-heroicons-device-phone-mobile" class="w-8 h-8 text-blue-600" />
                </div>
                <p class="text-sm font-medium text-blue-700">Scan NFC détecté ✓</p>
                <p class="text-xs text-blue-600 mt-1">Vous pouvez maintenant laisser un avis</p>
              </div>
              
              <!-- Review form preview -->
              <div class="space-y-3">
                <div class="flex justify-center space-x-1">
                  <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-6 h-6 text-yellow-400" />
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-xs text-gray-600">Excellent service, nourriture délicieuse...</p>
                </div>
                <UButton size="sm" class="w-full bg-blue-500 hover:bg-blue-600">
                  Publier l'avis
                </UButton>
              </div>
            </div>
            
            <!-- Floating elements -->
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-blue-500" />
            </div>
            
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// This component is purely presentational
</script>
