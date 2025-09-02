<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
const { business, loading, error, updateBusiness, createBusiness } = useBusinessManagement()
const { searchBusinesses } = useBusinesses() // Pour les catégories

const businessSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  description: z.string().optional(),
  address: z.string().min(5, 'Adresse trop courte'),
  city: z.string().min(2, 'Ville requise'),
  postal_code: z.string().min(2, 'Code postal requis'),
  country: z.string().min(2, 'Pays requis'),
  phone: z.string().optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  category_id: z.string().optional(),
  price: z.enum(['1', '2', '3', '4']).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

type BusinessSchema = z.output<typeof businessSchema>

// État réactif du formulaire basé sur les données Supabase
const businessForm = reactive<Partial<BusinessSchema>>({
  name: '',
  description: '',
  address: '',
  city: '',
  postal_code: '',
  country: 'France',
  phone: '',
  website: '',
  category_id: '',
  price: undefined,
  latitude: undefined,
  longitude: undefined
})

const toast = useToast()
const pending = ref(false)
const categories = ref<any[]>([])

// Options pour le niveau de prix
const priceOptions = [
  { label: '$ - Économique', value: '1' },
  { label: '$$ - Modéré', value: '2' },
  { label: '$$$ - Élevé', value: '3' },
  { label: '$$$$ - Très élevé', value: '4' }
]

// Charger les catégories
const loadCategories = async () => {
  try {
    // Catégories statiques pour l'instant
    categories.value = [
      { label: 'Restaurant', value: 'restaurant' },
      { label: 'Bar', value: 'bar' },
      { label: 'Café', value: 'cafe' },
      { label: 'Hôtel', value: 'hotel' },
      { label: 'Commerce', value: 'commerce' },
      { label: 'Service', value: 'service' }
    ]
  } catch (err) {
    console.error('Erreur chargement catégories:', err)
  }
}

// Synchroniser les données de l'entreprise Supabase avec le formulaire
watch(business, (newBusiness) => {
  if (newBusiness) {
    businessForm.name = newBusiness.name || ''
    businessForm.description = newBusiness.description || ''
    businessForm.address = newBusiness.address || ''
    businessForm.city = newBusiness.city || ''
    businessForm.postal_code = newBusiness.postal_code || ''
    businessForm.country = newBusiness.country || 'France'
    businessForm.phone = newBusiness.phone || ''
    businessForm.website = newBusiness.website || ''
    businessForm.category_id = newBusiness.category_id || ''
    businessForm.price = newBusiness.price || undefined
    businessForm.latitude = newBusiness.latitude || undefined
    businessForm.longitude = newBusiness.longitude || undefined
  }
}, { immediate: true })

// Charger les catégories au montage
onMounted(() => {
  loadCategories()
})

