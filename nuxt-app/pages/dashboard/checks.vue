<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

import { computed, ref, onMounted } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useScanTagsManagement, type ScanTagWithStats } from '~/composables/dashboard/useScanTagsManagement'
import ScanTagModal from '~/components/checks/ScanTagModal.vue'

const tabItems = [{
  label: 'Tous les tags',
  value: 'all'
}, {
  label: 'Actifs',
  value: 'active'
}, {
  label: 'Inactifs',
  value: 'inactive'
}]

const selectedTab = ref('all')

const { 
  getAllScanTags,
  createScanTag,
  updateScanTag,
  deleteScanTag,
  getScanTagsStats
} = useScanTagsManagement()

console.log('📄 Page scan tags - Composable chargé')

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

const selectedScanTag = ref<ScanTagWithStats | null>(null)
const scanTags = ref<ScanTagWithStats[]>([])
const pending = ref(false)
const error = ref(false)
const isCreateModalOpen = ref(false)

console.log('📄 Page scan tags - Variables initialisées')

// États de chargement
const stats = ref({
  totalScanTags: 0,
  activeScanTags: 0,
  inactiveScanTags: 0,
  totalScans: 0,
  recentScans: 0
})

// Charger les scan tags
const loadData = async () => {
  console.log('📄 Page scan tags - Début chargement des données')
  pending.value = true
  error.value = false
  
  try {
    const [scanTagsData, statsData] = await Promise.all([
      getAllScanTags(selectedTab.value === 'all' ? undefined : selectedTab.value as 'active' | 'inactive'),
      getScanTagsStats()
    ])
    
    scanTags.value = scanTagsData
    stats.value = statsData
    
    console.log('✅ Page scan tags - Données chargées:', {
      scanTags: scanTagsData.length,
      stats: statsData
    })
  } catch (err) {
    console.error('❌ Page scan tags - Erreur chargement:', err)
    error.value = true
  } finally {
    pending.value = false
  }
}

// Charger les données au montage
onMounted(loadData)

// Filtrer les scan tags selon l'onglet sélectionné
const filteredScanTags = computed(() => {
  if (selectedTab.value === 'all') {
    return scanTags.value
  } else if (selectedTab.value === 'active') {
    return scanTags.value.filter((tag: ScanTagWithStats) => tag.status === 'active')
  } else if (selectedTab.value === 'inactive') {
    return scanTags.value.filter((tag: ScanTagWithStats) => tag.status === 'inactive')
  }
  return scanTags.value
})

// Computed pour le panel mobile
const isScanTagPanelOpen = computed({
  get() {
    return !!selectedScanTag.value
  },
  set(value: boolean) {
    if (!value) {
      selectedScanTag.value = null
    }
  }
})

// Sélectionner un scan tag
const selectScanTag = (scanTag: ScanTagWithStats) => {
  console.log('📄 Page scan tags - Scan tag sélectionné:', scanTag.id)
  selectedScanTag.value = scanTag
}

// Fonction pour ouvrir le modal de création
const openCreateModal = () => {
  console.log('📄 Page scan tags - Ouverture modal création')
  isCreateModalOpen.value = true
}
</script>

<template>
  <UDashboardPanel
    id="checks-1"
    :default-size="30"
    :min-size="25"
    :max-size="40"
    resizable
  >
    <UDashboardNavbar title="Gestion des Scan Tags">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      
      <template #trailing>
        <UBadge :label="filteredScanTags.length" variant="subtle" />
      </template>

      <template #right>
        <UModal>
          <UButton
            icon="i-lucide-plus"
            size="sm"
            label="Nouveau Tag"
          />
          <template #content>
            <ScanTagModal/>
          </template>
        </UModal>
      </template>
    </UDashboardNavbar>
    
    <!-- Statistiques rapides -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-800">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-secondary-600">{{ stats.totalScanTags }}</div>
          <div class="text-xs text-gray-500">Total Tags</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ stats.activeScanTags }}</div>
          <div class="text-xs text-gray-500">Actifs</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">{{ stats.inactiveScanTags }}</div>
          <div class="text-xs text-gray-500">Inactifs</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalScans }}</div>
          <div class="text-xs text-gray-500">Total Scans</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ stats.recentScans }}</div>
          <div class="text-xs text-gray-500">Scans Récents</div>
        </div>
      </div>
    </div>
    
    <!-- Liste des scan tags -->
    <ScantagsScanTagsList 
      v-model="selectedScanTag" 
      :scan-tags="filteredScanTags" 
      :pending="pending"
      :error="error"
      @refresh="loadData"
    />
  </UDashboardPanel>

  <!-- Détail du scan tag sélectionné -->
  <ScantagsScanTagDetail 
    v-if="selectedScanTag" 
    :scan-tag="selectedScanTag" 
    @close="selectedScanTag = null"
    @updated="loadData"
  />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="i-lucide-qr-code" class="size-32 text-dimmed" />
  </div>

  <!-- Version mobile -->
  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isScanTagPanelOpen">
      <template #content>
        <ScantagsScanTagDetail 
          v-if="selectedScanTag" 
          :scan-tag="selectedScanTag" 
          @close="selectedScanTag = null"
          @updated="loadData"
        />
      </template>
    </USlideover>
  </ClientOnly>
</template>
