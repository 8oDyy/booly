<template>
  <div class="space-y-6">
    <!-- Statistiques des tags -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard class="bg-gradient-to-br from-primary-50 to-primary-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-primary-600">Total tags</p>
            <p class="text-2xl font-bold text-primary-900">{{ stats.totalTags }}</p>
          </div>
          <UIcon name="i-heroicons-qr-code" class="h-8 w-8 text-primary-500" />
        </div>
      </UCard>
      
      <UCard class="bg-gradient-to-br from-green-50 to-green-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">Tags actifs</p>
            <p class="text-2xl font-bold text-green-900">{{ stats.activeTags }}</p>
          </div>
          <UIcon name="i-heroicons-check-circle" class="h-8 w-8 text-green-500" />
        </div>
      </UCard>
      
      <UCard class="bg-gradient-to-br from-blue-50 to-blue-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600">Scans totaux</p>
            <p class="text-2xl font-bold text-blue-900">{{ stats.totalScans }}</p>
          </div>
          <UIcon name="i-heroicons-cursor-arrow-rays" class="h-8 w-8 text-blue-500" />
        </div>
      </UCard>
      
      <UCard class="bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-yellow-600">Scans ce mois</p>
            <p class="text-2xl font-bold text-yellow-900">{{ stats.monthlyScans }}</p>
          </div>
          <UIcon name="i-heroicons-calendar-days" class="h-8 w-8 text-yellow-500" />
        </div>
      </UCard>
    </div>

    <!-- Créer un nouveau tag -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Créer un nouveau tag</h3>
      </template>
      
      <UForm @submit="createTag" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Établissement" name="business_id" required>
            <USelect
              v-model="tagForm.business_id"
              :options="businessOptions"
              placeholder="Sélectionnez un établissement"
            />
          </UFormGroup>
          
          <UFormGroup label="Type de tag" name="tag_type" required>
            <USelect
              v-model="tagForm.tag_type"
              :options="tagTypeOptions"
              placeholder="Sélectionnez le type"
            />
          </UFormGroup>
        </div>
        
        <UFormGroup label="Libellé (optionnel)" name="label">
          <UInput 
            v-model="tagForm.label" 
            placeholder="Ex: Table 5, Caisse principale..."
          />
        </UFormGroup>
        
        <div class="flex justify-end">
          <UButton 
            type="submit"
            :loading="creatingTag"
            icon="i-heroicons-plus"
          >
            Créer le tag
          </UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Liste des tags par établissement -->
    <div v-for="business in businessesWithTags" :key="business.id" class="space-y-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <UIcon 
                :name="getCategoryIcon(business.category_id)" 
                class="h-6 w-6 text-gray-400"
              />
              <h3 class="text-lg font-semibold">{{ business.name }}</h3>
            </div>
            <UBadge color="primary">{{ business.tags?.length || 0 }} tags</UBadge>
          </div>
        </template>
        
        <div v-if="business.tags?.length === 0" class="text-center py-8">
          <UIcon name="i-heroicons-qr-code" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">Aucun tag créé pour cet établissement</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="tag in business.tags" 
            :key="tag.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <!-- En-tête du tag -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="getTagIcon(tag.tag_type)" 
                  class="h-5 w-5 text-gray-500"
                />
                <span class="font-medium text-gray-900">
                  {{ tag.tag_type === 'qr' ? 'QR Code' : 'Tag NFC' }}
                </span>
              </div>
              <UBadge 
                :color="tag.tag_status === 'active' ? 'success' : 'neutral'"
                variant="soft"
              >
                {{ tag.tag_status === 'active' ? 'Actif' : 'Inactif' }}
              </UBadge>
            </div>
            
            <!-- Informations du tag -->
            <div class="space-y-2 mb-4">
              <div v-if="tag.label" class="text-sm text-gray-600">
                <span class="font-medium">Libellé:</span> {{ tag.label }}
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">Créé:</span> {{ formatDate(tag.created_at) }}
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">Scans:</span> {{ getTagScans(tag.id) }}
              </div>
            </div>
            
            <!-- QR Code preview -->
            <div v-if="tag.tag_type === 'qr'" class="mb-4">
              <div class="bg-white border-2 border-gray-200 rounded-lg p-2 text-center">
                <div class="w-24 h-24 mx-auto bg-gray-100 rounded flex items-center justify-center">
                  <UIcon name="i-heroicons-qr-code" class="h-12 w-12 text-gray-400" />
                </div>
                <p class="text-xs text-gray-500 mt-1">QR Code</p>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <UButton 
                  v-if="tag.tag_type === 'qr'"
                  color="primary" 
                  variant="outline" 
                  size="xs"
                  icon="i-heroicons-arrow-down-tray"
                  @click="downloadQR(tag)"
                >
                  Télécharger
                </UButton>
                <UButton 
                  color="neutral" 
                  variant="outline" 
                  size="xs"
                  icon="i-heroicons-chart-bar"
                  @click="viewStats(tag)"
                >
                  Stats
                </UButton>
              </div>
              
              <div class="flex space-x-1">
                <UButton 
                  :color="tag.tag_status === 'active' ? 'red' : 'green'"
                  variant="ghost" 
                  size="xs"
                  :icon="tag.tag_status === 'active' ? 'i-heroicons-pause' : 'i-heroicons-play'"
                  @click="toggleTagStatus(tag)"
                >
                  {{ tag.tag_status === 'active' ? 'Désactiver' : 'Activer' }}
                </UButton>
                <UButton 
                  color="error" 
                  variant="ghost" 
                  size="xs"
                  icon="i-heroicons-trash"
                  @click="confirmDeleteTag(tag)"
                >
                  Supprimer
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Modal de statistiques -->
    <UModal v-model="showStatsModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Statistiques du tag</h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="showStatsModal = false" />
          </div>
        </template>
        
        <div v-if="selectedTagStats" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-900">{{ selectedTagStats.totalScans }}</p>
              <p class="text-sm text-blue-600">Scans totaux</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-900">{{ selectedTagStats.uniqueUsers }}</p>
              <p class="text-sm text-green-600">Utilisateurs uniques</p>
            </div>
          </div>
          
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <p class="text-2xl font-bold text-yellow-900">{{ selectedTagStats.lastScan }}</p>
            <p class="text-sm text-yellow-600">Dernier scan</p>
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- Modal de confirmation de suppression -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Confirmer la suppression</h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="showDeleteModal = false" />
          </div>
        </template>
        
        <div class="py-4">
          <p class="mb-4">Êtes-vous sûr de vouloir supprimer ce tag ?</p>
          <p class="text-sm text-gray-500 mb-4">
            Cette action est irréversible. Toutes les données de scan associées seront également supprimées.
          </p>
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" @click="showDeleteModal = false">Annuler</UButton>
            <UButton color="error" :loading="deletingTag" @click="deleteTag">
              Supprimer définitivement
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

