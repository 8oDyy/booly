<script setup lang="ts">
import type { CheckWithDetails } from '~/composables/dashboard/useChecksManagement'

interface Props {
  checks: CheckWithDetails[]
  pending: boolean
  error: boolean
  modelValue?: CheckWithDetails | null
}

interface Emits {
  (e: 'update:modelValue', value: CheckWithDetails | null): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedCheck = computed({
  get: () => props.modelValue || null,
  set: (value) => emit('update:modelValue', value)
})

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

// Fonction pour obtenir l'icône du type de tag
const getTagTypeIcon = (type: 'QR' | 'NFC') => {
  return type === 'QR' ? 'i-lucide-qr-code' : 'i-lucide-nfc'
}

// Fonction pour obtenir la couleur du statut
const getStatusColor = (isExpired: boolean) => {
  return isExpired ? 'error' : 'success'
}

// Fonction pour obtenir le texte du statut
const getStatusText = (isExpired: boolean) => {
  return isExpired ? 'Expiré' : 'Actif'
}
</script>

<template>
  <div class="flex-1 overflow-hidden">
    <!-- État de chargement -->
    <div v-if="pending" class="p-4">
      <div class="space-y-3">
        <USkeleton class="h-16 w-full" v-for="i in 5" :key="i" />
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="p-4 text-center">
      <UIcon name="i-lucide-alert-circle" class="size-8 text-red-500 mx-auto mb-2" />
      <p class="text-red-600 dark:text-red-400 mb-4">
        Erreur lors du chargement des checks
      </p>
      <UButton @click="emit('refresh')" variant="outline" size="sm">
        Réessayer
      </UButton>
    </div>

    <!-- Liste vide -->
    <div v-else-if="checks.length === 0" class="p-8 text-center">
      <UIcon name="i-lucide-qr-code" class="size-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">
        Aucun check trouvé
      </p>
    </div>

    <!-- Liste des checks -->
    <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
      <div
        v-for="check in checks"
        :key="check.id"
        class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
        :class="{
          'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500': selectedCheck?.id === check.id
        }"
        @click="selectedCheck = check"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <!-- En-tête avec type et statut -->
            <div class="flex items-center gap-2 mb-2">
              <UIcon 
                :name="getTagTypeIcon(check.scan_tag.type)" 
                class="size-4 text-gray-500"
              />
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ check.scan_tag.label || check.scan_tag.code }}
              </span>
              <UBadge 
                :color="getStatusColor(check.isExpired)"
                variant="subtle"
                size="xs"
              >
                {{ getStatusText(check.isExpired) }}
              </UBadge>
            </div>

            <!-- Informations du check -->
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-building" class="size-3" />
                <span>{{ check.business.name }}</span>
              </div>
              
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-calendar" class="size-3" />
                <span>Scanné le {{ formatDate(check.scanned_at) }}</span>
              </div>

              <div v-if="check.expires_at" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-clock" class="size-3" />
                <span v-if="check.isExpired" class="text-red-600">
                  Expiré le {{ formatDate(check.expires_at) }}
                </span>
                <span v-else class="text-green-600">
                  Expire dans {{ check.timeRemaining }}
                </span>
              </div>

              <!-- Informations techniques -->
              <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mt-2">
                <span v-if="check.device_hash">
                  Device: {{ check.device_hash.slice(0, 8) }}...
                </span>
                <span v-if="check.user_agent">
                  {{ check.user_agent.split(' ')[0] }}
                </span>
              </div>
            </div>
          </div>

          <!-- Indicateur de sélection -->
          <div class="ml-2">
            <UIcon 
              v-if="selectedCheck?.id === check.id"
              name="i-lucide-chevron-right" 
              class="size-4 text-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
