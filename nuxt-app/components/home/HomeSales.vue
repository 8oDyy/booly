<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Period, Range } from '~/types/index'
import { useDashboardStats, type RecentReview } from '~/composables/dashboard/useDashboardStats'

const props = defineProps<{
  period: Period
  range: Range
}>()

const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const { getRecentReviews } = useDashboardStats()

const { data, pending, error, refresh } = await useAsyncData('recent-reviews', async () => {
  try {
    return await getRecentReviews(10)
  } catch (err) {
    console.error('Erreur lors du chargement des avis récents:', err)
    return []
  }
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})

// Fonction pour générer les étoiles
const renderStars = (rating: number) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      h(UIcon, {
        name: i <= rating ? 'i-lucide-star' : 'i-lucide-star',
        class: i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      })
    )
  }
  return h('div', { class: 'flex items-center gap-0.5' }, stars)
}

const columns: TableColumn<RecentReview>[] = [
  {
    accessorKey: 'business_name',
    header: 'Établissement',
    cell: ({ row }) => row.getValue('business_name') || 'Non spécifié'
  },
  {
    accessorKey: 'rating',
    header: 'Note',
    cell: ({ row }) => renderStars(row.getValue('rating'))
  },
  {
    accessorKey: 'content',
    header: 'Commentaire',
    cell: ({ row }) => {
      const content = row.getValue('content') as string | null
      if (!content) return h('span', { class: 'text-gray-400 italic' }, 'Aucun commentaire')
      
      const truncated = content.length > 50 ? content.substring(0, 50) + '...' : content
      return h('span', { class: 'text-sm' }, truncated)
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  {
    accessorKey: 'user_id',
    header: 'Client',
    cell: ({ row }) => {
      const userId = row.getValue('user_id') as string
      return h('span', { class: 'text-xs text-gray-500' }, `Client ${userId.substring(0, 8)}...`)
    }
  }
]
</script>

<template>
  <div>
    <!-- État de chargement -->
    <div v-if="pending" class="flex items-center justify-center py-8">
      <UIcon name="i-lucide-loader-2" class="animate-spin size-6 text-primary" />
      <span class="ml-2 text-sm text-muted">Chargement des avis récents...</span>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="flex items-center justify-center py-8">
      <UIcon name="i-lucide-alert-circle" class="size-6 text-error" />
      <span class="ml-2 text-sm text-error">Erreur lors du chargement des avis</span>
      <UButton 
        variant="ghost" 
        size="sm" 
        @click="refresh()"
        class="ml-2"
      >
        Réessayer
      </UButton>
    </div>

    <!-- Aucun avis -->
    <div v-else-if="!data || data.length === 0" class="flex flex-col items-center justify-center py-8">
      <UIcon name="i-lucide-message-circle" class="size-12 text-muted mb-2" />
      <span class="text-sm text-muted">Aucun avis récent</span>
      <span class="text-xs text-muted mt-1">Les avis apparaîtront ici une fois que vos clients auront scanné vos QR codes</span>
    </div>

    <!-- Tableau des avis -->
    <UTable
      v-else
      :data="data"
      :columns="columns"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default'
      }"
    />
  </div>
</template>
