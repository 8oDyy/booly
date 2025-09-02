<script setup lang="ts">

definePageMeta({
  layout: 'dashboard'
})

import { computed, ref, watch, onMounted } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useReviewsManagement, type ReviewWithDetails } from '~/composables/dashboard/useReviewsManagement'
import ReviewsList from '~/components/reviews/ReviewsList.vue'
import ReviewDetail from '~/components/reviews/ReviewDetail.vue'

const tabItems = [{
  label: 'Tous',
  value: 'all'
}, {
  label: 'Sans réponse',
  value: 'no-response'
}, {
  label: 'Avec réponse',
  value: 'with-response'
}]

const selectedTab = ref('all')

const { 
  getAllReviews, 
  respondToReview, 
  updateResponse, 
  deleteResponse, 
  reportReview, 
  getReviewsStats 
} = useReviewsManagement()

console.log('📄 Page inbox - Composable chargé')

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

const selectedReview = ref<ReviewWithDetails | null>(null)
const reviews = ref<ReviewWithDetails[]>([])
const pending = ref(false)
const error = ref(false)

console.log('📄 Page inbox - Variables initialisées')

// États de chargement
const stats = ref({
  total: 0,
  withResponse: 0,
  withoutResponse: 0,
  averageRating: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
})

// Charger les avis
const loadReviews = async () => {
  try {
    pending.value = true
    error.value = false
    
    const [reviewsData, statsData] = await Promise.all([
      getAllReviews(),
      getReviewsStats()
    ])
    
    reviews.value = reviewsData
    stats.value = statsData
  } catch (err) {
    console.error('Erreur lors du chargement des avis:', err)
    error.value = true
  } finally {
    pending.value = false
  }
}

// Charger les données au montage
onMounted(loadReviews)

// Filtrer les avis selon l'onglet sélectionné
const filteredReviews = computed(() => {
  if (selectedTab.value === 'no-response') {
    return reviews.value.filter(review => !review.hasResponse)
  }
  if (selectedTab.value === 'with-response') {
    return reviews.value.filter(review => review.hasResponse)
  }
  return reviews.value
})

const isReviewPanelOpen = computed({
  get() {
    return !!selectedReview.value
  },
  set(value: boolean) {
    if (!value) {
      selectedReview.value = null
    }
  }
})

// Reset selected review if it's not in the filtered reviews
watch(filteredReviews, () => {
  if (!filteredReviews.value.find(review => review.id === selectedReview.value?.id)) {
    selectedReview.value = null
  }
})
</script>

<template>
  <UDashboardPanel
    id="reviews-1"
    :default-size="30"
    :min-size="25"
    :max-size="40"
    resizable
  >
    <UDashboardNavbar title="Avis Clients">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge :label="filteredReviews.length" variant="subtle" />
      </template>

      <template #right>
        <UTabs
          v-model="selectedTab"
          :items="tabItems"
          :content="false"
          size="xs"
        />
      </template>
    </UDashboardNavbar>
    
    <!-- Liste des avis -->
    <ReviewsList 
      v-model="selectedReview" 
      :reviews="filteredReviews" 
      :pending="pending"
      :error="error"
      @refresh="loadReviews"
    />
  </UDashboardPanel>

  <!-- Détail de l'avis sélectionné -->
  <ReviewDetail 
    v-if="selectedReview" 
    :review="selectedReview" 
    @close="selectedReview = null"
    @updated="loadReviews"
  />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-message-circle" class="size-32 text-dimmed" />
  </div>

  <!-- Version mobile -->
  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isReviewPanelOpen">
      <template #content>
        <ReviewDetail 
          v-if="selectedReview" 
          :review="selectedReview" 
          @close="selectedReview = null"
          @updated="loadReviews"
        />
      </template>
    </USlideover>
  </ClientOnly>
</template>
