<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
const { business, loading, error, saveOpeningHours, getOpeningHours } = useBusinessManagement()
const toast = useToast()

// Structure pour les horaires d'ouverture
interface OpeningHours {
  [key: string]: {
    isOpen: boolean
    openTime: string
    closeTime: string
  }
}

const daysOfWeek = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' }
]

// Horaires par défaut
const defaultHours: OpeningHours = {
  monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  saturday: { isOpen: true, openTime: '10:00', closeTime: '17:00' },
  sunday: { isOpen: false, openTime: '10:00', closeTime: '17:00' }
}

const openingHours = ref<OpeningHours>({ ...defaultHours })
const pending = ref(false)

// Charger les horaires existants depuis Supabase
const loadExistingHours = () => {
  if (business.value) {
    const savedHours = getOpeningHours()
    if (savedHours) {
      console.log('🕒 Horaires chargés depuis Supabase:', savedHours)
      openingHours.value = { ...savedHours }
    }
  }
}

// Charger les horaires quand l'entreprise change
watch(business, () => {
  loadExistingHours()
}, { immediate: true })

// Fonction pour copier les horaires d'un jour à tous les autres
function copyToAllDays(sourceDay: string) {
  const sourceHours = openingHours.value[sourceDay]
  for (const day of daysOfWeek) {
    if (day.key !== sourceDay) {
      openingHours.value[day.key] = { ...sourceHours }
    }
  }
  
  toast.add({
    title: 'Succès',
    description: `Horaires du ${daysOfWeek.find(d => d.key === sourceDay)?.label} copiés sur tous les jours.`,
    icon: 'i-lucide-check',
    color: 'success'
  })
}

// Fonction pour appliquer des horaires prédéfinis
function applyPreset(preset: 'business' | 'retail' | 'restaurant') {
  switch (preset) {
    case 'business':
      daysOfWeek.forEach(day => {
        if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key)) {
          openingHours.value[day.key] = { isOpen: true, openTime: '09:00', closeTime: '18:00' }
        } else {
          openingHours.value[day.key] = { isOpen: false, openTime: '10:00', closeTime: '17:00' }
        }
      })
      break
    case 'retail':
      daysOfWeek.forEach(day => {
        if (day.key === 'sunday') {
          openingHours.value[day.key] = { isOpen: true, openTime: '14:00', closeTime: '18:00' }
        } else {
          openingHours.value[day.key] = { isOpen: true, openTime: '10:00', closeTime: '19:00' }
        }
      })
      break
    case 'restaurant':
      daysOfWeek.forEach(day => {
        if (day.key === 'monday') {
          openingHours.value[day.key] = { isOpen: false, openTime: '12:00', closeTime: '22:00' }
        } else {
          openingHours.value[day.key] = { isOpen: true, openTime: '12:00', closeTime: '22:00' }
        }
      })
      break
  }
  
  toast.add({
    title: 'Succès',
    description: 'Horaires prédéfinis appliqués.',
    icon: 'i-lucide-check',
    color: 'success'
  })
}

// Sauvegarde des horaires
async function saveHours() {
  if (!user.value?.id) {
    toast.add({
      title: 'Erreur',
      description: 'Vous devez être connecté pour modifier les horaires.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  if (!business.value) {
    toast.add({
      title: 'Erreur',
      description: 'Vous devez d\'abord créer votre établissement.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  try {
    pending.value = true
    
    // Sauvegarder les horaires via Supabase
    await saveOpeningHours(openingHours.value)
    
    toast.add({
      title: 'Succès',
      description: 'Horaires d\'ouverture sauvegardés avec succès.',
      icon: 'i-lucide-check',
      color: 'success'
    })

  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de sauvegarder les horaires.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div>
    <UPageCard
      title="Horaires d'ouverture"
      description="Définissez les horaires d'ouverture de votre établissement."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Sauvegarder"
        color="neutral"
        :loading="pending || loading"
        :disabled="loading"
        class="w-fit lg:ms-auto"
        @click="saveHours"
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
      <!-- Presets rapides -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Horaires prédéfinis
        </h4>
        <div class="flex flex-wrap gap-2">
          <UButton
            label="Bureau (9h-18h, Lu-Ve)"
            color="neutral"
            variant="soft"
            size="sm"
            @click="applyPreset('business')"
          />
          <UButton
            label="Commerce (10h-19h, 7j/7)"
            color="neutral"
            variant="soft"
            size="sm"
            @click="applyPreset('retail')"
          />
          <UButton
            label="Restaurant (12h-22h, fermé lundi)"
            color="neutral"
            variant="soft"
            size="sm"
            @click="applyPreset('restaurant')"
          />
        </div>
      </div>

      <USeparator />

      <!-- Horaires par jour -->
      <div class="space-y-4">
        <div
          v-for="day in daysOfWeek"
          :key="day.key"
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <!-- Jour et toggle -->
          <div class="flex items-center gap-3 min-w-[120px]">
            <UToggle
              v-model="openingHours[day.key].isOpen"
              :disabled="loading"
            />
            <span class="font-medium text-gray-900 dark:text-white">
              {{ day.label }}
            </span>
          </div>

          <!-- Horaires -->
          <div
            v-if="openingHours[day.key].isOpen"
            class="flex items-center gap-3 flex-1"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">De</span>
              <UInput
                v-model="openingHours[day.key].openTime"
                type="time"
                :disabled="loading"
                class="w-24"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">à</span>
              <UInput
                v-model="openingHours[day.key].closeTime"
                type="time"
                :disabled="loading"
                class="w-24"
              />
            </div>
          </div>
          
          <div
            v-else
            class="flex-1 text-sm text-gray-500"
          >
            Fermé
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <UButton
              v-if="openingHours[day.key].isOpen"
              label="Copier à tous"
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-copy"
              :disabled="loading"
              @click="copyToAllDays(day.key)"
            />
          </div>
        </div>
      </div>

      <!-- Résumé visuel -->
      <USeparator />
      
      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Résumé des horaires
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="day in daysOfWeek"
            :key="`summary-${day.key}`"
            class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <span class="font-medium text-sm">{{ day.label }}</span>
            <span
              v-if="openingHours[day.key].isOpen"
              class="text-sm text-green-600 dark:text-green-400"
            >
              {{ openingHours[day.key].openTime }} - {{ openingHours[day.key].closeTime }}
            </span>
            <span
              v-else
              class="text-sm text-red-600 dark:text-red-400"
            >
              Fermé
            </span>
          </div>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
