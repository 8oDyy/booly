<template>
    <h2 class="text-lg font-semibold text-gray-900 mb-4 mt-8">Lieux similaires</h2>
    <UPageGrid :cols="{base: 1, md: 2, lg: 3}" class="gap-7">
        <UCard 
        v-for="business in popularBusinesses" 
        :key="business.id" 
        class="bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 overflow-hidden group"
        >
            <template #header>
                <div class="relative h-48 bg-gray-200 overflow-hidden">
                    <img 
                        :src="business.image" 
                        :alt="business.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500'; this.onerror=null;"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 right-4">
                        <div class="flex justify-between items-end">
                            <div>
                                <h3 class="text-xl font-bold text-white drop-shadow-sm">{{ business.name }}</h3>
                            </div>
                            <UBadge color="neutral" variant="solid" class="text-blue-700 shadow-sm">
                            <span class="flex items-center">
                                <UIcon name="i-heroicons-solid-star" class="mr-1 text-amber-500" />
                                {{ business.rating }}
                            </span>
                            </UBadge>
                        </div>
                        </div>
                </div>
            </template>
        
            <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                    <UBadge color="success" size="xs" class="bg-blue-100 text-blue-700 font-medium">Populaire</UBadge>
                    <UBadge color="success" variant="outline" size="xs" class="border-green-300 text-green-600">Ouvert</UBadge>
                </div>
        
                <p class="text-gray-700 mb-3 line-clamp-2 font-inter">{{ business.description }}</p>
        
                <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center text-gray-600">
                        <UIcon name="i-heroicons-solid-map-pin" class="w-4 h-4 text-blue-500 mr-1" />
                        <span>{{ business.address.split(',')[0] }}</span>
                    </div>
            
                    <div class="flex items-center text-gray-600">
                        <UIcon name="i-heroicons-solid-chat-bubble-left" class="w-4 h-4 text-blue-500 mr-1" />
                        <span>{{ business.reviewCount }} avis</span>
                    </div>
                </div>
        
                <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div class="flex items-center text-sm text-blue-600">
                        <UIcon name="i-heroicons-solid-check-badge" class="w-5 h-5 text-blue-500 mr-1" />
                        <span>Vérifié par NFC</span>
                    </div>
            
                    
                </div>
            </div>
        </UCard>
    </UPageGrid>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useBusinesses } from '~/composables/useBusinesses'

/**
 * Props minimales pour calculer les similaires
 * (si tu as déjà l'objet business courant, passe-le ici)
 */
const props = defineProps<{
  base: {
    id: string
    category_id?: string | null
    latitude?: number | null
    longitude?: number | null
    city?: string | null
  }
  /**
   * Options facultatives
   */
  options?: {
    limit?: number
    maxDistanceKm?: number
    minRating?: number
  }
}>()

const fallbackImg =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500'

const loading = ref(true)
const errorMsg = ref<string | null>(null)

// Résultat brut de l’API
const raw = ref<any[]>([])

// Mapping vers ce qu’attend ton template (popularBusinesses)
const popularBusinesses = computed(() =>
  raw.value.map((b) => {
    const img =
      b?.photos?.[0]?.url ||
      b?.image || // si jamais tu as déjà une URL image en DB
      fallbackImg

    return {
      id: b.id,
      name: b.name,
      image: img,
      rating: typeof b.average_rating === 'number' ? b.average_rating.toFixed(1) : '—',
      reviewCount:
        (typeof b.review_count === 'number' && b.review_count) ||
        // fallback si pas de colonne en BDD
        (Array.isArray(b.reviews) ? b.reviews.length : 0),
      description: b.description ?? '',
      address:
        // on recompose une adresse légère (ton template fait address.split(',')[0])
        b.address ??
        (b.city ? `${b.city}, France` : 'Adresse non renseignée'),
    }
  })
)

onMounted(async () => {
  const { getSimilarBusinesses } = useBusinesses()
  try {
    loading.value = true
    const { data, error } = await getSimilarBusinesses(
      {
        id: props.base.id,
        category_id: props.base.category_id ?? null,
        latitude: props.base.latitude ?? null,
        longitude: props.base.longitude ?? null,
        city: props.base.city ?? null,
      },
      {
        limit: props?.options?.limit ?? 3,
        maxDistanceKm: props?.options?.maxDistanceKm ?? 25,
        minRating: props?.options?.minRating ?? 0,
      }
    )

    if (error) {
      console.error(error)
      errorMsg.value = "Impossible de charger les lieux similaires."
      raw.value = []
    } else {
      raw.value = Array.isArray(data) ? data : []
    }
  } catch (e) {
    console.error(e)
    errorMsg.value = "Une erreur est survenue."
    raw.value = []
  } finally {
    loading.value = false
  }
})
</script>

