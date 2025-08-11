<template>
  <div class="space-y-6">
    <!-- Filtres -->
    <UCard>
      <div class="flex flex-col sm:flex-row gap-4">
        <USelect
          v-model="selectedBusiness"
          :options="businessOptions"
          placeholder="Tous les établissements"
          class="flex-1"
        />
        <USelect
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="Tous les statuts"
          class="flex-1"
        />
        <USelect
          v-model="selectedRating"
          :options="ratingOptions"
          placeholder="Toutes les notes"
          class="flex-1"
        />
      </div>
    </UCard>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard class="bg-gradient-to-br from-blue-50 to-blue-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600">Total avis</p>
            <p class="text-2xl font-bold text-blue-900">{{ stats.totalReviews }}</p>
          </div>
          <UIcon name="i-heroicons-chat-bubble-left" class="h-8 w-8 text-blue-500" />
        </div>
      </UCard>
      
      <UCard class="bg-gradient-to-br from-green-50 to-green-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">Avec réponse</p>
            <p class="text-2xl font-bold text-green-900">{{ stats.withResponse }}</p>
          </div>
          <UIcon name="i-heroicons-check-circle" class="h-8 w-8 text-green-500" />
        </div>
      </UCard>
      
      <UCard class="bg-gradient-to-br from-red-50 to-red-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-red-600">Sans réponse</p>
            <p class="text-2xl font-bold text-red-900">{{ stats.withoutResponse }}</p>
          </div>
          <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-500" />
        </div>
      </UCard>
      
      <UCard class="bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-yellow-600">Note moyenne</p>
            <p class="text-2xl font-bold text-yellow-900">{{ stats.averageRating.toFixed(1) }}</p>
          </div>
          <UIcon name="i-heroicons-star" class="h-8 w-8 text-yellow-500" />
        </div>
      </UCard>
    </div>

    <!-- Liste des avis -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Avis clients</h3>
          <UBadge color="primary">{{ filteredReviews.length }}</UBadge>
        </div>
      </template>
      
      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary-500" />
      </div>
      
      <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-chat-bubble-left" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun avis</h3>
        <p class="text-gray-500">Aucun avis ne correspond aux filtres sélectionnés.</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="review in filteredReviews" 
          :key="review.id"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <!-- En-tête de l'avis -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <UAvatar
                :src="review.profiles?.avatar_url"
                :alt="review.profiles?.full_name || 'Client'"
                size="sm"
              />
              <div>
                <p class="font-medium text-gray-900">{{ review.profiles?.full_name || 'Client anonyme' }}</p>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    <UIcon 
                      v-for="i in 5" 
                      :key="i"
                      name="i-heroicons-star"
                      :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                      class="h-4 w-4"
                    />
                  </div>
                  <span class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <UBadge 
                :color="review.responses?.length > 0 ? 'success' : 'warning'"
                variant="soft"
              >
                {{ review.responses?.length > 0 ? 'Répondu' : 'Sans réponse' }}
              </UBadge>
              <span class="text-sm text-gray-500">{{ getBusinessName(review.business_id) }}</span>
            </div>
          </div>
          
          <!-- Contenu de l'avis -->
          <div class="mb-4">
            <p class="text-gray-700">{{ review.content }}</p>
          </div>
          
          <!-- Réponse existante -->
          <div v-if="review.responses?.length > 0" class="bg-blue-50 rounded-lg p-3 mb-4">
            <div class="flex items-center space-x-2 mb-2">
              <UIcon name="i-heroicons-building-storefront" class="h-4 w-4 text-blue-500" />
              <span class="text-sm font-medium text-blue-700">Réponse du propriétaire</span>
              <span class="text-xs text-blue-600">{{ formatDate(review.responses[0].created_at) }}</span>
            </div>
            <p class="text-blue-800">{{ review.responses[0].content }}</p>
            <div class="flex justify-end mt-2">
              <UButton 
                color="blue" 
                variant="ghost" 
                size="xs"
                icon="i-heroicons-pencil"
                @click="editResponse(review)"
              >
                Modifier
              </UButton>
            </div>
          </div>
          
          <!-- Formulaire de réponse -->
          <div v-else-if="respondingTo === review.id" class="border-t pt-4">
            <UForm @submit="submitResponse(review)" class="space-y-3">
              <UFormGroup label="Votre réponse" required>
                <UTextarea 
                  v-model="responseForm.content"
                  placeholder="Rédigez votre réponse professionnelle..."
                  :rows="3"
                />
              </UFormGroup>
              <div class="flex justify-end gap-2">
                <UButton 
                  color="neutral" 
                  variant="outline" 
                  size="sm"
                  @click="cancelResponse"
                >
                  Annuler
                </UButton>
                <UButton 
                  type="submit"
                  size="sm"
                  :loading="submittingResponse"
                  icon="i-heroicons-paper-airplane"
                >
                  Envoyer la réponse
                </UButton>
              </div>
            </UForm>
          </div>
          
          <!-- Bouton pour répondre -->
          <div v-else class="flex justify-end">
            <UButton 
              color="primary" 
              variant="outline" 
              size="sm"
              icon="i-heroicons-chat-bubble-left-right"
              @click="startResponse(review.id)"
            >
              Répondre
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Modal d'édition de réponse -->
    <UModal v-model="showEditModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Modifier la réponse</h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="showEditModal = false" />
          </div>
        </template>
        
        <UForm @submit="updateResponse" class="space-y-4">
          <UFormGroup label="Votre réponse" required>
            <UTextarea 
              v-model="editResponseForm.content"
              placeholder="Rédigez votre réponse professionnelle..."
              :rows="4"
            />
          </UFormGroup>
        </UForm>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" @click="showEditModal = false">Annuler</UButton>
            <UButton :loading="updatingResponse" @click="updateResponse">
              Mettre à jour
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

