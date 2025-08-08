
<template>
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
        <div class="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <MapPinIcon class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-sm text-gray-600 mb-4">{{ fullAddress }}</p>
        <button
            @click="getDirections"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
            <NavigationIcon class="w-4 h-4" />
            Obtenir l'itinéraire
        </button>
    </div>

    <UCard>
        <template #header>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Horaires d'ouverture</h2>
        </template>
        <div class="space-y-4">
            <div v-for="d in weekHours" :key="d.label" class="flex justify-between items-center py-2">
                <span class="font-medium text-gray-900 capitalize">{{ d.label }}</span>
                <span class="text-gray-600">{{ d.hours }}</span>
            </div>
        </div>
    </UCard>

    <UCard>
        <template #header>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
        </template>
        <div class="space-y-4">
            <div v-if="business.phone" class="flex items-center gap-3">
                <PhoneIcon class="w-5 h-5 text-gray-400" />
                <span class="text-gray-700">{{ business.phone }}</span>
            </div>
            <div v-if="business.email" class="flex items-center gap-3">
              <MailIcon class="w-5 h-5 text-gray-400" />
              <span class="text-gray-700">{{ business.email }}</span>
            </div>
            <div class="flex items-start gap-3">
              <MapPinIcon class="w-5 h-5 text-gray-400 mt-0.5" />
              <span class="text-gray-700">{{ fullAddress }}</span>
            </div>
            <div v-if="business.website" class="flex items-center gap-3">
              <GlobeIcon class="w-5 h-5 text-gray-400" />
              <a
                :href="business.website"
                target="_blank"
                rel="noopener"
                class="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {{ business.website }}
              </a>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MapPinIcon, NavigationIcon, PhoneIcon, MailIcon, GlobeIcon } from 'lucide-vue-next'

interface OpeningHour {
  day_of_week: number
  opening_times: unknown | null
}

interface BusinessProps {
  id: string
  name: string
  address?: string | null
  city?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  opening_hours?: OpeningHour[] | null
}

const props = defineProps<{ business: BusinessProps }>()

const fullAddress = computed(() => {
  const parts = [props.business.address, props.business.city].filter(Boolean)
  return parts.join(', ')
})

const dayLabels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const weekHours = computed(() => {
  const map: Record<number, string[]> = {}
  const hrs = props.business.opening_hours ?? []
  for (const h of hrs) {
    const raw = h.opening_times ?? []
    const times = Array.isArray(raw)
      ? (raw as unknown[]).filter((t): t is string => typeof t === 'string')
      : (typeof raw === 'string' ? [raw] : [])
    map[h.day_of_week] = times
  }
  return dayLabels.map((label, i) => {
    const times = map[i] || []
    const hours = times.length ? times.join(', ') : 'Fermé'
    return { label, hours }
  })
})

const getDirections = () => {
  const q = fullAddress.value || props.business.name || ''
  if (typeof window !== 'undefined') {
    const url = `https://www.google.com/maps?q=${encodeURIComponent(q)}`
    window.open(url, '_blank')
  }
}
</script>
