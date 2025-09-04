<script setup lang="ts">
import type { ReviewWithDetails } from '~/composables/dashboard/useReviewsManagement'

interface Props {
  reviews: ReviewWithDetails[]
  pending: boolean
  error: boolean
  modelValue?: ReviewWithDetails | null
}

interface Emits {
  (e: 'update:modelValue', value: ReviewWithDetails | null): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedReview = computed({
  get: () => props.modelValue || null,
  set: (value) => emit('update:modelValue', value)
})

// Fonction pour générer les étoiles
const getStarRating = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonction pour tronquer le texte
const truncateText = (text: string | null, maxLength: number = 100) => {
  if (!text) return 'Aucun commentaire'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- État de chargement -->
    <div v-if="pending" class="flex-1 flex items-center justify-center p-8">
      <div class="flex flex-col items-center">
        <UIcon name="i-lucide-loader-2" class="animate-spin size-8 text-primary mb-2" />
        <span class="text-sm text-muted">Chargement des avis...</span>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center p-8">
      <div class="flex flex-col items-center text-center">
        <UIcon name="i-lucide-alert-circle" class="size-8 text-error mb-2" />
        <span class="text-sm text-error mb-3">Erreur lors du chargement</span>
        <UButton 
          variant="outline" 
          size="sm" 
          @click="emit('refresh')"
        >
          Réessayer
        </UButton>
      </div>
    </div>

    <!-- Aucun avis -->
    <div v-else-if="reviews.length === 0" class="flex-1 flex items-center justify-center p-8">
      <div class="flex flex-col items-center text-center">
        <UIcon name="i-lucide-message-circle" class="size-12 text-muted mb-4" />
        <h3 class="text-lg font-medium text-highlighted mb-2">Aucun avis</h3>
        <p class="text-sm text-muted max-w-sm">
          Les avis de vos clients apparaîtront ici une fois qu'ils auront scanné vos QR codes et laissé leurs commentaires.
        </p>
      </div>
    </div>

    <!-- Liste des avis -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors"
          :class="{
            'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500': selectedReview?.id === review.id
          }"
          @click="selectedReview = review"
        >
          <!-- En-tête de l'avis -->
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <!-- Établissement -->
              <div class="flex items-center gap-2 mb-1">
                <UIcon name="i-lucide-building" class="size-4 text-muted flex-shrink-0" />
                <span class="text-sm font-medium text-highlighted truncate">
                  {{ review.business?.name || 'Établissement inconnu' }}
                </span>
              </div>
              
              <!-- Note avec étoiles -->
              <div class="flex items-center gap-1 mb-2">
                <div class="flex items-center">
                  <UIcon
                    v-for="(filled, index) in getStarRating(review.rating)"
                    :key="index"
                    name="i-lucide-star"
                    :class="filled ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                    class="size-4"
                  />
                </div>
                <span class="text-sm text-muted ml-1">{{ review.rating }}/5</span>
              </div>
            </div>

            <!-- Badges de statut -->
            <div class="flex flex-col items-end gap-1">
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

          <!-- Contenu de l'avis -->
          <div class="mb-3">
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ truncateText(review.content, 120) }}
            </p>
          </div>

          <!-- Pied de l'avis -->
          <div class="flex items-center justify-between text-xs text-muted">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-user" class="size-3" />
              <span>Client {{ review.user_id.substring(0, 8) }}...</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-clock" class="size-3" />
              <span>{{ formatDate(review.created_at || '') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
