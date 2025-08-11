<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Gérer mon établissement</h1>
      <UButton color="primary" @click="startCreatingBusiness">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un établissement
      </UButton>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="!business && !isCreatingMode" class="text-center py-12">
      <p class="text-gray-500 mb-4">Aucun établissement trouvé</p>
      <UButton color="primary" @click="startCreatingBusiness">Ajouter un établissement</UButton>
    </div>

    <div v-else-if="business || isCreatingMode" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div v-if="isCreatingMode" class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Créer un nouvel établissement</h2>
        <p class="text-sm text-gray-600 mt-1">Remplissez les informations de votre établissement</p>
      </div>
      <form @submit.prevent="isCreatingMode ? createBusiness() : saveBusiness()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'établissement *
            </label>
            <UInput 
              v-model="businessForm.name" 
              placeholder="Nom de votre établissement"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select 
              v-model="businessForm.category_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              <option 
                v-for="category in allCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Niveau de prix
            </label>
            <select 
              v-model="businessForm.price"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner le niveau de prix</option>
              <option value="1">€ - Économique</option>
              <option value="2">€€ - Modéré</option>
              <option value="3">€€€ - Cher</option>
              <option value="4">€€€€ - Très cher</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <UTextarea 
              v-model="businessForm.description" 
              placeholder="Décrivez votre établissement..."
              :rows="4"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <UInput 
              v-model="businessForm.phone" 
              placeholder="01 23 45 67 89"
              type="tel"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <UInput 
              v-model="businessForm.address" 
              placeholder="Adresse complète"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <UInput 
              v-model="businessForm.city" 
              placeholder="Ville"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Code postal *
            </label>
            <UInput 
              v-model="businessForm.postal_code" 
              placeholder="75000"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Pays
            </label>
            <UInput 
              v-model="businessForm.country" 
              placeholder="France"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            <UInput 
              v-model="businessForm.website" 
              placeholder="https://www.monrestaurant.fr"
              type="url"
            />
          </div>
        </div>

        <!-- Coordonnées GPS -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Coordonnées GPS (optionnel)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <UInput 
                v-model="businessForm.latitude" 
                placeholder="48.8566"
                type="number"
                step="any"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <UInput 
                v-model="businessForm.longitude" 
                placeholder="2.3522"
                type="number"
                step="any"
              />
            </div>
          </div>

          
        </div>

        <div class="flex justify-end space-x-3">
          <UButton variant="outline" @click="isCreatingMode ? cancelCreation() : resetForm()">
            Annuler
          </UButton>
          <UButton type="submit" :loading="isCreatingMode ? isCreating : isSaving">
            {{ isCreatingMode ? 'Créer l\'établissement' : 'Enregistrer les modifications' }}
          </UButton>
        </div>
      </form>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useBusinessCrud } from '~/composables/useBusinessCrud'
import { useCategories } from '~/composables/useCategories'
import type { BusinessFormData } from '~/composables/useBusinessCrud'

const { 
  getUserBusinesses, 
  createBusiness: createBusinessInDb, 
  updateBusiness: updateBusinessInDb, 
  validateBusinessData,
  createEmptyBusinessForm,
  businessToFormData
} = useBusinessCrud()

const { fetchCategories } = useCategories()

const isLoading = ref(true)
const isSaving = ref(false)
const business = ref<any>(null)

// État pour le mode création
const isCreatingMode = ref(false)
const isCreating = ref(false)
const allCategories = ref<any[]>([])

// Utiliser le type BusinessFormData du composable
const businessForm = reactive<BusinessFormData>(createEmptyBusinessForm())

// Plus besoin des options formatées pour USelect, on utilise directement allCategories



const loadBusiness = async () => {
  isLoading.value = true
  try {
    // Charger les catégories
    console.log('🔧 Chargement des catégories...')
    allCategories.value = await fetchCategories()
    console.log('🔧 Catégories chargées:', allCategories.value)
    
    // Charger les établissements de l'utilisateur
    const businesses = await getUserBusinesses()
    console.log('🔧 Établissements chargés:', businesses)
    
    if (businesses && businesses.length > 0) {
      business.value = businesses[0] // Prendre le premier établissement
      
      // Pré-remplir le formulaire avec les données existantes
      Object.assign(businessForm, businessToFormData(business.value))
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'établissement:', error)
  } finally {
    isLoading.value = false
  }
}

const saveBusiness = async () => {
  isSaving.value = true
  try {
    // Valider les données
    const validation = validateBusinessData(businessForm)
    if (!validation.isValid) {
      console.error('Erreurs de validation:', validation.errors)
      // TODO: Afficher les erreurs à l'utilisateur
      return
    }

    if (business.value?.id) {
      // Mise à jour d'un établissement existant
      const updatedBusiness = await updateBusinessInDb(business.value.id, businessForm)
      if (updatedBusiness) {
        business.value = updatedBusiness
        console.log('Établissement mis à jour avec succès')
        // TODO: Afficher une notification de succès
      }
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // TODO: Afficher une notification d'erreur
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  if (business.value) {
    Object.assign(businessForm, {
      name: business.value.name || '',
      phone: business.value.phone || '',
      address: business.value.address || '',
      city: business.value.city || '',
      postal_code: business.value.postal_code || '',
      description: business.value.description || '',
      website: business.value.website || '',
      email: business.value.email || ''
    })
  }
}

const startCreatingBusiness = () => {
   // Test simple pour vérifier que la fonction est appelée
  console.log('startCreatingBusiness appelé')
  console.log('isCreatingMode avant:', isCreatingMode.value)
  isCreatingMode.value = true
  console.log('isCreatingMode après:', isCreatingMode.value)
  
  // Réinitialiser le formulaire pour la création
  Object.assign(businessForm, {
    name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    description: '',
    website: '',
  })
  console.log('Formulaire réinitialisé pour la création')
}

const cancelCreation = () => {
  isCreatingMode.value = false
  // Si on a un établissement existant, recharger ses données
  if (business.value) {
    Object.assign(businessForm, businessToFormData(business.value))
  } else {
    // Sinon, vider le formulaire
    Object.assign(businessForm, createEmptyBusinessForm())
  }
}

const createBusiness = async () => {
  isCreating.value = true
  try {
    // Valider les données
    const validation = validateBusinessData(businessForm)
    if (!validation.isValid) {
      console.error('Erreurs de validation:', validation.errors)
      // TODO: Afficher les erreurs à l'utilisateur
      return
    }

    // Créer l'établissement via Supabase
    const newBusiness = await createBusinessInDb(businessForm)
    
    if (newBusiness) {
      // Sortir du mode création et recharger les données
      isCreatingMode.value = false
      business.value = newBusiness
      Object.assign(businessForm, businessToFormData(newBusiness))
      
      console.log('Établissement créé avec succès')
      // TODO: Afficher une notification de succès
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'établissement:', error)
    // TODO: Afficher une notification d'erreur
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  loadBusiness()
})
</script>
