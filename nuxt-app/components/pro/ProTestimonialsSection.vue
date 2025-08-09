<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ils ont choisi Booly Pro
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez comment nos clients ont transformé leur activité grâce aux avis authentiques
        </p>
      </div>
      
      <!-- Testimonials carousel -->
      <div class="relative">
        <div 
          ref="carousel"
          class="flex gap-8 overflow-x-auto scrollbar-hide pb-4"
          style="scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="flex-shrink-0 w-96"
          >
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full">
              <!-- Quote icon -->
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-5 h-5 text-blue-600" />
              </div>
              
              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex space-x-1 mr-3">
                  <UIcon 
                    v-for="i in testimonial.rating" 
                    :key="i" 
                    name="i-heroicons-star-solid" 
                    class="w-4 h-4 text-yellow-500" 
                  />
                </div>
                <span class="text-sm text-gray-600">{{ testimonial.rating }}/5</span>
              </div>
              
              <!-- Content -->
              <blockquote class="text-gray-700 leading-relaxed mb-6 text-lg">
                "{{ testimonial.content }}"
              </blockquote>
              
              <!-- Author -->
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4">
                  <span class="text-blue-600 font-bold text-lg">{{ testimonial.initials }}</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ testimonial.author }}</div>
                  <div class="text-sm text-gray-600">{{ testimonial.business }}</div>
                  <div class="text-xs text-gray-500">{{ testimonial.location }}</div>
                </div>
              </div>
              
              <!-- Results -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ testimonial.results.increase }}</div>
                    <div class="text-xs text-gray-600">Nouveaux clients</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">{{ testimonial.results.rating }}</div>
                    <div class="text-xs text-gray-600">Note moyenne</div>
                  </div>
                </div>
              </div>
              
              <!-- Verified badge -->
              <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" />
                Client vérifié Booly Pro
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation arrows -->
        <button
          v-if="canScrollLeft"
          @click="scrollLeft"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-blue-600 hover:text-blue-700"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-blue-600" />
        </button>
        
        <button
          v-if="canScrollRight"
          @click="scrollRight"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-blue-600 hover:text-blue-700"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-blue-600" />
        </button>
      </div>
      
      <!-- Bottom stats -->
      <div class="mt-16 grid md:grid-cols-4 gap-8 text-center">
        <div class="bg-gray-50 rounded-2xl p-6">
          <div class="text-3xl font-bold text-blue-600 mb-2">500+</div>
          <div class="text-gray-600">Entreprises clientes</div>
        </div>
        <div class="bg-gray-50 rounded-2xl p-6">
          <div class="text-3xl font-bold text-green-600 mb-2">50k+</div>
          <div class="text-gray-600">Avis collectés</div>
        </div>
        <div class="bg-gray-50 rounded-2xl p-6">
          <div class="text-3xl font-bold text-purple-600 mb-2">4.7</div>
          <div class="text-gray-600">Satisfaction client</div>
        </div>
        <div class="bg-gray-50 rounded-2xl p-6">
          <div class="text-3xl font-bold text-orange-600 mb-2">98%</div>
          <div class="text-gray-600">Taux de rétention</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Reactive data
const carousel = ref<HTMLElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

// Testimonials data
const testimonials = [
  {
    id: 1,
    content: "Booly Pro a révolutionné notre approche des avis clients. En 6 mois, nous avons doublé notre clientèle grâce à la confiance que nous inspirons maintenant.",
    author: "Marie Dubois",
    business: "Restaurant Le Gourmet",
    location: "Lyon",
    initials: "MD",
    rating: 5,
    results: {
      increase: "+120%",
      rating: "4.8"
    }
  },
  {
    id: 2,
    content: "L'authenticité des avis nous a permis de nous démarquer de la concurrence. Nos clients apprécient la transparence et nous le font savoir !",
    author: "Pierre Martin",
    business: "Garage Auto Plus",
    location: "Marseille",
    initials: "PM",
    rating: 5,
    results: {
      increase: "+85%",
      rating: "4.6"
    }
  },
  {
    id: 3,
    content: "Le tableau de bord nous donne des insights précieux sur nos clients. Nous avons pu améliorer notre service et augmenter notre CA de 40%.",
    author: "Sophie Leroy",
    business: "Salon Beauté & Bien-être",
    location: "Paris",
    initials: "SL",
    rating: 5,
    results: {
      increase: "+65%",
      rating: "4.9"
    }
  },
  {
    id: 4,
    content: "Installation ultra-simple et support réactif. En quelques semaines, nous avions déjà des dizaines d'avis authentiques qui nous ont apporté de nouveaux clients.",
    author: "Thomas Petit",
    business: "Boulangerie Artisanale",
    location: "Toulouse",
    initials: "TP",
    rating: 5,
    results: {
      increase: "+95%",
      rating: "4.7"
    }
  },
  {
    id: 5,
    content: "Booly Pro nous a aidés à construire une réputation solide en ligne. Nos avis vérifiés nous donnent un avantage énorme sur nos concurrents.",
    author: "Isabelle Moreau",
    business: "Pharmacie du Centre",
    location: "Nantes",
    initials: "IM",
    rating: 5,
    results: {
      increase: "+55%",
      rating: "4.8"
    }
  }
]

// Methods
const scrollLeft = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: -400, behavior: 'smooth' })
    updateScrollButtons()
  }
}

const scrollRight = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: 400, behavior: 'smooth' })
    updateScrollButtons()
  }
}

const updateScrollButtons = () => {
  if (carousel.value) {
    canScrollLeft.value = carousel.value.scrollLeft > 0
    canScrollRight.value = carousel.value.scrollLeft < carousel.value.scrollWidth - carousel.value.clientWidth
  }
}

// Lifecycle
onMounted(() => {
  if (carousel.value) {
    carousel.value.addEventListener('scroll', updateScrollButtons)
    updateScrollButtons()
  }
})

onUnmounted(() => {
  if (carousel.value) {
    carousel.value.removeEventListener('scroll', updateScrollButtons)
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
