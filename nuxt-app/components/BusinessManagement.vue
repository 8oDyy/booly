<template>
  <div class="space-y-6">
    <!-- Formulaire de création/modification -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ editingBusiness ? 'Modifier l\'établissement' : 'Créer un nouvel établissement' }}
          </h3>
          <UButton 
            v-if="editingBusiness" 
            color="neutral" 
            variant="ghost" 
            icon="i-heroicons-x-mark"
            @click="cancelEdit"
          >
            Annuler
          </UButton>
        </div>
      </template>
      
      <UForm 
        :state="businessForm" 
        @submit="submitBusiness"
        class="space-y-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Informations de base -->
          <div class="space-y-4">
            <UFormGroup label="Nom de l'établissement" name="name" required>
              <UInput 
                v-model="businessForm.name" 
                placeholder="Ex: Restaurant Le Gourmet"
                icon="i-heroicons-building-storefront"
              />
            </UFormGroup>
            
            <UFormGroup label="Description" name="description">
              <UTextarea 
                v-model="businessForm.description" 
                placeholder="Décrivez votre établissement..."
                :rows="3"
              />
            </UFormGroup>
            
            <UFormGroup label="Catégorie" name="category_id" required>
              <USelect
                v-model="businessForm.category_id"
                :options="categoryOptions"
                placeholder="Sélectionnez une catégorie"
                icon="i-heroicons-tag"
              />
            </UFormGroup>
          </div>
          
          <!-- Informations de contact -->
          <div class="space-y-4">
            <UFormGroup label="Adresse" name="address" required>
              <UInput 
                v-model="businessForm.address" 
                placeholder="123 Rue de la Paix"
                icon="i-heroicons-map-pin"
              />
            </UFormGroup>
            
            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Ville" name="city" required>
                <UInput 
                  v-model="businessForm.city" 
                  placeholder="Paris"
                />
              </UFormGroup>
              
              <UFormGroup label="Code postal" name="postal_code" required>
                <UInput 
                  v-model="businessForm.postal_code" 
                  placeholder="75001"
                />
              </UFormGroup>
            </div>
            
            <UFormGroup label="Téléphone" name="phone">
              <UInput 
                v-model="businessForm.phone" 
                placeholder="01 23 45 67 89"
                icon="i-heroicons-phone"
              />
            </UFormGroup>
            
            <UFormGroup label="Site web" name="website">
              <UInput 
                v-model="businessForm.website" 
                placeholder="https://monrestaurant.com"
                icon="i-heroicons-globe-alt"
              />
            </UFormGroup>
          </div>
        </div>
        
        <div class="flex justify-end gap-2">
          <UButton 
            v-if="editingBusiness" 
            color="neutral" 
            variant="ghost" 
            @click="cancelEdit"
          >
            Annuler
          </UButton>
          <UButton 
            type="submit" 
            :loading="submitting"
            icon="i-heroicons-check"
          >
            {{ editingBusiness ? 'Mettre à jour' : 'Créer l\'établissement' }}
          </UButton>
        </div>
      </UForm>
    </UCard>
    
    <!-- Liste des établissements -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Mes établissements</h3>
      </template>
      
      <div v-if="props.businesses.length === 0" class="text-center py-8 text-gray-500">
        <div class="mb-4">
          <UIcon name="i-heroicons-building-storefront" class="w-12 h-12 mx-auto text-gray-400" />
        </div>
        <p class="text-lg mb-2">Aucun établissement</p>
        <p class="text-sm">Créez votre premier établissement pour commencer</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="business in props.businesses" 
          :key="business.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <UIcon :name="getCategoryIcon(business.category_id)" class="w-5 h-5 text-primary-500" />
                <h4 class="font-semibold text-lg">{{ business.name }}</h4>
                <UBadge 
                  v-if="business.average_rating" 
                  color="primary" 
                  variant="soft"
                >
                  ⭐ {{ business.average_rating.toFixed(1) }}
                </UBadge>
              </div>
              
              <p v-if="business.description" class="text-gray-600 mb-2">
                {{ business.description }}
              </p>
              
              <div class="flex flex-wrap gap-2 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                  {{ business.address }}, {{ business.city }}
                </span>
                <span v-if="business.phone" class="flex items-center gap-1">
                  <UIcon name="i-heroicons-phone" class="w-4 h-4" />
                  {{ business.phone }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4" />
                  {{ business.review_count || 0 }} avis
                </span>
              </div>
            </div>
            
            <div class="flex gap-2 ml-4">
              <UButton 
                color="neutral" 
                variant="ghost" 
                size="sm"
                icon="i-heroicons-pencil"
                @click="editBusiness(business)"
              >
                Modifier
              </UButton>
              <UButton 
                color="error" 
                variant="ghost" 
                size="sm"
                icon="i-heroicons-trash"
                @click="confirmDelete(business)"
              >
                Supprimer
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>
    
    <!-- Modal de confirmation de suppression -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Confirmer la suppression</h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="showDeleteModal = false" />
          </div>
        </template>
        
        <div class="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer cet établissement ?</p>
          <p class="text-sm text-gray-600">
            Cette action est irréversible et supprimera également tous les avis et données associés.
          </p>
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" @click="showDeleteModal = false">Annuler</UButton>
            <UButton color="error" :loading="deleting" @click="deleteBusiness">
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
  categories: any[]
}

