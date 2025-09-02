<script setup lang="ts">
import type { ReviewWithDetails } from '~/composables/dashboard/useReviewsManagement'
import { useReviewsManagement } from '~/composables/dashboard/useReviewsManagement'

interface Props {
  review: ReviewWithDetails
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { respondToReview, updateResponse, deleteResponse, reportReview } = useReviewsManagement()
const toast = useToast()

// États pour la réponse
const isRespondingMode = ref(false)
const isEditingResponse = ref(false)
const responseContent = ref('')
const isSubmitting = ref(false)

// États pour le signalement
const isReportModalOpen = ref(false)
const reportReason = ref('')
const isReporting = ref(false)

// Initialiser le contenu de la réponse si elle existe
watchEffect(() => {
  if (props.review.response) {
    responseContent.value = props.review.response.content
  }
})

// Fonction pour générer les étoiles
const getStarRating = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Activer le mode réponse
const startResponding = () => {
  isRespondingMode.value = true
  responseContent.value = props.review.response?.content || ''
}

// Annuler la réponse
const cancelResponse = () => {
  isRespondingMode.value = false
  isEditingResponse.value = false
  responseContent.value = props.review.response?.content || ''
}

// Soumettre une nouvelle réponse
const submitResponse = async () => {
  if (!responseContent.value.trim()) {
    toast.add({
      title: 'Erreur',
      description: 'Veuillez saisir une réponse',
      color: 'error'
    })
    return
  }

  try {
    isSubmitting.value = true

    if (props.review.response) {
      // Modifier la réponse existante
      await updateResponse(props.review.response.id, responseContent.value.trim())
      toast.add({
        title: 'Réponse modifiée',
        description: 'Votre réponse a été mise à jour avec succès',
        color: 'success'
      })
    } else {
      // Créer une nouvelle réponse
      await respondToReview(props.review.id, responseContent.value.trim())
      toast.add({
        title: 'Réponse envoyée',
        description: 'Votre réponse a été publiée avec succès',
        color: 'success'
      })
    }

    isRespondingMode.value = false
    isEditingResponse.value = false
    emit('updated')
  } catch (error) {
    console.error('Erreur lors de la soumission de la réponse:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de publier la réponse. Veuillez réessayer.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Supprimer la réponse
const removeResponse = async () => {
  if (!props.review.response) return

  try {
    isSubmitting.value = true
    await deleteResponse(props.review.response.id)
    
    toast.add({
      title: 'Réponse supprimée',
      description: 'Votre réponse a été supprimée avec succès',
      color: 'success'
    })

    emit('updated')
  } catch (error) {
    console.error('Erreur lors de la suppression de la réponse:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer la réponse. Veuillez réessayer.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Signaler l'avis
const submitReport = async () => {
  if (!reportReason.value.trim()) {
    toast.add({
      title: 'Erreur',
      description: 'Veuillez préciser la raison du signalement',
      color: 'error'
    })
    return
  }

  try {
    isReporting.value = true
    await reportReview(props.review.id, reportReason.value.trim())
    
    toast.add({
      title: 'Avis signalé',
      description: 'L\'avis a été signalé et sera examiné par notre équipe',
      color: 'success'
    })

    isReportModalOpen.value = false
    reportReason.value = ''
  } catch (error) {
    console.error('Erreur lors du signalement:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de signaler l\'avis. Veuillez réessayer.',
      color: 'error'
    })
  } finally {
    isReporting.value = false
  }
}

// Options pour le signalement
const reportOptions = [
  { label: 'Contenu inapproprié', value: 'inappropriate' },
  { label: 'Spam ou faux avis', value: 'spam' },
  { label: 'Langage offensant', value: 'offensive' },
  { label: 'Hors sujet', value: 'off-topic' },
  { label: 'Autre', value: 'other' }
]
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-900">
    <!-- En-tête -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <h2 class="text-lg font-semibold text-highlighted">Détail de l'avis</h2>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="emit('close')"
      />
    </div>

    <!-- Contenu principal -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- Informations de l'établissement -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <UIcon name="i-lucide-building" class="size-5 text-primary" />
          <h3 class="font-medium text-highlighted">{{ review.business?.name || 'Établissement inconnu' }}</h3>
        </div>
      </div>

      <!-- Note et date -->
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="flex items-center">
            <UIcon
              v-for="(filled, index) in getStarRating(review.rating)"
              :key="index"
              name="i-lucide-star"
              :class="filled ? 'text-yellow-400 fill-current' : 'text-gray-300'"
              class="size-5"
            />
          </div>
          <span class="text-lg font-medium text-highlighted">{{ review.rating }}/5</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-clock" class="size-4" />
          <span>{{ formatDate(review.created_at || '') }}</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-user" class="size-4" />
          <span>Client {{ review.user_id.substring(0, 8) }}...</span>
        </div>
      </div>

      <!-- Contenu de l'avis -->
      <div class="space-y-2">
        <h4 class="font-medium text-highlighted">Commentaire du client</h4>
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <p v-if="review.content" class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ review.content }}
          </p>
          <p v-else class="text-muted italic">
            Aucun commentaire laissé par le client
          </p>
        </div>
      </div>

      <!-- Réponse existante ou formulaire de réponse -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-medium text-highlighted">Votre réponse</h4>
          <div class="flex items-center gap-2">
            <UBadge
              v-if="review.hasResponse"
              color="success"
              variant="subtle"
              size="xs"
            >
              Répondu
            </UBadge>
            <UBadge
              v-else
              color="warning"
              variant="subtle"
              size="xs"
            >
              Sans réponse
            </UBadge>
          </div>
        </div>

        <!-- Réponse existante (mode lecture) -->
        <div v-if="review.response && !isRespondingMode" class="space-y-3">
          <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border-l-4 border-primary">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ review.response.content }}
            </p>
            <div class="flex items-center gap-2 text-xs text-muted mt-2">
              <UIcon name="i-lucide-clock" class="size-3" />
              <span>{{ formatDate(review.response.updated_at || review.response.created_at) }}</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <UButton
              variant="outline"
              size="sm"
              @click="startResponding"
            >
              Modifier
            </UButton>
            <UButton
              variant="outline"
              color="error"
              size="sm"
              @click="removeResponse"
              :loading="isSubmitting"
            >
              Supprimer
            </UButton>
          </div>
        </div>

        <!-- Formulaire de réponse -->
        <div v-else-if="isRespondingMode || !review.response" class="space-y-3">
          <UTextarea
            v-model="responseContent"
            placeholder="Rédigez votre réponse au client..."
            :rows="4"
            :disabled="isSubmitting"
          />
          
          <div class="flex gap-2">
            <UButton
              @click="submitResponse"
              :loading="isSubmitting"
              :disabled="!responseContent.trim()"
            >
              {{ review.response ? 'Modifier la réponse' : 'Publier la réponse' }}
            </UButton>
            <UButton
              variant="outline"
              @click="cancelResponse"
              :disabled="isSubmitting"
            >
              Annuler
            </UButton>
          </div>
        </div>

        <!-- Pas de réponse (mode lecture) -->
        <div v-else class="space-y-3">
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
            <p class="text-muted italic mb-3">Aucune réponse publiée</p>
            <UButton
              @click="startResponding"
              size="sm"
            >
              Répondre à cet avis
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions en bas -->
    <div class="border-t border-gray-200 dark:border-gray-800 p-4">
      <div class="flex justify-between">
        <UModal v-model="isReportModalOpen">
          <UButton
            variant="outline"
            color="error"
            size="sm"
            @click="isReportModalOpen = true"
          >
            <UIcon name="i-lucide-flag" class="size-4 mr-2" />
            Signaler
          </UButton>
          <template #content>
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Signaler cet avis</h3>
              </template>

              <div class="space-y-4">
                <p class="text-sm text-muted">
                  Pourquoi souhaitez-vous signaler cet avis ? Cette action nous aidera à maintenir la qualité de la plateforme.
                </p>

                <USelect
                  v-model="reportReason"
                  :options="reportOptions"
                  placeholder="Sélectionnez une raison"
                />

                <UTextarea
                  v-if="reportReason === 'other'"
                  v-model="reportReason"
                  placeholder="Précisez la raison du signalement..."
                  :rows="3"
                />
              </div>

              <template #footer>
                <div class="flex justify-end gap-2">
                  <UButton
                  variant="outline"
                  @click="isReportModalOpen = false"
                  :disabled="isReporting"
                >
                  Annuler
                </UButton>
                <UButton
                  color="error"
                  @click="submitReport"
                  :loading="isReporting"
                  :disabled="!reportReason"
                >
                  Signaler
                </UButton>
              </div>
            </template>
          </UCard>
          </template>
        </UModal>
      </div>
    </div>   
  </div>
</template>
