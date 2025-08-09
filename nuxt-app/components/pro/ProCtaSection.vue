<template>
  <section class="py-20 bg-blue-600 text-white relative">
    <!-- Simplified background -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-90"></div>
    
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Main CTA -->
      <div class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Prêt à transformer vos avis en
          <span class="text-yellow-300">
            avantage concurrentiel ?
          </span>
        </h2>
        
        <p class="text-lg text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
          Rejoignez les 500+ entreprises qui font confiance à Booly Pro pour développer leur activité grâce aux avis authentiques.
        </p>
        
        <!-- Key benefits reminder -->
        <div class="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
          <div class="flex items-center text-blue-200">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 mr-2 text-green-400" />
            <span class="font-medium">30 jours gratuits</span>
          </div>
          <div class="flex items-center text-blue-200">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 mr-2 text-green-400" />
            <span class="font-medium">Installation en 5 min</span>
          </div>
          <div class="flex items-center text-blue-200">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 mr-2 text-green-400" />
            <span class="font-medium">Aucun engagement</span>
          </div>
        </div>
        
        <!-- CTA buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <UButton
            @click="startFreeTrial"
            :loading="isLoading"
            size="lg"
            class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-3 rounded-lg"
          >
            <template v-if="isLoading">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 mr-2 animate-spin" />
              Redirection...
            </template>
            <template v-else>
              <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 mr-2" />
              Commencer l'essai gratuit
            </template>
          </UButton>
          
          <UButton
            href="tel:+33123456789"
            variant="outline"
            size="xl"
            class="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
            Appelez-nous
          </UButton>
        </div>
        
        <p class="text-blue-200 text-sm">
          Aucune carte bancaire requise • Support en français • Données hébergées en Europe
        </p>
      </div>
      
      <!-- Trust indicators -->
      <div class="border-t border-white/20 pt-12">
        <p class="text-blue-200 text-sm mb-8">Ils nous font déjà confiance</p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-1">500+</div>
            <div class="text-blue-200 text-sm">Entreprises</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-1">50k+</div>
            <div class="text-blue-200 text-sm">Avis collectés</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-1">4.8/5</div>
            <div class="text-blue-200 text-sm">Satisfaction</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-1">98%</div>
            <div class="text-blue-200 text-sm">Rétention</div>
          </div>
        </div>
      </div>
      
      <!-- Urgency element -->
      <div class="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div class="flex items-center justify-center mb-4">
          <UIcon name="i-heroicons-clock" class="w-6 h-6 text-yellow-400 mr-2" />
          <span class="font-semibold text-yellow-400">Offre limitée</span>
        </div>
        <p class="text-blue-100 mb-4">
          Les 100 premiers inscrits ce mois-ci bénéficient de <strong>3 mois gratuits</strong> au lieu d'1 mois !
        </p>
        <div class="flex items-center justify-center text-sm text-blue-200">
          <UIcon name="i-heroicons-users" class="w-4 h-4 mr-1" />
          <span>{{ remainingSpots }} places restantes</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Reactive data
const isLoading = ref(false)
const remainingSpots = ref(47) // Simulé pour créer de l'urgence

// Methods
const startFreeTrial = async () => {
  try {
    isLoading.value = true
    
    // Rediriger vers la section pricing pour choisir un plan
    const pricingSection = document.getElementById('pricing-section')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
    
    // Ou rediriger directement vers le plan Pro (le plus populaire)
    // await startCheckout('pro')
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

// Simulate decreasing spots (for urgency)
onMounted(() => {
  const interval = setInterval(() => {
    if (remainingSpots.value > 20) {
      remainingSpots.value -= Math.floor(Math.random() * 2) + 1
    }
  }, 30000) // Decrease every 30 seconds
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
