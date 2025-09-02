<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
const { business, loading, error } = useBusinessManagement()
const toast = useToast()

// Interface pour les photos d'entreprise
interface BusinessPhoto {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

// Placeholder pour les photos d'entreprise
const photos = ref<BusinessPhoto[]>([
  // Exemples de structure pour les futures photos
  // { id: '1', url: '/placeholder1.jpg', alt: 'Photo principale', isPrimary: true },
  // { id: '2', url: '/placeholder2.jpg', alt: 'Intérieur', isPrimary: false },
])

const isUploading = ref(false)

// Fonction placeholder pour l'upload de photos
function onPhotoUpload() {
  toast.add({
    title: 'Information',
    description: 'La gestion des photos sera disponible prochainement.',
    icon: 'i-lucide-info',
    color: 'info'
  })
}

// Fonction placeholder pour supprimer une photo
function deletePhoto(photoId: string) {
  toast.add({
    title: 'Information',
    description: 'La suppression de photos sera disponible prochainement.',
    icon: 'i-lucide-info',
    color: 'info'
  })
}

// Fonction placeholder pour définir une photo principale
function setPrimaryPhoto(photoId: string) {
  toast.add({
    title: 'Information',
    description: 'La gestion de la photo principale sera disponible prochainement.',
    icon: 'i-lucide-info',
    color: 'info'
  })
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
        :loading="isUploading || loading"
        :disabled="loading"
        class="w-fit lg:ms-auto"
        @click="onPhotoUpload"
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
          @click="onPhotoUpload"
        />
      </div>

      <!-- Liste des photos (placeholder pour le futur) -->
      <div
        v-else
        class="space-y-6"
      >
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
              :alt="photo.alt"
              class="w-full h-full object-cover"
            >
            
            <!-- Badge photo principale -->
            <div
              v-if="photo.isPrimary"
              class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
            >
              Photo principale
            </div>
            
            <!-- Actions au survol -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <UButton
                v-if="!photo.isPrimary"
                label="Définir comme principale"
                color="neutral"
                variant="solid"
                size="sm"
                @click="setPrimaryPhoto(photo.id)"
              />
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
            @click="onPhotoUpload"
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
