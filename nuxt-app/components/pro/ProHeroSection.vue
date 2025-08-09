<template>
  <section class="relative bg-blue-600 text-white">
    <!-- Simplified background -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-90"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left content -->
        <div class="text-center lg:text-left">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg text-blue-100 text-sm font-medium mb-6">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-2" />
            Avis 100% authentiques
          </div>
          
          <!-- Main heading -->
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Transformez vos avis en
            <span class="text-yellow-300">
              avantage concurrentiel
            </span>
          </h1>
          
          <!-- Subheading -->
          <p class="text-lg text-blue-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            Rejoignez Booly Pro et obtenez des avis clients authentiques grâce à notre système de vérification NFC/QR au moment du paiement.
          </p>
          
          <!-- Key benefits -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <div class="flex items-center text-blue-200">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 mr-2 text-green-400" />
              <span>Essai gratuit 30 jours</span>
            </div>
            <div class="flex items-center text-blue-200">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 mr-2 text-green-400" />
              <span>Installation en 5 minutes</span>
            </div>
            <div class="flex items-center text-blue-200">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 mr-2 text-green-400" />
              <span>Support dédié</span>
            </div>
          </div>
          
          <!-- CTA buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton
              @click="scrollToPricing"
              size="lg"
              class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg"
            >
              <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 mr-2" />
              Commencer l'essai gratuit
            </UButton>
            
            <UButton
              @click="openDemo"
              variant="outline"
              size="lg"
              class="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg"
            >
              <UIcon name="i-heroicons-play" class="w-5 h-5 mr-2" />
              Voir la démo
            </UButton>
          </div>
        </div>
        
        <!-- Right visual -->
        <div class="relative">
          <!-- Dashboard mockup -->
          <div class="relative bg-white/10 rounded-2xl p-6 border border-white/20">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-white" />
                </div>
                <div class="ml-3">
                  <h3 class="font-semibold text-white">Tableau de bord Pro</h3>
                  <p class="text-blue-200 text-sm">Votre Restaurant</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-white">4.8</p>
                <p class="text-blue-200 text-sm">Note moyenne</p>
              </div>
            </div>
            
            <!-- Stats cards -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p class="text-white text-2xl font-bold">127</p>
                <p class="text-blue-200 text-sm">Avis ce mois</p>
              </div>
              <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p class="text-white text-2xl font-bold">+23%</p>
                <p class="text-blue-200 text-sm">Croissance</p>
              </div>
            </div>
            
            <!-- Chart placeholder -->
            <div class="bg-white/5 rounded-xl p-4 h-32 flex items-center justify-center">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-8 bg-blue-400 rounded"></div>
                <div class="w-2 h-12 bg-blue-500 rounded"></div>
                <div class="w-2 h-6 bg-blue-300 rounded"></div>
                <div class="w-2 h-16 bg-blue-600 rounded"></div>
                <div class="w-2 h-10 bg-blue-400 rounded"></div>
                <div class="w-2 h-14 bg-blue-500 rounded"></div>
              </div>
            </div>
            

          </div>
        </div>
      </div>
      
      <!-- Trust indicators -->
      <div class="mt-16 pt-8 border-t border-white/20">
        <p class="text-center text-blue-200 text-sm mb-6">Ils nous font déjà confiance</p>
        <div class="flex justify-center items-center space-x-8 opacity-60">
          <div class="text-white font-semibold">Restaurant Le Gourmet</div>
          <div class="text-white font-semibold">Salon Beauté Plus</div>
          <div class="text-white font-semibold">Garage Martin</div>
          <div class="text-white font-semibold">Boulangerie Dupont</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Methods
const scrollToPricing = () => {
  const pricingSection = document.getElementById('pricing-section')
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const openDemo = () => {
  // Ouvrir une modal de démo ou rediriger vers une page de démo
  console.log('Ouvrir la démo')
  // TODO: Implémenter la logique de démo
}
</script>
