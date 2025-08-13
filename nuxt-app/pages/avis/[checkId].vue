<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-xl p-12 mx-4">
          <div class="relative">
            <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary-500 mx-auto mb-6" />
            <div class="absolute inset-0 bg-primary-100 rounded-full animate-pulse opacity-30"></div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Préparation de votre avis</h3>
          <p class="text-gray-600">Chargement des informations de l'établissement...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-xl p-12 mx-4 border-l-4 border-red-500">
          <div class="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-heroicons-x-circle" class="w-10 h-10 text-red-500" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Oops ! Quelque chose s'est mal passé</h2>
          <p class="text-gray-600 mb-8 text-lg">{{ error }}</p>
          <UButton to="/" color="primary" size="lg" class="px-8">
            <UIcon name="i-heroicons-home" class="w-5 h-5 mr-2" />
            Retour à l'accueil
          </UButton>
        </div>
      </div>

      <!-- Success State - Show Business Info and Review Form -->
      <div v-else-if="business && canCreateReview">
        <!-- Business Header -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div class="flex items-start space-x-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UIcon name="i-heroicons-building-storefront" class="w-10 h-10 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <UIcon name="i-heroicons-check" class="w-3 h-3 text-white" />
              </div>
            </div>
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ business.name }}</h1>
              <div class="flex items-center text-gray-600 mb-3">
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-2 text-gray-400" />
                <p>{{ business.address }}, {{ business.city }}</p>
              </div>
              <div class="flex items-center">
                <div class="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <UIcon 
                    v-for="i in 5" 
                    :key="i"
                    name="i-heroicons-star-solid" 
                    :class="i <= Math.floor(Number(business.average_rating) || 0) ? 'text-yellow-400' : 'text-gray-300'"
                    class="w-4 h-4"
                  />
                  <span class="ml-2 text-sm font-semibold text-gray-700">
                    {{ business.average_rating?.toFixed(1) || '0.0' }}
                  </span>
                </div>
                <span class="ml-3 text-sm text-gray-500">
                  {{ business.review_count || 0 }} avis
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Form -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div class="text-center mb-8">
            <div class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-8 h-8 text-primary-600" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Partagez votre expérience</h2>
            <p class="text-gray-600">Votre avis aide les autres clients à faire leur choix</p>
          </div>
          
          <UForm :state="reviewForm" @submit="onSubmitReview" class="space-y-6">
            <!-- Rating -->
            <UFormField name="rating" required>
              <template #label>
                <span class="text-lg font-semibold text-gray-900">Quelle note donnez-vous ?</span>
              </template>
              <div class="text-center py-6">
                <div class="flex items-center justify-center space-x-3 mb-4">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    @click="reviewForm.rating = star"
                    @mouseenter="hoverRating = Number(star)"
                    @mouseleave="hoverRating = 0"
                    class="focus:outline-none transform transition-all duration-200 hover:scale-110"
                  >
                    <UIcon
                      name="i-heroicons-star-solid"
                      :class="star <= (hoverRating || reviewForm.rating) ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300'"
                      class="w-12 h-12 transition-all duration-200"
                    />
                  </button>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 min-h-[60px] flex items-center justify-center">
                  <span class="text-lg font-medium" :class="reviewForm.rating > 0 ? 'text-gray-900' : 'text-gray-500'">
                    {{ ratingLabels[hoverRating || reviewForm.rating] || 'Cliquez sur les étoiles pour noter' }}
                  </span>
                </div>
              </div>
            </UFormField>

            <!-- Comment -->
            <UFormField name="content" required>
              <template #label>
                <span class="text-lg font-semibold text-gray-900">Décrivez votre expérience</span>
              </template>
              <div class="relative">
                <UTextarea
                  v-model="reviewForm.content"
                  placeholder="Qu'avez-vous pensé de cet établissement ? Partagez les détails de votre visite..."
                  maxlength="1000"
                  :rows="5"
                  class="resize-none"
                />
                <div class="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm border">
                  <span class="text-xs font-medium" :class="reviewForm.content.length > 900 ? 'text-red-500' : 'text-gray-500'">
                    {{ reviewForm.content.length }}/1000
                  </span>
                </div>
              </div>
              <template #hint>
                <span class="text-sm text-gray-600">
                  💡 Conseil : Mentionnez ce qui vous a plu ou déplu pour aider les futurs clients
                </span>
              </template>
            </UFormField>

            <!-- Submit Button -->
            <div class="pt-6 border-t border-gray-100">
              <div class="flex flex-col sm:flex-row gap-4">
                <UButton
                  type="submit"
                  color="primary"
                  size="lg"
                  :loading="submitting"
                  :disabled="!isFormValid"
                  class="flex-1 justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 mr-2" />
                  {{ submitting ? 'Publication en cours...' : 'Publier mon avis' }}
                </UButton>
                <UButton
                  to="/"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="sm:w-auto justify-center"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-5 h-5 mr-2" />
                  Annuler
                </UButton>
              </div>
              <p class="text-center text-sm text-gray-500 mt-4">
                🔒 Votre avis sera publié de manière sécurisée et anonyme
              </p>
            </div>
          </UForm>
        </div>
      </div>

      <!-- Review Already Exists -->
      <div v-else-if="business && !canCreateReview" class="py-16">
        <div class="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-12 text-center shadow-xl">
          <div class="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-amber-600" />
          </div>
          <h2 class="text-2xl font-bold text-amber-800 mb-3">Avis déjà enregistré !</h2>
          <p class="text-amber-700 mb-2 text-lg">Merci ! Vous avez déjà laissé un avis pour ce scan.</p>
          <p class="text-amber-600 mb-8">Un seul avis par scan est autorisé pour garantir l'authenticité.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton :to="`/business/${business.id}`" color="primary" size="lg" class="px-8">
              <UIcon name="i-heroicons-building-storefront" class="w-5 h-5 mr-2" />
              Voir l'établissement
            </UButton>
            <UButton to="/" color="neutral" variant="outline">
              Retour à l'accueil
            </UButton>
          </div>
        </div>
      </div> <!-- 👈 fermerture manquante ajoutée ici -->


    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