interface Props {
  businesses: any[]
}

interface Emits {
  (e: 'tags-updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// État réactif
const loading = ref(true)
const tags = ref([])
const checks = ref([])
const creatingTag = ref(false)
const showStatsModal = ref(false)
const showDeleteModal = ref(false)
const selectedTag = ref(null)
const selectedTagStats = ref(null)
const tagToDelete = ref(null)
const deletingTag = ref(false)

// Formulaire
const tagForm = ref({
  business_id: '',
  tag_type: '',
  label: ''
})

// Options
const businessOptions = computed(() => 
  props.businesses.map(business => ({
    label: business.name,
    value: business.id
  }))
)

const tagTypeOptions = [
  { label: 'QR Code', value: 'qr' },
  { label: 'Tag NFC', value: 'nfc' }
]

// Établissements avec leurs tags
const businessesWithTags = computed(() => {
  return props.businesses.map(business => ({
    ...business,
    tags: tags.value.filter(tag => tag.business_id === business.id)
  }))
})

// Statistiques
const stats = computed(() => {
  const totalTags = tags.value.length
  const activeTags = tags.value.filter(tag => tag.tag_status === 'active').length
  const totalScans = checks.value.length
  
  // Scans du mois en cours
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyScans = checks.value.filter(check => {
    const checkDate = new Date(check.scanned_at)
    return checkDate.getMonth() === currentMonth && checkDate.getFullYear() === currentYear
  }).length

  return {
    totalTags,
    activeTags,
    totalScans,
    monthlyScans
  }
})

// Cycle de vie
onMounted(async () => {
  await loadTagsData()
})

// Méthodes
async function loadTagsData() {
  if (!user.value || props.businesses.length === 0) return
  
  try {
    loading.value = true
    
    const businessIds = props.businesses.map(b => b.id)
    
    // Charger les tags
    const { data: tagsData, error: tagsError } = await supabase
      .from('scan_tags')
      .select('*')
      .in('business_id', businessIds)
      .order('created_at', { ascending: false })
    
    if (tagsError) throw tagsError
    tags.value = tagsData || []
    
    // Charger les scans
    const tagIds = tags.value.map(tag => tag.id)
    if (tagIds.length > 0) {
      const { data: checksData, error: checksError } = await supabase
        .from('checks')
        .select('*')
        .in('tag_id', tagIds)
        .order('scanned_at', { ascending: false })
      
      if (checksError) throw checksError
      checks.value = checksData || []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tags:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les tags',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

async function createTag() {
  if (!user.value || !tagForm.value.business_id || !tagForm.value.tag_type) return
  
  try {
    creatingTag.value = true
    
    const { error } = await supabase
      .from('scan_tags')
      .insert([{
        business_id: tagForm.value.business_id,
        tag_type: tagForm.value.tag_type,
        tag_status: 'active',
        label: tagForm.value.label || null
      }])
    
    if (error) throw error
    
    toast.add({
      title: 'Tag créé',
      description: 'Le tag a été créé avec succès',
      color: 'success'
    })
    
    // Réinitialiser le formulaire
    tagForm.value = {
      business_id: '',
      tag_type: '',
      label: ''
    }
    
    await loadTagsData()
    emit('tags-updated')
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer le tag',
      color: 'error'
    })
  } finally {
    creatingTag.value = false
  }
}

async function toggleTagStatus(tag: any) {
  try {
    const newStatus = tag.tag_status === 'active' ? 'inactive' : 'active'
    
    const { error } = await supabase
      .from('scan_tags')
      .update({ 
        tag_status: newStatus,
        deactivated_at: newStatus === 'inactive' ? new Date().toISOString() : null
      })
      .eq('id', tag.id)
    
    if (error) throw error
    
    toast.add({
      title: 'Statut modifié',
      description: `Le tag a été ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès`,
      color: 'success'
    })
    
    await loadTagsData()
    emit('tags-updated')
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de modifier le statut du tag',
      color: 'error'
    })
  }
}

function confirmDeleteTag(tag: any) {
  tagToDelete.value = tag
  showDeleteModal.value = true
}

async function deleteTag() {
  if (!tagToDelete.value) return
  
  try {
    deletingTag.value = true
    
    const { error } = await supabase
      .from('scan_tags')
      .delete()
      .eq('id', tagToDelete.value.id)
    
    if (error) throw error
    
    toast.add({
      title: 'Tag supprimé',
      description: 'Le tag a été supprimé avec succès',
      color: 'success'
    })
    
    showDeleteModal.value = false
    tagToDelete.value = null
    await loadTagsData()
    emit('tags-updated')
  } catch (error) {
    console.error('Erreur lors de la suppression du tag:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer le tag',
      color: 'error'
    })
  } finally {
    deletingTag.value = false
  }
}

