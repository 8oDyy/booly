<script setup lang="ts">
import type { Period, Range } from '~/types/index'
import { useDashboardStats } from '~/composables/dashboard/useDashboardStats'

const props = defineProps<{
  period: Period
  range: Range
}>()

interface DashboardStat {
  title: string
  icon: string
  value: string | number
  loading?: boolean
  error?: boolean
}

const { getStats } = useDashboardStats()
const pending = ref(true)
const error = ref(false)
const statsData = ref({
  averageRating: 0,
  totalScans: 0,
  totalReviews: 0,
  websiteVisits: 0
})

// Charger les statistiques
const loadStats = async () => {
  try {
    pending.value = true
    error.value = false
    const data = await getStats()
    statsData.value = data
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques:', err)
    error.value = true
  } finally {
    pending.value = false
  }
}

// Charger les stats au montage et quand les props changent
onMounted(loadStats)
watch([() => props.period, () => props.range], loadStats)

const stats = computed<DashboardStat[]>(() => [
  {
    title: 'Note Moyenne',
    icon: 'i-lucide-star',
    value: pending.value ? '...' : error.value ? 'Erreur' : `${statsData.value.averageRating}/5`,
    loading: pending.value,
    error: error.value,
  },
  {
    title: 'Scans Total',
    icon: 'i-lucide-qr-code',
    value: pending.value ? '...' : error.value ? 'Erreur' : statsData.value.totalScans,
    loading: pending.value,
    error: error.value
  },
  {
    title: 'Avis Reçus',
    icon: 'i-lucide-message-circle',
    value: pending.value ? '...' : error.value ? 'Erreur' : statsData.value.totalReviews,
    loading: pending.value,
    error: error.value
  },
  {
    title: 'Visites Site',
    icon: 'i-lucide-globe',
    value: pending.value ? '...' : error.value ? 'Erreur' : statsData.value.websiteVisits || 'Bientôt',
    loading: pending.value,
    error: error.value
  }
])
</script>

<style scoped>
:deep(.u-page-card [data-slot="leading"] svg) {
  color: rgb(59 130 246) !important;
}
</style>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      to="/dashboard/customers"
      variant="subtle"
      color="blue"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-blue-500/10 ring ring-inset ring-blue-500/25 flex-col [&>*]:text-blue-500',
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>

        <UBadge
          v-if="stat.loading"
          color="neutral"
          variant="subtle"
          class="text-xs"        >
          Chargement...
        </UBadge>
        
        <UBadge
          v-else-if="stat.error"
          color="error"
          variant="subtle"
          class="text-xs"
        >
          Erreur
        </UBadge>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
