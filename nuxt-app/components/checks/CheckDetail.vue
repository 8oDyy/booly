<script setup lang="ts">
import type { CheckWithDetails } from '~/composables/dashboard/useChecksManagement'

interface Props {
  check: CheckWithDetails
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Fonction pour formater la date complète
const formatFullDate = (dateString: string) => {
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

// Fonction pour copier l'ID du check
const copyCheckId = async () => {
  try {
    await navigator.clipboard.writeText(props.check.id)
    // TODO: Ajouter un toast de confirmation
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

// Fonction pour copier le code du scan tag
const copyScanTagCode = async () => {
  try {
    await navigator.clipboard.writeText(props.check.scan_tag.code)
    // TODO: Ajouter un toast de confirmation
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- En-tête -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <UIcon 
          :name="getTagTypeIcon(check.scan_tag.type)" 
          class="size-6 text-gray-600 dark:text-gray-400"
        />
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ check.scan_tag.label || 'Scan Tag' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ check.business.name }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <UBadge 
          :color="getStatusColor(check.isExpired)"
          variant="subtle"
        >
          {{ getStatusText(check.isExpired) }}
        </UBadge>
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          size="sm"
          @click="emit('close')"
        />
      </div>
    </div>

    <!-- Contenu -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- Informations du Scan Tag -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Informations du Scan Tag
        </h3>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Code</span>
            <div class="flex items-center gap-2">
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {{ check.scan_tag.code }}
              </code>
              <UButton
                icon="i-lucide-copy"
                variant="ghost"
                size="xs"
                @click="copyScanTagCode"
              />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Type</span>
            <div class="flex items-center gap-2">
              <UIcon :name="getTagTypeIcon(check.scan_tag.type)" class="size-4" />
              <span class="text-sm font-medium">{{ check.scan_tag.type }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Statut</span>
            <UBadge 
              :color="check.scan_tag.status === 'active' ? 'success' : 'neutral'"
              variant="subtle"
              size="xs"
            >
              {{ check.scan_tag.status }}
            </UBadge>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Créé le</span>
            <span class="text-sm">{{ formatFullDate(check.scan_tag.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Informations du Check -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Détails du Check
        </h3>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">ID du Check</span>
            <div class="flex items-center gap-2">
              <code class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {{ check.id.slice(0, 8) }}...
              </code>
              <UButton
                icon="i-lucide-copy"
                variant="ghost"
                size="xs"
                @click="copyCheckId"
              />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Scanné le</span>
            <span class="text-sm">{{ formatFullDate(check.scanned_at) }}</span>
          </div>
          
          <div v-if="check.expires_at" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Expire le</span>
            <div class="text-right">
              <div class="text-sm">{{ formatFullDate(check.expires_at) }}</div>
              <div v-if="!check.isExpired && check.timeRemaining" class="text-xs text-green-600">
                Dans {{ check.timeRemaining }}
              </div>
              <div v-else-if="check.isExpired" class="text-xs text-red-600">
                Expiré
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations Techniques -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Informations Techniques
        </h3>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div v-if="check.device_hash" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Device Hash</span>
            <code class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {{ check.device_hash }}
            </code>
          </div>
          
          <div v-if="check.user_agent" class="flex items-start justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">User Agent</span>
            <div class="text-right max-w-xs">
              <code class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded break-all">
                {{ check.user_agent }}
              </code>
            </div>
          </div>
          
          <div v-if="check.ip" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Adresse IP</span>
            <code class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {{ check.ip }}
            </code>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Créé le</span>
            <span class="text-sm">{{ formatFullDate(check.created_at) }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">Mis à jour le</span>
            <span class="text-sm">{{ formatFullDate(check.updated_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-external-link"
            variant="outline"
            size="sm"
            disabled
          >
            Voir l'avis associé
          </UButton>
          
          <UButton
            icon="i-lucide-refresh-cw"
            variant="outline"
            size="sm"
            @click="emit('updated')"
          >
            Actualiser
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
