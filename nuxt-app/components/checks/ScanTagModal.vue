<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChecksManagement } from '~/composables/dashboard/useChecksManagement'
import { useBusinesses } from '~/composables/useBusinesses'

interface Emits {
  (e: 'created'): void
}

const emit = defineEmits<Emits>()

const { createScanTag } = useChecksManagement()
const { searchBusinesses } = useBusinesses()

  // État du formulaire
const form = ref({
  code: '',
  label: '',
  type: 'QR' as 'QR' | 'NFC',
  businessId: ''
})

const businesses = ref<Array<{id: string, name: string}>>([])  
const pending = ref(false)
const error = ref('')

const selectedBusiness = ref<{id: string, name: string} | null>(null)

// Charger les établissements de l'utilisateur
const loadBusinesses = async () => {
  try {
    const result = businesses.value
    console.log(result)
  } catch (err) {
    console.error('Erreur lors du chargement des établissements:', err)
  }
}

const businessOptions = computed(() => {
  return businesses.value.map((business: any) => ({
    label: business.name,
    value: business.id
  }))
})

// Générer un code aléatoirement
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.value.code = result
}

// Options pour le type de tag
const typeOptions = [
  { label: 'QR Code', value: 'QR' },
  { label: 'NFC Tag', value: 'NFC' }
]

// Validation du formulaire
const isFormValid = computed(() => {
  return form.value.code.trim() !== '' && 
         form.value.label.trim() !== '' && 
         form.value.businessId !== ''
})

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    code: '',
    label: '',
    type: 'QR',
    businessId: ''
  }
  selectedBusiness.value = null
  error.value = ''
}

// Charger les données au montage
onMounted(() => {
  loadBusinesses()
})

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    pending.value = true
    error.value = ''

    await createScanTag({
      code: form.value.code.trim(),
      label: form.value.label.trim() || undefined,
      type: form.value.type,
      businessId: form.value.businessId
    })

    // Réinitialiser le formulaire
    resetForm()
    emit('created')
  } catch (err) {
    console.error('Erreur lors de la création du scan tag:', err)
    error.value = 'Erreur lors de la création du scan tag'
  } finally {
    pending.value = false
  }
}


</script>

<template>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Créer un nouveau Scan Tag
          </h3>
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Sélection de l'établissement -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Établissement <span class="text-red-500">*</span>
          </label>
          <USelect
            v-model="form.businessId"
            :options="businessOptions"
            placeholder="Sélectionner un établissement"
            :disabled="businesses.length === 0"
          />
        </div>

        <!-- Type de tag -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type de tag <span class="text-red-500">*</span>
          </label>
          <USelect
            v-model="form.type"
            :options="typeOptions"
          />
        </div>

        <!-- Code du tag -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Code du tag <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <UInput
              v-model="form.code"
              placeholder="Ex: ABCD1234"
              class="flex-1"
              :maxlength="20"
            />
            <UButton
              type="button"
              icon="i-lucide-shuffle"
              variant="outline"
              @click="generateRandomCode"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Code unique pour identifier ce tag (8 caractères recommandés)
          </p>
        </div>

        <!-- Label optionnel -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Label (optionnel)
          </label>
          <UInput
            v-model="form.label"
            placeholder="Ex: Caisse principale, Comptoir..."
            :maxlength="50"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Nom descriptif pour identifier facilement ce tag
          </p>
        </div>

        <!-- Erreur -->
        <UAlert
          v-if="error"
          icon="i-lucide-alert-circle"
          color="error"
          variant="soft"
          :title="error"
        />
      </form>
    </UCard>
</template>
