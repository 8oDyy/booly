<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
const { business, loading, error, updateBusiness, createBusiness } = useBusinessManagement()
const { searchBusinesses } = useBusinesses() // Pour les catégories
const { allTags } = useAllTags() // Pour les tags

const businessSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  description: z.string().optional(),
  address: z.string().min(5, 'Adresse trop courte'),
  city: z.string().min(2, 'Ville requise'),
  postal_code: z.string().min(2, 'Code postal requis'),
  country: z.string().min(2, 'Pays requis'),
  phone: z.string().regex(/^(?:\+33\s[1-9](?:\s\d{2}){4}|0[1-9](?:\s\d{2}){4})$/, 'Numéro de téléphone français invalide').optional().or(z.literal('')),
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

// Variables pour l'autocomplétion des catégories
const categoryQuery = ref('')
const showCategorySuggestions = ref(false)
const selectedCategoryIndex = ref(-1)
const categoryInput = ref<HTMLInputElement>()

// Variables pour l'autocomplétion des prix
const priceQuery = ref('')
const showPriceSuggestions = ref(false)
const selectedPriceIndex = ref(-1)
const priceInput = ref<HTMLInputElement>()

// Variables pour la sélection des tags
const selectedTags = ref<string[]>([])
const tagQuery = ref('')
const showTagSuggestions = ref(false)
const selectedTagIndex = ref(-1)
const tagInput = ref<HTMLInputElement>()

// Options pour le niveau de prix
const priceOptions = [
  { label: '$ - Économique', value: '1' },
  { label: '$$ - Modéré', value: '2' },
  { label: '$$$ - Élevé', value: '3' },
  { label: '$$$$ - Très élevé', value: '4' }
]

