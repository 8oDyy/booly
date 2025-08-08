<template>
    <!-- Description -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
      <p class="text-gray-700 leading-relaxed">{{ business.description }}</p>
      
      <div v-if="business.amenities?.length" class="mt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-3">Équipements et services</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="amenity in business.amenities"
            :key="amenity"
            class="flex items-center gap-2 text-sm text-gray-600"
          >
            <CheckIcon class="w-4 h-4 text-green-500" />
            <span>{{ amenity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Avis récents -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Avis récents</h2>
        <button
          class="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Voir tous les avis
        </button>
      </div>
      
      <div class="space-y-6">
        <div v-for="review in recentReviews" :key="review.id">
          <div class="flex items-start gap-4">
            <img
              :src="review.profiles?.avatar_url"
              :alt="review.profiles?.full_name || 'Utilisateur'"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h4 class="font-medium text-gray-900">{{ review.profiles?.full_name || 'Utilisateur' }}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="flex items-center">
                      <StarIcon
                        v-for="i in 5"
                        :key="i"
                        class="w-4 h-4"
                        :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                      />
                    </div>
                    <span class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</span>
                  </div>
                </div>
              </div>
              <p class="text-gray-700 text-sm leading-relaxed">{{ review.content }}</p>
              
              <div v-if="review.photos?.length" class="flex gap-2 mt-3">
                <img
                  v-for="photo in review.photos?.slice(0, 3)"
                  :key="photo.id"
                  :src="photo.url"
                  class="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>



<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, StarIcon } from 'lucide-vue-next'

const props = defineProps<{ business: any }>()

interface Profile {
  full_name: string | null;
  avatar_url?: string | null
}

interface ReviewItem {
  id?: string
  rating: number
  content?: string | null
  created_at?: string | null
  profiles?: Profile
  photos?: any[]
}


const dayLabels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const recentReviews = computed(() => {
  const list = [...(props.business?.reviews ?? [])]
  return list
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 3)
})

const weekHours = computed(() => {
  const map: Record<number, string[]> = {}
  const hrs = props.business?.opening_hours ?? []
  for (const h of hrs) {
    map[h.day_of_week] = h.opening_times || []
  }
  return dayLabels.map((label, i) => ({ label, times: map[i] || [] }))
})
</script>
