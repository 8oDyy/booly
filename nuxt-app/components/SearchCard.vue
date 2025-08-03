<template>
  <UCard :to="`/business/${business.id}`" class="hover:shadow-lg transition-shadow">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Image du commerce -->
      <div class="w-full md:w-48 h-48 shrink-0">
        <img 
          :src="business.photo || '/img/placeholder-business.jpg'" 
          :alt="business.name"
          class="w-full h-full object-cover rounded-md"
        />
      </div>

      <!-- Informations du commerce -->
      <div class="flex-1 flex flex-col">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ business.name }}</h3>
            <div class="flex items-center mt-1">
              <URating :model-value="business.rating || 0" readonly />
              <span class="ml-2 text-sm text-gray-600">{{ business.reviewCount || 0 }} avis</span>
            </div>
            <div class="text-sm text-gray-600 mt-1">{{ business.category }}</div>
          </div>
          <UBadge v-if="isOpen" color="success" variant="subtle">Ouvert</UBadge>
          <UBadge v-else color="neutral" variant="subtle">Fermé</UBadge>
        </div>

        <!-- Adresse et contact -->
        <div class="mt-2 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-map-pin" class="shrink-0" />
            <span>{{ business.address }}, {{ business.city }}</span>
          </div>
          <div v-if="business.phone" class="flex items-center gap-1 mt-1">
            <UIcon name="i-heroicons-phone" class="shrink-0" />
            <span>{{ business.phone }}</span>
          </div>
        </div>

        <!-- Description courte -->
        <p class="mt-3 text-sm line-clamp-2">{{ business.description || 'Aucune description disponible.' }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

type Business = Database['public']['Tables']['businesses']['Row'] & {
  rating?: number
  reviewCount?: number
  photo?: string
}

const props = defineProps<{
  business: Business
}>()

// Simulation d'ouverture/fermeture - à remplacer par une logique réelle
const isOpen = computed(() => {
  // Logique simplifiée: ouvert si l'heure actuelle est entre 9h et 18h
  const now = new Date()
  const hour = now.getHours()
  return hour >= 9 && hour < 18
})
</script>
