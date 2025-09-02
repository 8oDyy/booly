<template>
  <div class="flex-1 overflow-hidden">
    <!-- État de chargement -->
    <div v-if="pending" class="flex items-center justify-center h-48">
      <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-primary-500" />
      <span class="ml-2 text-sm text-gray-500">Chargement des scan tags...</span>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="flex flex-col items-center justify-center h-48 text-center">
      <UIcon name="i-lucide-alert-circle" class="size-12 text-red-500 mb-2" />
      <p class="text-sm text-gray-500 mb-4">Erreur lors du chargement des scan tags</p>
      <UButton size="sm" @click="$emit('refresh')">
        Réessayer
      </UButton>
    </div>

    <!-- Liste vide -->
    <div v-else-if="!scanTags.length" class="flex flex-col items-center justify-center h-48 text-center">
      <UIcon name="i-lucide-qr-code" class="size-12 text-gray-400 mb-2" />
      <p class="text-sm text-gray-500">Aucun scan tag trouvé</p>
    </div>

    <!-- Liste des scan tags -->
    <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
      <div
        v-for="scanTag in scanTags"
        :key="scanTag.id"
        class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
        :class="{
          'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500': modelValue?.id === scanTag.id
        }"
        @click="$emit('update:modelValue', scanTag)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <!-- En-tête avec nom et statut -->
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-lucide-qr-code" class="size-4 text-gray-400" />
              <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ scanTag.label || `Tag ${scanTag.code}` }}
              </h3>
              <UBadge 
                :color="scanTag.status === 'active' ? 'success' : 'error'"
                variant="subtle"
                size="xs"
              >
                {{ scanTag.status === 'active' ? 'Actif' : 'Inactif' }}
              </UBadge>
            </div>

            <!-- Informations du business -->
            <div v-if="scanTag.business" class="flex items-center gap-1 mb-2">
              <UIcon name="i-lucide-building" class="size-3 text-gray-400" />
              <span class="text-xs text-gray-500 truncate">
                {{ scanTag.business.name }}
              </span>
            </div>

            <!-- Code et type -->
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-hash" class="size-3" />
                <span class="font-mono">{{ scanTag.code }}</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-tag" class="size-3" />
                <span>{{ scanTag.type }}</span>
              </div>
            </div>

            <!-- Statistiques -->
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-scan" class="size-3" />
                <span>{{ scanTag.total_scans }} scans</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-calendar" class="size-3" />
                <span>{{ formatDate(scanTag.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 ml-2">
            <UButton
              icon="i-lucide-external-link"
              size="xs"
              variant="ghost"
              color="neutral"
              @click.stop="copyUrl(scanTag)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScanTagWithStats } from '~/composables/dashboard/useScanTagsManagement'

interface Props {
  scanTags: ScanTagWithStats[]
  pending: boolean
  error: boolean
  modelValue?: ScanTagWithStats | null
}

interface Emits {
  (e: 'update:modelValue', value: ScanTagWithStats | null): void
  (e: 'refresh'): void
}

defineProps<Props>()
defineEmits<Emits>()

// Formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Copier l'URL du scan tag
const copyUrl = (scanTag: ScanTagWithStats) => {
  const url = `${window.location.origin}/scan/${scanTag.id}`
  navigator.clipboard.writeText(url)
  // TODO: Ajouter un toast de confirmation
  console.log('URL copiée:', url)
}
</script>