type Business = Database['public']['Tables']['businesses']['Row']

definePageMeta({
  title: 'Laisser un avis'
})

const route = useRoute()
const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const business = ref<Business | null>(null)
const canCreateReview = ref(false)
const submitting = ref(false)

// Review form
const reviewForm = reactive({
  rating: 0,
  content: ''
})

const hoverRating = ref(0)

// Rating labels
const ratingLabels: Record<number, string> = {
  1: 'Très décevant',
  2: 'Décevant',
  3: 'Correct',
  4: 'Très bien',
  5: 'Excellent'
}

// Computed
const isFormValid = computed(() => {
  return reviewForm.rating > 0 && 
         reviewForm.content.trim().length >= 10
})

// Valider le check et récupérer les infos de l'établissement via l'API serveur
const validateCheckAndGetBusiness = async (checkId: string) => {
  try {
    console.log('🔍 Validation check via API:', checkId)
    
    const response = await $fetch('/api/checks/validate', {
      method: 'POST',
      body: {
        checkId
      }
    })

    console.log('📥 Réponse validation check:', response)
    return response
  } catch (error) {
    console.error('❌ Erreur validation check:', error)
    return {
      success: false,
      error: 'Erreur technique lors de la validation'
    }
  }
}

// Créer un avis via l'API serveur
const createReview = async () => {
  try {
    const checkId = route.params.checkId as string

    console.log('📝 Création avis via API pour check:', checkId)
    console.log('📊 Données avis:', {
      rating: reviewForm.rating,
      content: reviewForm.content.trim(),
      businessId: business.value!.id
    })

    const response = await $fetch('/api/reviews/create', {
      method: 'POST',
      body: {
        rating: reviewForm.rating,
        content: reviewForm.content.trim(),
        checkId: checkId,
        businessId: business.value!.id,
        userId: user.value?.id || null // Transmettre l'ID utilisateur si connecté
      }
    })

    console.log('📥 Réponse API création avis:', response)
    return response
  } catch (error) {
    console.error('❌ Erreur création avis:', error)
    return {
      success: false,
      error: 'Erreur technique lors de la création de l\'avis'
    }
  }
}

// Mettre à jour les statistiques de l'établissement
const updateBusinessStats = async (businessId: string) => {
  try {
    const { data: stats } = await supabase
      .from('reviews')
      .select('rating')
      .eq('business_id', businessId)

    if (stats && stats.length > 0) {
      const averageRating = stats.reduce((sum, review) => sum + review.rating, 0) / stats.length
      const reviewCount = stats.length

      await supabase
        .from('businesses')
        .update({
          average_rating: Math.round(averageRating * 10) / 10,
          review_count: reviewCount,
          last_review_at: new Date().toISOString()
        })
        .eq('id', businessId)
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques:', error)
  }
}

// Submit review
const onSubmitReview = async () => {
  if (!business.value) {
    return
  }

  submitting.value = true

  try {
    const result = await createReview()

    if (result.success) {
      // Afficher un toast de succès
      const toast = useToast()
      toast.add({
        title: 'Avis publié avec succès !',
        description: 'Merci pour votre retour, il aidera d\'autres clients.',
        icon: 'i-heroicons-check-circle',
        color: 'success'
      })
      
      // Reset form
      reviewForm.rating = 0
      reviewForm.content = ''
      
      // Redirection automatique vers la page principale après 2 secondes
      setTimeout(() => {
        navigateTo('/', { replace: true })
      }, 2000)
    } else {
      // Afficher un toast d'erreur
      const toast = useToast()
      toast.add({
        title: 'Erreur lors de la création',
        description: result.error || 'Erreur lors de la création de l\'avis',
        icon: 'i-heroicons-x-circle',
        color: 'error'
      })
    }
  } catch (err) {
    console.error('Erreur lors de la création de l\'avis:', err)
    // Afficher un toast d'erreur technique
    const toast = useToast()
    toast.add({
      title: 'Erreur technique',
      description: 'Une erreur technique s\'est produite. Veuillez réessayer.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

// Validation du check au montage
onMounted(async () => {
  const checkId = route.params.checkId as string
  
  if (!checkId) {
    error.value = 'ID de check manquant'
    loading.value = false
    return
  }

  try {
    const result = await validateCheckAndGetBusiness(checkId)
    
    if (result.success && result.business) {
      business.value = result.business as Business
      canCreateReview.value = result.canCreateReview || false
    } else {
      error.value = result.error || 'Erreur lors de la validation du check'
    }
  } catch (err) {
    console.error('Erreur lors de la validation:', err)
    error.value = 'Erreur technique lors de la validation du check'
  } finally {
    loading.value = false
  }
})

// SEO
useSeoMeta({
  title: 'Laisser un avis - Booly',
  description: 'Partagez votre expérience et aidez d\'autres clients'
})
</script>
