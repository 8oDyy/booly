<script setup lang="ts">
import type { Period, Range } from '~/types/index'
import { useDashboardStats } from '~/composables/dashboard/useDashboardStats'

const cardRef = useTemplateRef<HTMLElement | null>('cardRef')

const props = defineProps<{
  period: Period
  range: Range
}>()

const { getRatingEvolution } = useDashboardStats()

// Pour l'instant, on affiche un placeholder
// TODO: Implémenter le vrai graphique d'évolution des notes
const pending = ref(false)
const error = ref(false)
const averageRating = ref(0)

// Fonction pour charger les données d'évolution (placeholder pour l'instant)
const loadRatingEvolution = async () => {
  try {
    pending.value = true
    error.value = false
    
    // Pour l'instant, on simule une note moyenne
    // TODO: Calculer la vraie évolution des notes
    const reviews = await getRatingEvolution(30)
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      averageRating.value = Math.round((totalRating / reviews.length) * 10) / 10
    } else {
      averageRating.value = 0
    }
  } catch (err) {
    console.error('Erreur lors du chargement de l\'évolution des notes:', err)
    error.value = true
  } finally {
    pending.value = false
  }
}

// Charger les données au montage et quand les props changent
onMounted(loadRatingEvolution)
watch([() => props.period, () => props.range], loadRatingEvolution)
</script>

<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          Évolution des Notes
        </p>
        <p class="text-3xl text-highlighted font-semibold">
          <span v-if="pending">...</span>
          <span v-else-if="error">Erreur</span>
          <span v-else>{{ averageRating }}/5</span>
        </p>
      </div>
    </template>

    <div class="h-96 flex items-center justify-center">
      <!-- État de chargement -->
      <div v-if="pending" class="flex flex-col items-center">
        <UIcon name="i-lucide-loader-2" class="animate-spin size-8 text-primary mb-2" />
        <span class="text-sm text-muted">Chargement...</span>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error" class="flex flex-col items-center">
        <UIcon name="i-lucide-alert-circle" class="size-8 text-error mb-2" />
        <span class="text-sm text-error">Erreur de chargement</span>
      </div>

      <!-- Placeholder pour le graphique -->
      <div v-else class="flex flex-col items-center text-center">
        <UIcon name="i-lucide-trending-up" class="size-12 text-muted mb-4" />
        <h3 class="text-lg font-medium text-highlighted mb-2">Graphique d'évolution</h3>
        <p class="text-sm text-muted max-w-md">
          Le graphique d'évolution des notes dans le temps sera bientôt disponible.
          Pour l'instant, vous pouvez voir la note moyenne actuelle ci-dessus.
        </p>
        <UBadge 
          v-if="averageRating > 0" 
          :color="averageRating >= 4 ? 'secondary' : averageRating >= 3 ? 'warning' : 'error'"
          variant="subtle"
          class="mt-3"
        >
          Note moyenne: {{ averageRating }}/5
        </UBadge>
      </div>
    </div>
  </UCard>
</template>


