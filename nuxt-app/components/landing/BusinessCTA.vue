<template>
  <section class="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 text-white relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left content -->
        <div>
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-6">
            <UIcon name="i-heroicons-building-storefront" class="w-4 h-4 mr-2" />
            Pour les professionnels
          </div>
          
          <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Rejoignez la communauté des 
            <span class="text-yellow-300">commerces de confiance</span>
          </h2>
          
          <p class="text-xl text-teal-100 mb-8 leading-relaxed">
            Augmentez votre visibilité, collectez des avis authentiques et développez votre clientèle locale avec Booly Pro.
          </p>
          
          <!-- Benefits list -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center">
              <div class="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
              </div>
              <span class="ml-3 text-teal-100">Profil professionnel complet avec photos et informations</span>
            </div>
            
            <div class="flex items-center">
              <div class="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
              </div>
              <span class="ml-3 text-teal-100">Kit NFC/QR Code personnalisé pour collecter les avis</span>
            </div>
            
            <div class="flex items-center">
              <div class="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
              </div>
              <span class="ml-3 text-teal-100">Tableau de bord avec statistiques et gestion des avis</span>
            </div>
            
            <div class="flex items-center">
              <div class="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
              </div>
              <span class="ml-3 text-teal-100">Mise en avant dans les résultats de recherche</span>
            </div>
          </div>
          
          <!-- CTA buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton
              to="/business/register"
              size="xl"
              class="bg-white text-blue-600 hover:bg-gray-50 font-semibold shadow-lg"
            >
              Créer mon profil pro
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
            </UButton>
            
            <UButton
              to="/business/demo"
              variant="outline"
              size="xl"
              class="border-white/30 text-white hover:bg-white/10"
            >
              Voir la démo
              <UIcon name="i-heroicons-play" class="w-5 h-5 ml-2" />
            </UButton>
          </div>
          
          <!-- Pricing info -->
          <div class="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white font-semibold">Essai gratuit 30 jours</p>
                <p class="text-blue-200 text-sm">Puis 29€/mois - Résiliable à tout moment</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-white">29€</p>
                <p class="text-blue-200 text-sm">/mois</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right visual -->
        <div class="relative">
          <!-- Dashboard mockup -->
          <div class="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-white" />
                </div>
                <div class="ml-3">
                  <h3 class="font-semibold text-gray-900">Tableau de bord</h3>
                  <p class="text-gray-500 text-sm">Le Bistrot Parisien</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-blue-600">4.8</p>
                <p class="text-gray-500 text-sm">Note moyenne</p>
              </div>
            </div>
            
            <!-- Stats cards -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-blue-600 text-2xl font-bold">127</p>
                <p class="text-gray-600 text-sm">Avis ce mois</p>
              </div>
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-blue-600 text-2xl font-bold">2.4k</p>
                <p class="text-gray-600 text-sm">Vues profil</p>
              </div>
            </div>
            
            <!-- Recent reviews -->
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900 text-sm">Avis récents</h4>
              
              <div class="flex items-start space-x-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=40" class="w-8 h-8 rounded-full" />
                <div class="flex-1">
                  <div class="flex items-center space-x-1 mb-1">
                    <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-3 h-3 text-yellow-400" />
                  </div>
                  <p class="text-gray-700 text-xs">Excellent service, je recommande vivement...</p>
                  <p class="text-gray-500 text-xs mt-1">Sophie M. • Il y a 2h</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=40" class="w-8 h-8 rounded-full" />
                <div class="flex-1">
                  <div class="flex items-center space-x-1 mb-1">
                    <UIcon v-for="i in 4" :key="i" name="i-heroicons-star-solid" class="w-3 h-3 text-yellow-400" />
                    <UIcon name="i-heroicons-star" class="w-3 h-3 text-gray-300" />
                  </div>
                  <p class="text-gray-700 text-xs">Très bon restaurant, ambiance chaleureuse...</p>
                  <p class="text-gray-500 text-xs mt-1">Thomas D. • Il y a 5h</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Floating NFC card -->
          <div class="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border-2 border-emerald-200">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-device-phone-mobile" class="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">Kit NFC inclus</p>
                <p class="text-gray-600 text-xs">Collectez des avis facilement</p>
              </div>
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