// Charger les catégories depuis Supabase
const loadCategories = async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name')

    if (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      // Fallback sur des catégories statiques en cas d'erreur
      categories.value = [
        { label: 'Restaurant', value: '1' },
        { label: 'Bar', value: '2' },
        { label: 'Café', value: '3' },
        { label: 'Hôtel', value: '4' },
        { label: 'Commerce', value: '5' },
        { label: 'Service', value: '6' }
      ]
    } else {
      // Transformer les données Supabase au format attendu par l'autocomplétion
      categories.value = (data || []).map((category: any) => ({
        label: category.name,
        value: category.id.toString()
      }))
    }
  } catch (err) {
    console.error('Erreur chargement catégories:', err)
    // Fallback sur des catégories statiques
    categories.value = [
      { label: 'Restaurant', value: '1' },
      { label: 'Bar', value: '2' },
      { label: 'Café', value: '3' },
      { label: 'Hôtel', value: '4' },
      { label: 'Commerce', value: '5' },
      { label: 'Service', value: '6' }
    ]
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

// Computed pour filtrer les catégories
const filteredCategories = computed(() => {
  if (!categoryQuery.value) return categories.value
  return categories.value.filter(category => 
    category.label.toLowerCase().includes(categoryQuery.value.toLowerCase())
  )
})

// Computed pour afficher toutes les options de prix (pas de filtrage)
const filteredPriceOptions = computed(() => {
  return priceOptions
})

// Computed pour filtrer les tags disponibles
const filteredTags = computed(() => {
  if (!tagQuery.value) return allTags.value
  return allTags.value.filter(tag => 
    tag.name.toLowerCase().includes(tagQuery.value.toLowerCase()) &&
    !selectedTags.value.includes(tag.id)
  )
})

// Fonctions pour l'autocomplétion des catégories
const handleCategoryInput = () => {
  selectedCategoryIndex.value = -1
  showCategorySuggestions.value = true
}

const handleCategoryKeydown = (event: KeyboardEvent) => {
  if (!showCategorySuggestions.value || filteredCategories.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedCategoryIndex.value = Math.min(selectedCategoryIndex.value + 1, filteredCategories.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedCategoryIndex.value = Math.max(selectedCategoryIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedCategoryIndex.value >= 0) {
        selectCategory(filteredCategories.value[selectedCategoryIndex.value])
      }
      break
    case 'Escape':
      showCategorySuggestions.value = false
      selectedCategoryIndex.value = -1
      break
  }
}

const selectCategory = (category: any) => {
  businessForm.category_id = category.value
  categoryQuery.value = category.label
  showCategorySuggestions.value = false
  selectedCategoryIndex.value = -1
}

const hideCategorySuggestions = () => {
  setTimeout(() => {
    showCategorySuggestions.value = false
    selectedCategoryIndex.value = -1
  }, 150)
}

// Fonctions pour la liste déroulante des prix (pas d'autocomplétion)
const handlePriceInput = () => {
  // Ne pas filtrer, juste afficher la liste
  selectedPriceIndex.value = -1
  showPriceSuggestions.value = true
}

const handlePriceKeydown = (event: KeyboardEvent) => {
  if (!showPriceSuggestions.value || filteredPriceOptions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedPriceIndex.value = Math.min(selectedPriceIndex.value + 1, filteredPriceOptions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedPriceIndex.value = Math.max(selectedPriceIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedPriceIndex.value >= 0) {
        selectPrice(filteredPriceOptions.value[selectedPriceIndex.value])
      }
      break
    case 'Escape':
      showPriceSuggestions.value = false
      selectedPriceIndex.value = -1
      break
  }
}

const selectPrice = (price: any) => {
  businessForm.price = price.value
  priceQuery.value = price.label
  showPriceSuggestions.value = false
  selectedPriceIndex.value = -1
}

const hidePriceSuggestions = () => {
  setTimeout(() => {
    showPriceSuggestions.value = false
    selectedPriceIndex.value = -1
  }, 150)
}

// Synchroniser categoryQuery avec la catégorie sélectionnée
watch(() => businessForm.category_id, (newCategoryId) => {
  const selectedCategory = categories.value.find(cat => cat.value === newCategoryId)
  if (selectedCategory) {
    categoryQuery.value = selectedCategory.label
  } else {
    categoryQuery.value = ''
  }
})

// Synchroniser priceQuery avec le prix sélectionné
watch(() => businessForm.price, (newPrice) => {
  const selectedPrice = priceOptions.find(price => price.value === newPrice)
  if (selectedPrice) {
    priceQuery.value = selectedPrice.label
  } else {
    priceQuery.value = ''
  }
})

// Fonctions pour la sélection des tags
const handleTagInput = () => {
  selectedTagIndex.value = -1
  showTagSuggestions.value = true
}

const handleTagKeydown = (event: KeyboardEvent) => {
  if (!showTagSuggestions.value || filteredTags.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedTagIndex.value = Math.min(selectedTagIndex.value + 1, filteredTags.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedTagIndex.value = Math.max(selectedTagIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedTagIndex.value >= 0) {
        addTag(filteredTags.value[selectedTagIndex.value])
      }
      break
    case 'Escape':
      showTagSuggestions.value = false
      selectedTagIndex.value = -1
      break
  }
}

const addTag = (tag: any) => {
  if (!selectedTags.value.includes(tag.id)) {
    selectedTags.value.push(tag.id)
    tagQuery.value = ''
    showTagSuggestions.value = false
    selectedTagIndex.value = -1
  }
}

const removeTag = (tagId: string) => {
  selectedTags.value = selectedTags.value.filter(id => id !== tagId)
}

const hideTagSuggestions = () => {
  setTimeout(() => {
    showTagSuggestions.value = false
    selectedTagIndex.value = -1
  }, 150)
}

const getTagName = (tagId: string) => {
  const tag = allTags.value.find(t => t.id === tagId)
  return tag?.name || tagId
}

// Fonction pour formater le numéro de téléphone
const formatPhoneNumber = (value: string) => {
  // Supprimer tous les caractères non numériques sauf le +
  const cleaned = value.replace(/[^\d+]/g, '')
  
  // Si commence par +33
  if (cleaned.startsWith('+33')) {
    const number = cleaned.slice(3)
    if (number.length <= 9) {
      return '+33 ' + number.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5').trim()
    }
  }
  // Si commence par 0
  else if (cleaned.startsWith('0')) {
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5').trim()
    }
  }
  
  return cleaned
}

// Gérer la saisie du téléphone avec formatage
const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formatted = formatPhoneNumber(target.value)
  businessForm.phone = formatted
}

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
        <div class="relative w-full">
          <input
            ref="categoryInput"
            v-model="categoryQuery"
            @input="handleCategoryInput"
            @keydown="handleCategoryKeydown"
            @focus="showCategorySuggestions = true"
            @blur="hideCategorySuggestions"
            :disabled="loading"
            placeholder="Sélectionnez une catégorie"
            class="w-full h-9 px-3 pr-10 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          
          <!-- Icône dropdown -->
          <UIcon 
            name="i-heroicons-chevron-down" 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
          />
          
          <!-- Dropdown des suggestions de catégories -->
          <div 
            v-if="showCategorySuggestions && filteredCategories.length > 0"
            class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div
              v-for="(category, index) in filteredCategories"
              :key="category.value"
              :class="[
                'px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2',
                { 'bg-blue-50 dark:bg-blue-900/30': index === selectedCategoryIndex }
              ]"
              @mousedown.prevent="selectCategory(category)"
            >
              <UIcon name="i-heroicons-tag" class="w-4 h-4 text-gray-400" />
              <span class="text-sm">{{ category.label }}</span>
            </div>
          </div>
        </div>
      </UFormField>

      <USeparator />

      <UFormField
        name="price"
        label="Niveau de prix"
        description="Gamme de prix de votre établissement."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <div class="relative w-full">
          <input
            ref="priceInput"
            v-model="priceQuery"
            @input="handlePriceInput"
            @keydown="handlePriceKeydown"
            @focus="showPriceSuggestions = true"
            @blur="hidePriceSuggestions"
            :disabled="loading"
            placeholder="Sélectionnez un niveau de prix"
            class="w-full h-9 px-3 pr-10 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          
          <!-- Icône dropdown -->
          <UIcon 
            name="i-heroicons-chevron-down" 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
          />
          
          <!-- Dropdown des options de prix -->
          <div 
            v-if="showPriceSuggestions"
            class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div
              v-for="(price, index) in filteredPriceOptions"
              :key="price.value"
              :class="[
                'px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2',
                { 'bg-blue-50 dark:bg-blue-900/30': index === selectedPriceIndex }
              ]"
              @mousedown.prevent="selectPrice(price)"
            >
              <span class="text-sm">{{ price.label }}</span>
            </div>
          </div>
        </div>
      </UFormField>

      <USeparator />

      <UFormField
        name="phone"
        label="Téléphone"
        description="Numéro de téléphone de contact."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="businessForm.phone"
          @input="handlePhoneInput"
          autocomplete="off"
          :disabled="loading"
          placeholder="Ex: 01 23 45 67 89 ou +33 1 23 45 67 89"
          class="w-full"
          color="secondary"
        />
      </UFormField>

      <USeparator />

      <!-- Tags -->
      <UFormField
        name="tags"
        label="Tags"
        description="Mots-clés pour décrire votre établissement (terrasse, WiFi, parking, etc.)"
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <div class="w-full space-y-3">
          <!-- Tags sélectionnés -->
          <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2">
            <UBadge
              v-for="tagId in selectedTags"
              :key="tagId"
              color="secondary"
              variant="subtle"
              class="flex items-center gap-1"
            >
              {{ getTagName(tagId) }}
              <UButton
                icon="i-heroicons-x-mark"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="removeTag(tagId)"
                class="ml-1 -mr-1"
              />
            </UBadge>
          </div>
          
          <!-- Input pour ajouter des tags -->
          <div class="relative">
            <input
              ref="tagInput"
              v-model="tagQuery"
              @input="handleTagInput"
              @keydown="handleTagKeydown"
              @focus="showTagSuggestions = true"
              @blur="hideTagSuggestions"
              :disabled="loading"
              placeholder="Rechercher et ajouter des tags..."
              class="w-full h-9 px-3 pr-10 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            
            <!-- Icône dropdown -->
            <UIcon 
              name="i-heroicons-chevron-down" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
            />
            
            <!-- Dropdown des suggestions de tags -->
            <div 
              v-if="showTagSuggestions && filteredTags.length > 0"
              class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <div
                v-for="(tag, index) in filteredTags"
                :key="tag.id"
                :class="[
                  'px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2',
                  { 'bg-blue-50 dark:bg-blue-900/30': index === selectedTagIndex }
                ]"
                @mousedown.prevent="addTag(tag)"
              >
                <UIcon name="i-heroicons-hashtag" class="w-4 h-4 text-gray-400" />
                <span class="text-sm">{{ tag.name }}</span>
              </div>
            </div>
          </div>
        </div>
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