interface Emits {
  (e: 'business-updated'): void
  (e: 'business-created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// État réactif
const editingBusiness = ref(null)
const submitting = ref(false)
const showDeleteModal = ref(false)
const businessToDelete = ref(null)
const deleting = ref(false)

// Formulaire
const businessForm = ref({
  name: '',
  description: '',
  address: '',
  city: '',
  postal_code: '',
  country: 'France',
  phone: '',
  website: '',
  category_id: ''
})

// Options pour le select des catégories
const categoryOptions = computed(() => {
  return props.categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
})

// Méthodes
function resetForm() {
  businessForm.value = {
    name: '',
    description: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    phone: '',
    website: '',
    category_id: ''
  }
}

function editBusiness(business: any) {
  editingBusiness.value = business
  businessForm.value = {
    name: business.name || '',
    description: business.description || '',
    address: business.address || '',
    city: business.city || '',
    postal_code: business.postal_code || '',
    country: business.country || 'France',
    phone: business.phone || '',
    website: business.website || '',
    category_id: business.category_id || ''
  }
}

function cancelEdit() {
  editingBusiness.value = null
  resetForm()
}

async function submitBusiness() {
  if (!user.value) return
  
  submitting.value = true
  
  try {
    const businessData = {
      ...businessForm.value,
      owner_id: user.value.id
    }
    
    let error
    
    if (editingBusiness.value) {
      // Mise à jour
      const { error: updateError } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', editingBusiness.value.id)
      
      error = updateError
      
      toast.add({
        title: 'Établissement mis à jour',
        description: 'Les modifications ont été enregistrées avec succès',
        color: 'success'
      })
      
      emit('business-updated')
      cancelEdit()
    } else {
      // Création
      const { error: insertError } = await supabase
        .from('businesses')
        .insert([businessData])
      
      error = insertError
      
      toast.add({
        title: 'Établissement créé',
        description: 'Votre nouvel établissement a été créé avec succès',
        color: 'success'
      })
      
      emit('business-created')
      resetForm()
    }
    
    if (error) throw error
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de sauvegarder l\'établissement',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

function confirmDelete(business: any) {
  businessToDelete.value = business
  showDeleteModal.value = true
}

async function deleteBusiness() {
  if (!businessToDelete.value) return
  
  deleting.value = true
  
  try {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessToDelete.value.id)
    
    if (error) throw error
    
    toast.add({
      title: 'Établissement supprimé',
      description: 'L\'établissement a été supprimé avec succès',
      color: 'success'
    })
    
    showDeleteModal.value = false
    businessToDelete.value = null
    emit('business-updated')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer l\'établissement',
      color: 'error'
    })
  } finally {
    deleting.value = false
  }
}

function getCategoryIcon(categoryId: string) {
  const category = props.categories.find(cat => cat.id === categoryId)
  return category?.icon || 'i-heroicons-building-storefront'
}
</script>
