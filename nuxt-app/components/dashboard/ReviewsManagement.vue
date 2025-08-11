<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des avis</h1>
      <div class="flex items-center space-x-2">
        <USelect 
          v-model="selectedFilter" 
          :options="filterOptions"
          placeholder="Filtrer par note"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="!reviews.length" class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <p class="text-gray-500 mb-2">Aucun avis pour le moment</p>
      <p class="text-sm text-gray-400">Les avis de vos clients apparaîtront ici</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="review in filteredReviews" 
        :key="review.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-medium text-sm">
                  {{ review.user_name?.charAt(0).toUpperCase() || 'A' }}
                </span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ review.user_name || 'Utilisateur anonyme' }}</h3>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    <svg 
                      v-for="i in 5" 
                      :key="i"
                      :class="[
                        'w-4 h-4',
                        i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      ]" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</span>
                </div>
              </div>
            </div>
            
            <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
            
            <div v-if="review.response" class="mt-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span class="text-sm font-medium text-gray-900">Votre réponse</span>
              </div>
              <p class="text-sm text-gray-700">{{ review.response }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            <UButton 
              v-if="!review.response" 
              size="sm" 
              variant="outline"
              @click="openResponseModal(review)"
            >
              Répondre
            </UButton>
            <UDropdown :items="getDropdownItems(review)">
              <UButton variant="ghost" size="sm" square>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </UButton>
            </UDropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de réponse -->
    <UModal v-model="isResponseModalOpen">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Répondre à l'avis</h3>
        <div v-if="selectedReview" class="mb-4 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2 mb-2">
            <span class="font-medium">{{ selectedReview.user_name }}</span>
            <div class="flex items-center">
              <svg 
                v-for="i in selectedReview.rating" 
                :key="i"
                class="w-4 h-4 text-yellow-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-700">{{ selectedReview.comment }}</p>
        </div>
        
        <UTextarea 
          v-model="responseText" 
          placeholder="Rédigez votre réponse..."
          :rows="4"
          class="mb-4"
        />
        
        <div class="flex justify-end space-x-3">
          <UButton variant="outline" @click="closeResponseModal">Annuler</UButton>
          <UButton @click="submitResponse" :loading="isSubmittingResponse">Publier la réponse</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// État local
const isLoading = ref(true)
const reviews = ref<any[]>([])
const selectedFilter = ref('all')
const isResponseModalOpen = ref(false)
const selectedReview = ref<any>(null)
const responseText = ref('')
const isSubmittingResponse = ref(false)

const filterOptions = [
  { label: 'Tous les avis', value: 'all' },
  { label: '5 étoiles', value: '5' },
  { label: '4 étoiles', value: '4' },
  { label: '3 étoiles', value: '3' },
  { label: '2 étoiles', value: '2' },
  { label: '1 étoile', value: '1' }
]

const filteredReviews = computed(() => {
  if (selectedFilter.value === 'all') {
    return reviews.value
  }
  return reviews.value.filter(review => review.rating === parseInt(selectedFilter.value))
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDropdownItems = (review: any) => [
  [{
    label: 'Signaler',
    icon: 'i-heroicons-flag',
    click: () => reportReview(review)
  }]
]

const loadReviews = async () => {
  isLoading.value = true
  try {
    // TODO: Charger les avis depuis Supabase
    // Données mockées pour l'instant
    reviews.value = [
      {
        id: 1,
        user_name: 'Marie Dupont',
        rating: 5,
        comment: 'Excellent service ! Personnel très accueillant et produits de qualité. Je recommande vivement.',
        created_at: '2024-01-15T10:30:00Z',
        response: null
      },
      {
        id: 2,
        user_name: 'Jean Martin',
        rating: 4,
        comment: 'Très bon établissement, ambiance agréable. Petit bémol sur l\'attente mais ça vaut le coup.',
        created_at: '2024-01-10T14:20:00Z',
        response: 'Merci Jean pour votre retour ! Nous travaillons à améliorer nos temps d\'attente.'
      },
      {
        id: 3,
        user_name: 'Sophie Bernard',
        rating: 3,
        comment: 'Correct sans plus. Le service pourrait être amélioré.',
        created_at: '2024-01-08T16:45:00Z',
        response: null
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des avis:', error)
  } finally {
    isLoading.value = false
  }
}

const openResponseModal = (review: any) => {
  selectedReview.value = review
  responseText.value = ''
  isResponseModalOpen.value = true
}

const closeResponseModal = () => {
  isResponseModalOpen.value = false
  selectedReview.value = null
  responseText.value = ''
}

const submitResponse = async () => {
  if (!responseText.value.trim()) return
  
  isSubmittingResponse.value = true
  try {
    // TODO: Envoyer la réponse via Supabase
    console.log('Réponse soumise:', {
      reviewId: selectedReview.value.id,
      response: responseText.value
    })
    
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mettre à jour localement
    const reviewIndex = reviews.value.findIndex(r => r.id === selectedReview.value.id)
    if (reviewIndex !== -1) {
      reviews.value[reviewIndex].response = responseText.value
    }
    
    closeResponseModal()
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error)
  } finally {
    isSubmittingResponse.value = false
  }
}

const reportReview = (review: any) => {
  // TODO: Implémenter le signalement
  console.log('Signaler l\'avis:', review.id)
}

onMounted(() => {
  loadReviews()
})
</script>