interface Props {
  businesses: any[]
}

interface Emits {
  (e: 'response-sent'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// État réactif
const loading = ref(true)
const reviews = ref([])
const selectedBusiness = ref('')
const selectedStatus = ref('')
const selectedRating = ref('')
const respondingTo = ref(null)
const submittingResponse = ref(false)
const showEditModal = ref(false)
const editingResponse = ref(null)
const updatingResponse = ref(false)

// Formulaires
const responseForm = ref({
  content: ''
})

const editResponseForm = ref({
  content: ''
})

// Options pour les filtres
const businessOptions = computed(() => [
  { label: 'Tous les établissements', value: '' },
  ...props.businesses.map(business => ({
    label: business.name,
    value: business.id
  }))
])

const statusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Avec réponse', value: 'with_response' },
  { label: 'Sans réponse', value: 'without_response' }
]

const ratingOptions = [
  { label: 'Toutes les notes', value: '' },
  { label: '5 étoiles', value: '5' },
  { label: '4 étoiles', value: '4' },
  { label: '3 étoiles', value: '3' },
  { label: '2 étoiles', value: '2' },
  { label: '1 étoile', value: '1' }
]

// Avis filtrés
const filteredReviews = computed(() => {
  let filtered = reviews.value

  if (selectedBusiness.value) {
    filtered = filtered.filter(review => review.business_id === selectedBusiness.value)
  }

  if (selectedStatus.value) {
    if (selectedStatus.value === 'with_response') {
      filtered = filtered.filter(review => review.responses?.length > 0)
    } else if (selectedStatus.value === 'without_response') {
      filtered = filtered.filter(review => !review.responses?.length)
    }
  }

  if (selectedRating.value) {
    filtered = filtered.filter(review => review.rating === parseInt(selectedRating.value))
  }

  return filtered
})

// Statistiques
const stats = computed(() => {
  const total = filteredReviews.value.length
  const withResponse = filteredReviews.value.filter(review => review.responses?.length > 0).length
  const withoutResponse = total - withResponse
  const averageRating = total > 0 
    ? filteredReviews.value.reduce((sum, review) => sum + review.rating, 0) / total 
    : 0

  return {
    totalReviews: total,
    withResponse,
    withoutResponse,
    averageRating
  }
})

// Cycle de vie
onMounted(async () => {
  await loadReviews()
})

// Méthodes
async function loadReviews() {
  if (!user.value || props.businesses.length === 0) return
  
  try {
    loading.value = true
    
    const businessIds = props.businesses.map(b => b.id)
    
    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        ),
        responses (
          id,
          content,
          created_at
        )
      `)
      .in('business_id', businessIds)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    reviews.value = reviewsData || []
  } catch (error) {
    console.error('Erreur lors du chargement des avis:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les avis',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

function startResponse(reviewId: string) {
  respondingTo.value = reviewId
  responseForm.value.content = ''
}

function cancelResponse() {
  respondingTo.value = null
  responseForm.value.content = ''
}

async function submitResponse(review: any) {
  if (!user.value || !responseForm.value.content.trim()) return
  
  try {
    submittingResponse.value = true
    
    const { error } = await supabase
      .from('responses')
      .insert([{
        review_id: review.id,
        business_owner_id: user.value.id,
        content: responseForm.value.content.trim()
      }])
    
    if (error) throw error
    
    toast.add({
      title: 'Réponse envoyée',
      description: 'Votre réponse a été publiée avec succès',
      color: 'green'
    })
    
    cancelResponse()
    await loadReviews()
    emit('response-sent')
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible d\'envoyer la réponse',
      color: 'red'
    })
  } finally {
    submittingResponse.value = false
  }
}

function editResponse(review: any) {
  editingResponse.value = review.responses[0]
  editResponseForm.value.content = review.responses[0].content
  showEditModal.value = true
}

async function updateResponse() {
  if (!editingResponse.value || !editResponseForm.value.content.trim()) return
  
  try {
    updatingResponse.value = true
    
    const { error } = await supabase
      .from('responses')
      .update({
        content: editResponseForm.value.content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', editingResponse.value.id)
    
    if (error) throw error
    
    toast.add({
      title: 'Réponse mise à jour',
      description: 'Votre réponse a été modifiée avec succès',
      color: 'success'
    })
    
    showEditModal.value = false
    editingResponse.value = null
    await loadReviews()
    emit('response-sent')
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réponse:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de mettre à jour la réponse',
      color: 'error'
    })
  } finally {
    updatingResponse.value = false
  }
}

function getBusinessName(businessId: string) {
  const business = props.businesses.find(b => b.id === businessId)
  return business?.name || 'Établissement'
}

function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Actualiser les avis quand les établissements changent
watch(() => props.businesses, async () => {
  if (props.businesses.length > 0) {
    await loadReviews()
  }
}, { immediate: true })
</script>