async function onSubmit(event: FormSubmitEvent<BusinessSchema>) {
  if (!user.value?.id) {
    toast.add({
      title: 'Erreur',
      description: 'Vous devez être connecté pour modifier votre entreprise.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  try {
    pending.value = true

    const businessData = {
      name: event.data.name!,
      description: event.data.description || null,
      address: event.data.address!,
      city: event.data.city!,
      postal_code: event.data.postal_code!,
      country: event.data.country!,
      phone: event.data.phone || null,
      website: event.data.website || null,
      category_id: event.data.category_id || null,
      price: event.data.price || null,
      latitude: event.data.latitude || null,
      longitude: event.data.longitude || null
    }

    // Créer ou mettre à jour l'entreprise
    if (business.value) {
      await updateBusiness(businessData)
      toast.add({
        title: 'Succès',
        description: 'Votre entreprise a été mise à jour avec succès.',
        icon: 'i-lucide-check',
        color: 'success'
      })
    } else {
      await createBusiness(businessData)
      toast.add({
        title: 'Succès',
        description: 'Votre entreprise a été créée avec succès.',
        icon: 'i-lucide-check',
        color: 'success'
      })
    }

  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de sauvegarder les modifications.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}

// Fonction placeholder pour l'upload de photos d'entreprise (à implémenter plus tard)
function onPhotoUpload() {
  toast.add({
    title: 'Information',
    description: 'La gestion des photos sera disponible prochainement.',
    icon: 'i-lucide-info',
    color: 'info'
  })
}
</script>

<template>
  <UForm
    id="settings"
    :schema="businessSchema"
    :state="businessForm"
    @submit="onSubmit"
  >
    <UPageCard
      title="Informations de l'entreprise"
      description="Gérez les informations de votre établissement."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="settings"
        :label="business ? 'Mettre à jour' : 'Créer l\'établissement'"
        color="neutral"
        type="submit"
        :loading="pending || loading"
        :disabled="loading"
        class="w-fit lg:ms-auto"
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
      <!-- Informations de base -->
      <UFormField
        name="name"
        label="Nom de l'établissement"
        description="Le nom de votre établissement tel qu'il apparaîtra publiquement."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="businessForm.name"
          autocomplete="off"
          :disabled="loading"
          placeholder="Nom de votre établissement"
        />
      </UFormField>
      
      <USeparator />
      
      <UFormField
        name="description"
        label="Description"
        description="Décrivez votre établissement en quelques mots."
        class="flex max-sm:flex-col justify-between items-start gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UTextarea
          v-model="businessForm.description"
          :rows="3"
          autoresize
          :disabled="loading"
          placeholder="Décrivez votre établissement..."
          class="w-full"
        />
      </UFormField>

      <USeparator />

      <UFormField
        name="category_id"
        label="Catégorie"
        description="Le type d'établissement."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <USelect
          v-model="businessForm.category_id"
          :options="categories"
          :disabled="loading"
          placeholder="Sélectionnez une catégorie"
        />
      </UFormField>

      <USeparator />

      <UFormField
        name="price"
        label="Niveau de prix"
        description="Gamme de prix de votre établissement."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <USelect
          v-model="businessForm.price"
          :options="priceOptions"
          :disabled="loading"
          placeholder="Sélectionnez un niveau"
        />
      </UFormField>

      <USeparator />

      <!-- Contact -->
      <UFormField
        name="phone"
        label="Téléphone"
        description="Numéro de téléphone de contact."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="businessForm.phone"
          autocomplete="off"
          :disabled="loading"
          placeholder="+33 1 23 45 67 89"
        />
      </UFormField>

      <USeparator />

      <UFormField
        name="website"
        label="Site web"
        description="URL de votre site web."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="businessForm.website"
          autocomplete="off"
          :disabled="loading"
          placeholder="https://www.example.com"
        />
      </UFormField>

      <USeparator />

      <!-- Adresse -->
      <UFormField
        name="address"
        label="Adresse"
        description="Adresse complète de votre établissement."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="businessForm.address"
          autocomplete="off"
          :disabled="loading"
          placeholder="123 Rue de la Paix"
        />
      </UFormField>

      <USeparator />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormField
          name="city"
          label="Ville"
          required
        >
          <UInput
            v-model="businessForm.city"
            autocomplete="off"
            :disabled="loading"
            placeholder="Paris"
          />
        </UFormField>

        <UFormField
          name="postal_code"
          label="Code postal"
          required
        >
          <UInput
            v-model="businessForm.postal_code"
            autocomplete="off"
            :disabled="loading"
            placeholder="75001"
          />
        </UFormField>

        <UFormField
          name="country"
          label="Pays"
          required
        >
          <UInput
            v-model="businessForm.country"
            autocomplete="off"
            :disabled="loading"
            placeholder="France"
          />
        </UFormField>
      </div>

      <USeparator />

      <!-- Coordonnées GPS -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UFormField
          name="latitude"
          label="Latitude"
          description="Coordonnée latitude (optionnel)"
        >
          <UInput
            v-model.number="businessForm.latitude"
            type="number"
            step="any"
            :disabled="loading"
            placeholder="48.8566"
          />
        </UFormField>

        <UFormField
          name="longitude"
          label="Longitude"
          description="Coordonnée longitude (optionnel)"
        >
          <UInput
            v-model.number="businessForm.longitude"
            type="number"
            step="any"
            :disabled="loading"
            placeholder="2.3522"
          />
        </UFormField>
      </div>

      <USeparator />

      <!-- Photos placeholder -->
      <UFormField
        name="photos"
        label="Photos de l'établissement"
        description="Gérez les photos de votre établissement (fonctionnalité à venir)."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UButton
            label="Gérer les photos"
            color="neutral"
            variant="soft"
            icon="i-lucide-camera"
            :disabled="loading"
            @click="onPhotoUpload"
          />
          <span class="text-sm text-gray-500">Fonctionnalité à venir</span>
        </div>
      </UFormField>
    </UPageCard>
  </UForm>
</template>
