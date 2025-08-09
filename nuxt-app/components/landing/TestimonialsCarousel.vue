<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ce que disent nos utilisateurs
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez pourquoi des milliers de personnes font confiance à Booly pour leurs choix locaux
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
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
              <!-- Quote icon -->
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-6 h-6 text-blue-600" />
              </div>
              
              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex">
                  <UIcon 
                    v-for="i in 5" 
                    :key="i" 
                    name="i-heroicons-star-solid" 
                    class="w-5 h-5 text-yellow-400"
                  />
                </div>
                <span class="ml-2 text-sm font-medium text-gray-600">5.0</span>
              </div>
              
              <!-- Testimonial text -->
              <blockquote class="text-gray-700 text-lg leading-relaxed mb-6">
                "{{ testimonial.content }}"
              </blockquote>
              
              <!-- Author info -->
              <div class="flex items-center">
                <img 
                  :src="testimonial.author.avatar" 
                  :alt="testimonial.author.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div class="ml-4">
                  <h4 class="font-semibold text-gray-900">{{ testimonial.author.name }}</h4>
                  <p class="text-sm text-gray-600">{{ testimonial.author.role }}</p>
                </div>
              </div>
              
              <!-- Verified badge -->
              <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" />
                Avis vérifié
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation arrows -->
        <button
          v-if="canScrollLeft"
          @click="scrollLeft"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          v-if="canScrollRight"
          @click="scrollRight"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <!-- Dots indicator -->
      <div class="flex justify-center mt-8 space-x-2">
        <button
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.id"
          @click="scrollToIndex(index)"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentIndex === index ? 'bg-emerald-500' : 'bg-gray-300'"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Mock testimonials data
const testimonials = [
  {
    id: 1,
    content: "Enfin une plateforme où je peux faire confiance aux avis ! Le système de vérification NFC est génial, je sais que les avis sont authentiques.",
    author: {
      name: "Marie Dubois",
      role: "Utilisatrice depuis 6 mois",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
    }
  },
  {
    id: 2,
    content: "J'ai découvert des pépites dans mon quartier grâce à Booly. Les recommandations sont vraiment fiables car elles viennent de vrais clients.",
    author: {
      name: "Thomas Martin",
      role: "Résident parisien",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
    }
  },
  {
    id: 3,
    content: "En tant que commerçant, j'apprécie que seuls mes vrais clients puissent laisser des avis. Cela valorise vraiment mon travail.",
    author: {
      name: "Sophie Leroy",
      role: "Propriétaire de restaurant",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150"
    }
  },
  {
    id: 4,
    content: "L'interface est intuitive et les avis sont détaillés. Je trouve toujours ce que je cherche rapidement.",
    author: {
      name: "Antoine Bernard",
      role: "Utilisateur régulier",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
    }
  },
  {
    id: 5,
    content: "Plus besoin de douter de la véracité des avis ! Booly a révolutionné ma façon de choisir mes services locaux.",
    author: {
      name: "Camille Petit",
      role: "Blogueuse lifestyle",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150"
    }
  }
]

const carousel = ref<HTMLElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const currentIndex = ref(0)

// Carousel navigation
const scrollLeft = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: -416, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 300)
  }
}

const scrollRight = () => {
  if (carousel.value) {
    carousel.value.scrollBy({ left: 416, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 300)
  }
}

const scrollToIndex = (index: number) => {
  if (carousel.value) {
    carousel.value.scrollTo({ left: index * 416, behavior: 'smooth' })
    currentIndex.value = index
    setTimeout(updateScrollButtons, 300)
  }
}

const updateScrollButtons = () => {
  if (carousel.value) {
    canScrollLeft.value = carousel.value.scrollLeft > 0
    canScrollRight.value = 
      carousel.value.scrollLeft < 
      carousel.value.scrollWidth - carousel.value.clientWidth
    
    // Update current index based on scroll position
    currentIndex.value = Math.round(carousel.value.scrollLeft / 416)
  }
}

// Auto-scroll functionality
let autoScrollInterval: NodeJS.Timeout

const startAutoScroll = () => {
  autoScrollInterval = setInterval(() => {
    if (currentIndex.value >= testimonials.length - 1) {
      scrollToIndex(0)
    } else {
      scrollRight()
    }
  }, 5000)
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
  }
}

onMounted(() => {
  updateScrollButtons()
  startAutoScroll()
  
  if (carousel.value) {
    carousel.value.addEventListener('scroll', updateScrollButtons)
    carousel.value.addEventListener('mouseenter', stopAutoScroll)
    carousel.value.addEventListener('mouseleave', startAutoScroll)
  }
})

onUnmounted(() => {
  stopAutoScroll()
  if (carousel.value) {
    carousel.value.removeEventListener('scroll', updateScrollButtons)
    carousel.value.removeEventListener('mouseenter', stopAutoScroll)
    carousel.value.removeEventListener('mouseleave', startAutoScroll)
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
