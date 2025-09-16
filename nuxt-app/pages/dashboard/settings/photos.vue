<script setup lang="ts">
import type { Database } from '~/types/supabase'

definePageMeta({
  layout: 'dashboard'
})

type Photo = Database['public']['Tables']['photos']['Row']

const user = useSupabaseUser()
const { loadUserBusiness } = useBusinessManagement()
const { 
  photos, 
  createPhoto, 
  deletePhoto: removePhoto, 
  getPhotos, 
  loading: photosLoading, 
  uploading,
  error: photosError 
} = usePhotos()
const toast = useToast()

// Charger l'établissement de l'utilisateur
const { data: business, pending: businessLoading, error: businessError } = await useAsyncData(
  'user-business',
  () => loadUserBusiness()
)

// États réactifs
const showUploadModal = ref(false)
const selectedFiles = ref<File[]>([])
const uploadProgress = ref(0)

// États combinés
const loading = computed(() => businessLoading.value || photosLoading.value)
const error = computed(() => {
  if (businessError.value) {
    return typeof businessError.value === 'string' ? businessError.value : businessError.value.message || 'Erreur de chargement'
  }
  return photosError.value || null
})

// Charger les photos de l'établissement
const loadPhotos = async () => {
  if (!business.value?.id) return
  
  try {
    console.log('📷 Dashboard Photos - Chargement pour business:', business.value.id)
    await getPhotos({ 
      businessId: business.value.id, 
      photoType: 'business_gallery' 
    })
    console.log('📸 Dashboard Photos - Photos chargées:', photos.value.length)
  } catch (err) {
    console.error('Erreur chargement photos:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les photos',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

// Watcher pour charger les photos quand l'établissement est disponible
watch(business, async (newBusiness) => {
  if (newBusiness?.id) {
    await loadPhotos()
  }
}, { immediate: true })

// Validation des fichiers
const validateFiles = (files: File[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (files.length + photos.value.length > 10) {
    errors.push('Maximum 10 photos par établissement')
  }
  
  files.forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Format non supporté`)
    }
    if (file.size > maxSize) {
      errors.push(`${file.name}: Fichier trop volumineux (max 5MB)`)
    }
  })
  
  return { valid: errors.length === 0, errors }
}

// Gestion de l'upload de fichiers
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  const validation = validateFiles(files)
  if (!validation.valid) {
    validation.errors.forEach(error => {
      toast.add({
        title: 'Erreur de validation',
        description: error,
        icon: 'i-lucide-alert-circle',
        color: 'error'
      })
    })
    return
  }
  
  selectedFiles.value = files
  // Upload directement après sélection
  await uploadPhotos()
}

// Upload des photos directement après sélection
const uploadPhotos = async () => {
  if (!business.value?.id || selectedFiles.value.length === 0) return
  
  try {
    uploadProgress.value = 0
    const totalFiles = selectedFiles.value.length
    
    console.log('📤 Dashboard - Upload pour business:', business.value.id)
    
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]
      
      const photo = await createPhoto({
        businessId: business.value.id,
        photoType: 'business_gallery',
        description: '',
        file
      })
      
      console.log('✅ Dashboard - Photo créée:', photo.id, 'pour business:', photo.business_id)
      
      uploadProgress.value = Math.round(((i + 1) / totalFiles) * 100)
    }
    
    toast.add({
      title: 'Succès',
      description: `${selectedFiles.value.length} photo(s) uploadée(s)`,
      icon: 'i-lucide-check',
      color: 'success'
    })
    
    // Recharger les photos
    await loadPhotos()
    
    // Reset
    selectedFiles.value = []
    uploadProgress.value = 0
    
  } catch (err) {
    console.error('Erreur upload:', err)
    toast.add({
      title: 'Erreur',
      description: 'Erreur lors de l\'upload des photos',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

// Supprimer une photo
const deletePhoto = async (photoId: string) => {
  try {
    await removePhoto(photoId)
    
    toast.add({
      title: 'Succès',
      description: 'Photo supprimée',
      icon: 'i-lucide-check',
      color: 'success'
    })
    
    // Recharger les photos
    await loadPhotos()
    
  } catch (err) {
    console.error('Erreur suppression:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer la photo',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

// Ouvrir le sélecteur de fichiers
const triggerFileInput = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = 'image/jpeg,image/jpg,image/png,image/webp'
  input.onchange = handleFileSelect
  input.click()
}
</script>

<template>
  <div>
    <UPageCard
      title="Photos de l'établissement"
      description="Gérez les photos de votre établissement pour attirer plus de clients."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Ajouter des photos"
        color="neutral"
        icon="i-lucide-plus"
        :loading="uploading || loading"
        :disabled="loading"
        class="w-fit lg:ms-auto"
        @click="triggerFileInput"
      />
    </UPageCard>

    <!-- Affichage des erreurs -->
    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="soft"
      :title="error"
      class="mb-4"
    />

    <UPageCard variant="subtle">
      <!-- État vide - Aucune photo -->
      <div
        v-if="photos.length === 0"
        class="text-center py-12"
      >
        <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
          <Icon
            name="i-lucide-camera"
            class="w-8 h-8 text-gray-400"
          />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucune photo
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Ajoutez des photos de votre établissement pour donner envie aux clients de vous rendre visite.
          Les établissements avec des photos reçoivent plus d'avis et de visites.
        </p>
        <UButton
          label="Ajouter votre première photo"
          color="neutral"
          icon="i-lucide-camera"
          :loading="uploading"
          :disabled="uploading"
          @click="triggerFileInput"
        />
      </div>

      <!-- Liste des photos -->
      <div
        v-else
        class="space-y-6"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div class="aspect-square">
              <img
                :src="photo.url"
                :alt="photo.description || 'Photo de l\'établissement'"
                class="w-full h-full object-cover"
                @load="console.log('✅ Dashboard - Image chargée:', photo.url)"
                @error="console.error('❌ Dashboard - Erreur chargement:', photo.url, $event)"
              />
            </div>
            <div class="p-3">
              <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                {{ photo.description || 'Sans description' }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ new Date(photo.created_at || '').toLocaleDateString('fr-FR') }}
              </p>
            </div>
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="soft"
                size="sm"
                @click="deletePhoto(photo.id)"
              />
            </div>
          </div>
        </div>
        <!-- Conseils pour les photos -->
        <UAlert
          icon="i-lucide-lightbulb"
          color="info"
          variant="soft"
          title="Conseils pour de bonnes photos"
          description="Utilisez des photos de haute qualité, bien éclairées, qui montrent l'ambiance de votre établissement. La première photo sera utilisée comme photo principale."
        />

        <!-- Grille de photos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
          >
            <!-- Image placeholder -->
            <img
              :src="photo.url"
              :alt="photo.description || business?.name || 'Photo établissement'"
              class="w-full h-full object-cover"
            >
            
            <!-- Badge photo principale (première photo) -->
            <div
              v-if="photos.indexOf(photo) === 0"
              class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
            >
              Photo principale
            </div>
            
            <!-- Actions au survol -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <UButton
                label="Supprimer"
                color="error"
                variant="solid"
                size="sm"
                icon="i-lucide-trash-2"
                @click="deletePhoto(photo.id)"
              />
            </div>
          </div>
          
          <!-- Bouton d'ajout -->
          <button
            class="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            @click="triggerFileInput"
          >
            <Icon
              name="i-lucide-plus"
              class="w-8 h-8 text-gray-400"
            />
            <span class="text-sm text-gray-500">Ajouter une photo</span>
          </button>
        </div>
      </div>

      <!-- Informations sur les photos -->
      <USeparator />
      
      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
          À propos des photos
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <Icon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Formats acceptés : JPG, PNG, WebP</span>
            </div>
            <div class="flex items-start gap-2">
              <Icon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Taille maximale : 5MB par photo</span>
            </div>
            <div class="flex items-start gap-2">
              <Icon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Résolution recommandée : 1200x800px minimum</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <Icon name="i-lucide-star" class="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>La photo principale apparaît en premier</span>
            </div>
            <div class="flex items-start gap-2">
              <Icon name="i-lucide-star" class="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Maximum 10 photos par établissement</span>
            </div>
            <div class="flex items-start gap-2">
              <Icon name="i-lucide-star" class="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Les photos sont modérées avant publication</span>
            </div>
          </div>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