async function viewStats(tag: any) {
  selectedTag.value = tag
  
  // Calculer les statistiques du tag
  const tagChecks = checks.value.filter(check => check.tag_id === tag.id)
  const uniqueUsers = new Set(tagChecks.map(check => check.user_id)).size
  const lastScan = tagChecks.length > 0 
    ? formatDate(tagChecks[0].scanned_at) 
    : 'Aucun scan'
  
  selectedTagStats.value = {
    totalScans: tagChecks.length,
    uniqueUsers,
    lastScan
  }
  
  showStatsModal.value = true
}

function downloadQR(tag: any) {
  // Générer l'URL du QR code
  const qrUrl = `${window.location.origin}/scan/${tag.id}`
  
  // Simuler le téléchargement (dans une vraie app, vous généreriez le QR code)
  toast.add({
    title: 'QR Code',
    description: `URL: ${qrUrl}`,
    color: 'blue'
  })
}

function getTagScans(tagId: string) {
  return checks.value.filter(check => check.tag_id === tagId).length
}

function getTagIcon(tagType: string) {
  return tagType === 'qr' ? 'i-heroicons-qr-code' : 'i-heroicons-radio'
}

function getCategoryIcon(categoryId: string) {
  // Cette fonction devrait utiliser les catégories pour obtenir l'icône
  return 'i-heroicons-building-storefront'
}

function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Actualiser les tags quand les établissements changent
watch(() => props.businesses, async () => {
  if (props.businesses.length > 0) {
    await loadTagsData()
  }
}, { immediate: true })
</script>
