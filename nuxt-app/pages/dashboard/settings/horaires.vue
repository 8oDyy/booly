<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const user = useSupabaseUser()
const { business, loading: businessLoading } = useBusinessManagement()
const { 
  openingHours, 
  loading, 
  error, 
  loadOpeningHours, 
  saveOpeningHours,
  applyBusinessHoursPreset,
  applyRetailHoursPreset,
  applyRestaurantHoursPreset,
  syncTimeSlots,
  copyDayToAll,
  isOpenNow,
  getNextOpeningTime
} = useOpeningHours()
const toast = useToast()

const daysOfWeek = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' }
]

const pending = ref(false)

// Charger les horaires quand l'entreprise change
watch(business, async (newBusiness) => {
  if (newBusiness?.id) {
    await loadOpeningHours(newBusiness.id)
  }
}, { immediate: true })

// Synchroniser les timeSlots manuellement lors de la sauvegarde

// Fonction pour copier les horaires d'un jour à tous les autres
function copyToAllDays(sourceDay: string) {
  copyDayToAll(sourceDay as keyof typeof openingHours.value)
  
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
      applyBusinessHoursPreset()
      break
    case 'retail':
      applyRetailHoursPreset()
      break
    case 'restaurant':
      applyRestaurantHoursPreset()
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
  console.log('🚀 saveHours - Début de la sauvegarde')
  console.log('🚀 saveHours - User ID:', user.value?.id)
  console.log('🚀 saveHours - Business:', business.value)
  
  if (!user.value?.id) {
    console.warn('⚠️ saveHours - Utilisateur non connecté')
    toast.add({
      title: 'Erreur',
      description: 'Vous devez être connecté pour modifier les horaires.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  if (!business.value) {
    console.warn('⚠️ saveHours - Entreprise manquante')
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
    
    console.log('🔄 saveHours - Horaires avant synchronisation:', JSON.parse(JSON.stringify(openingHours.value)))
    
    // Synchroniser les timeSlots avant la sauvegarde
    daysOfWeek.forEach(day => {
      console.log(`🔄 saveHours - Synchronisation ${day.key}`)
      const dayData = openingHours.value[day.key as keyof typeof openingHours.value]
      console.log(`🔄 saveHours - ${day.key} avant sync:`, dayData)
      syncTimeSlots(day.key as keyof typeof openingHours.value)
      console.log(`🔄 saveHours - ${day.key} après sync:`, openingHours.value[day.key as keyof typeof openingHours.value])
    })
    
    console.log('💾 saveHours - Horaires après synchronisation:', JSON.parse(JSON.stringify(openingHours.value)))
    
    // Sauvegarder les horaires via Supabase
    console.log('💾 saveHours - Appel saveOpeningHours avec business ID:', business.value.id)
    await saveOpeningHours(business.value.id, openingHours.value)
    
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
            <UCheckbox
              v-model="openingHours[day.key as keyof typeof openingHours].isOpen"
              color="secondary"
              :disabled="loading"
            />
            <span class="font-medium text-gray-900 dark:text-white">
              {{ day.label }}
            </span>
          </div>

          <!-- Horaires -->
          <div
            v-if="openingHours[day.key as keyof typeof openingHours].isOpen"
            class="flex items-center gap-3 flex-1"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">De</span>
              <UInput
                v-model="openingHours[day.key as keyof typeof openingHours].openTime"
                type="time"
                :disabled="loading"
                class="w-24"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">à</span>
              <UInput
                v-model="openingHours[day.key as keyof typeof openingHours].closeTime"
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
              v-if="openingHours[day.key as keyof typeof openingHours].isOpen"
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
              v-if="openingHours[day.key as keyof typeof openingHours].isOpen"
              class="text-sm text-green-600 dark:text-green-400"
            >
              {{ openingHours[day.key as keyof typeof openingHours].openTime }} - {{ openingHours[day.key as keyof typeof openingHours].closeTime }}
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
