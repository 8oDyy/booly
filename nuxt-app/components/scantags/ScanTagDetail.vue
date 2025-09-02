<template>
  <UDashboardPanel
    id="scan-tag-detail"
    :default-size="40"
    :min-size="30"
    :max-size="60"
    resizable
  >
    <UDashboardNavbar :title="`Scan Tag: ${scanTag.label || scanTag.code}`">
      <template #trailing>
        <UBadge 
          :color="scanTag.status === 'active' ? 'success' : 'error'"
          variant="subtle"
        >
          {{ scanTag.status === 'active' ? 'Actif' : 'Inactif' }}
        </UBadge>
      </template>

      <template #right>
        <UButton
          icon="i-lucide-x"
          size="sm"
          variant="ghost"
          color="error"
          @click="$emit('close')"
        />
      </template>
    </UDashboardNavbar>

    <div class="p-6 space-y-6 overflow-y-auto max-h-screen">
      <!-- Informations générales -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="size-4" />
            <h3 class="text-sm font-medium">Informations générales</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Code</label>
              <div class="mt-1 flex items-center gap-2">
                <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {{ scanTag.code }}
                </code>
                <UButton
                  icon="i-lucide-copy"
                  size="xs"
                  variant="ghost"
                  color="error"
                  @click="copyToClipboard(scanTag.code)"
                />
              </div>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
              <div class="mt-1">
                <UBadge variant="outline" size="sm">
                  {{ scanTag.type }}
                </UBadge>
              </div>
            </div>
          </div>

          <div v-if="scanTag.label">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Label</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ scanTag.label }}</p>
          </div>

          <!-- URL de scan -->
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">URL de scan</label>
            <div class="mt-1 flex items-center gap-2">
              <code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                {{ scanUrl }}
              </code>
              <UButton
                icon="i-lucide-copy"
                size="xs"
                variant="ghost"
                color="error"
                @click="copyToClipboard(scanUrl)"
              />
              <UButton
                icon="i-lucide-external-link"
                size="xs"
                variant="ghost"
                color="neutral"
                @click="openUrl(scanUrl)"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Établissement -->
      <UCard v-if="scanTag.business">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-building" class="size-4" />
            <h3 class="text-sm font-medium">Établissement</h3>
          </div>
        </template>

        <div class="space-y-2">
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ scanTag.business.name }}</p>
          </div>
          
          <div v-if="scanTag.business.address">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse</label>
            <p class="mt-1 text-sm text-gray-500">{{ scanTag.business.address }}</p>
          </div>
        </div>
      </UCard>

      <!-- Statistiques -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-bar-chart-3" class="size-4" />
            <h3 class="text-sm font-medium">Statistiques</h3>
          </div>
        </template>

        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div class="text-2xl font-bold text-primary-600">{{ scanTag.total_scans }}</div>
            <div class="text-xs text-gray-500">Total scans</div>
          </div>
          
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ scanTag.recent_scans }}</div>
            <div class="text-xs text-gray-500">Scans récents</div>
          </div>
        </div>
      </UCard>

      <!-- Dates -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar" class="size-4" />
            <h3 class="text-sm font-medium">Dates</h3>
          </div>
        </template>

        <div class="space-y-3">
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Créé le</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(scanTag.created_at) }}</p>
          </div>
          
          <div>
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Modifié le</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(scanTag.updated_at) }}</p>
          </div>

          <div v-if="scanTag.deactivated_at">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Désactivé le</label>
            <p class="mt-1 text-sm text-red-600">{{ formatDate(scanTag.deactivated_at) }}</p>
          </div>

          <div v-if="scanTag.last_scan_at">
            <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Dernier scan</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(scanTag.last_scan_at) }}</p>
          </div>
        </div>
      </UCard>

      <!-- Actions -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings" class="size-4" />
            <h3 class="text-sm font-medium">Actions</h3>
          </div>
        </template>

        <div class="flex flex-col gap-2">
          <UButton
            v-if="scanTag.status === 'active'"
            icon="i-lucide-pause"
            variant="outline"
            color="warning"
            size="sm"
            @click="toggleStatus"
          >
            Désactiver le tag
          </UButton>
          
          <UButton
            v-else
            icon="i-lucide-play"
            variant="outline"
            color="success"
            size="sm"
            @click="toggleStatus"
          >
            Activer le tag
          </UButton>

          <UButton
            icon="i-lucide-edit"
            variant="outline"
            color="secondary"
            size="sm"
            @click="editTag"
          >
            Modifier le tag
          </UButton>

          <UButton
            icon="i-lucide-trash-2"
            variant="outline"
            color="error"
            size="sm"
            @click="deleteTag"
          >
            Supprimer le tag
          </UButton>
        </div>
      </UCard>
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { ScanTagWithStats } from '~/composables/dashboard/useScanTagsManagement'

interface Props {
  scanTag: ScanTagWithStats
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// URL de scan
const scanUrl = computed(() => {
  return `${window.location.origin}/scan/${props.scanTag.id}`
})

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

// Copier dans le presse-papiers
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // TODO: Ajouter un toast de confirmation
    console.log('Copié:', text)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

// Ouvrir une URL
const openUrl = (url: string) => {
  window.open(url, '_blank')
}

// Basculer le statut
const toggleStatus = () => {
  // TODO: Implémenter la logique de changement de statut
  console.log('Toggle status pour:', props.scanTag.id)
  emit('updated')
}

// Modifier le tag
const editTag = () => {
  // TODO: Ouvrir un modal d'édition
  console.log('Éditer le tag:', props.scanTag.id)
}

// Supprimer le tag
const deleteTag = () => {
  // TODO: Confirmer et supprimer le tag
  console.log('Supprimer le tag:', props.scanTag.id)
  emit('updated')
}
</script>
