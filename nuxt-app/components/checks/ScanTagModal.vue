<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChecksManagement } from '~/composables/dashboard/useChecksManagement'
import { useBusinesses } from '~/composables/useBusinesses'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { createScanTag } = useChecksManagement()
const { searchBusinesses } = useBusinesses()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

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
    const result = await searchBusinesses({}, 1, 50)
    businesses.value = result.data.map(business => ({
      id: business.id,
      name: business.name
    }))
    
    // Sélectionner le premier établissement par défaut
    if (businesses.value.length > 0) {
      form.value.businessId = businesses.value[0].id
    }
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
         form.value.businessId !== '' &&
         (form.value.type === 'QR' || form.value.type === 'NFC')
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
    form.value = {
      code: '',
      label: '',
      type: 'QR',
      businessId: businesses.value[0]?.id || ''
    }

    emit('created')
    emit('update:open', false)
  } catch (err) {
    console.error('Erreur lors de la création du scan tag:', err)
    error.value = 'Erreur lors de la création du scan tag'
  } finally {
    pending.value = false
  }
}

// Charger les établissements quand le modal s'ouvre
watch(() => props.open, (newValue) => {
  if (newValue) {
    loadBusinesses()
    generateRandomCode() // Générer un code par défaut
  }
})
</script>

<template>
  <UModal v-model="isOpen" :ui="{ wrapper: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Créer un Scan Tag
          </h3>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            size="sm"
            @click="isOpen = false"
          />
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
            :options="businesses"
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

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <UButton
            type="button"
            variant="ghost"
            @click="isOpen = false"
          >
            Annuler
          </UButton>
          <UButton
            type="submit"
            :loading="pending"
            :disabled="!isFormValid"
          >
            Créer le Tag
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>
