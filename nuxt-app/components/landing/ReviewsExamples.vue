<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Avis récents de la communauté
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez les derniers avis vérifiés laissés par nos utilisateurs
        </p>
      </div>
      
      <!-- Reviews grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="review in mockReviews"
          :key="review.id"
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Business info -->
          <div class="flex items-center mb-4">
            <img 
              :src="review.business.image" 
              :alt="review.business.name"
              class="w-12 h-12 rounded-xl object-cover"
            />
            <div class="ml-3 flex-1">
              <h3 class="font-semibold text-gray-900 text-sm">{{ review.business.name }}</h3>
              <p class="text-gray-500 text-xs">{{ review.business.category }}</p>
            </div>
            <div class="text-right">
              <div class="flex items-center">
                <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                <span class="text-sm font-medium text-gray-900 ml-1">{{ review.rating }}</span>
              </div>
            </div>
          </div>
          
          <!-- Review content -->
          <blockquote class="text-gray-700 text-sm leading-relaxed mb-4">
            "{{ review.content }}"
          </blockquote>
          
          <!-- Author and verification -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img 
                :src="review.user.avatar" 
                :alt="review.user.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div class="ml-2">
                <p class="font-medium text-gray-900 text-sm">{{ review.user.name }}</p>
                <p class="text-gray-500 text-xs">{{ formatDate(review.date) }}</p>
              </div>
            </div>
            
            <div class="flex items-center text-xs text-emerald-600 font-medium">
              <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" />
              Vérifié NFC
            </div>
          </div>
        </div>
      </div>
      
      <!-- View all reviews button -->
      <div class="text-center">
        <UButton
          to="/reviews"
          variant="outline"
          size="lg"
          class="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
        >
          Voir tous les avis
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Mock reviews data (as requested by user)
const mockReviews = [
  {
    id: 1,
    user: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150'
    },
    business: {
      name: 'Le Bistrot Parisien',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=150'
    },
    rating: 5,
    date: '2025-01-08',
    content: 'Excellente expérience ! La nourriture était délicieuse et le service impeccable. Je recommande vivement ce restaurant pour un dîner romantique.'
  },
  {
    id: 2,
    user: {
      name: 'Thomas Dubois',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
    },
    business: {
      name: 'Hôtel du Parc',
      category: 'Hôtel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=150'
    },
    rating: 4,
    date: '2025-01-07',
    content: 'Chambre spacieuse et confortable, personnel très attentionné. Seul bémol : le petit-déjeuner pourrait être plus varié.'
  },
  {
    id: 3,
    user: {
      name: 'Julie Moreau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150'
    },
    business: {
      name: 'Boutique Mode & Style',
      category: 'Shopping',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=150'
    },
    rating: 5,
    date: '2025-01-06',
    content: 'Superbe boutique avec des pièces uniques ! J\'ai trouvé exactement ce que je cherchais et le personnel est de très bon conseil.'
  },
  {
    id: 4,
    user: {
      name: 'Antoine Bernard',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150'
    },
    business: {
      name: 'Spa Zen',
      category: 'Beauté',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=150'
    },
    rating: 5,
    date: '2025-01-05',
    content: 'Moment de détente absolue ! Le massage aux pierres chaudes était divin et l\'ambiance très relaxante. Je reviendrai !'
  },
  {
    id: 5,
    user: {
      name: 'Camille Petit',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150'
    },
    business: {
      name: 'Café des Arts',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=150'
    },
    rating: 4,
    date: '2025-01-04',
    content: 'Cadre charmant et pâtisseries délicieuses. Parfait pour travailler ou se retrouver entre amis. Le wifi est rapide !'
  },
  {
    id: 6,
    user: {
      name: 'Lucas Girard',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150'
    },
    business: {
      name: 'Auto Service Plus',
      category: 'Service',
      image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?q=80&w=150'
    },
    rating: 5,
    date: '2025-01-03',
    content: 'Service rapide et efficace. Le garagiste a identifié et réparé le problème en moins d\'une heure. Prix raisonnable.'
  }
]

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}
</script>
