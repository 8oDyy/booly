<template>
    <section class="relative">
        <!-- Affichage avec photos -->
        <div v-if="businessPhotos.length > 0" class="grid grid-cols-4 gap-2 h-96 overflow-hidden">
            <div class="col-span-2 row-span-2">
                <img
                    :src="businessPhotos[0]?.url"
                    :alt="business.name"
                    class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    @load="console.log('✅ Image principale chargée:', businessPhotos[0]?.url)"
                    @error="console.error('❌ Erreur chargement image principale:', businessPhotos[0]?.url, $event)"
                />
            </div>
            <div
                v-for="(photo, index) in businessPhotos.slice(1, 5)"
                :key="photo.id"
                class="relative overflow-hidden cursor-pointer group"
            >
                <img
                    :src="photo.url"
                    :alt="`${business.name} photo ${index + 2}`"
                    class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    @load="console.log('✅ Image secondaire chargée:', photo.url)"
                    @error="console.error('❌ Erreur chargement image secondaire:', photo.url, $event)"
                />
                <div
                    v-if="index === 3 && businessPhotos.length > 5"
                    class="absolute inset-0 bg-black/60 flex items-center justify-center"
                >
                    <div class="text-white text-center">
                        <PlusIcon class="w-8 h-8 mx-auto mb-2" />
                        <span class="text-lg font-semibold">+{{ businessPhotos.length - 5 }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Placeholder sans photos -->
        <div v-else class="h-96 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <div class="text-center text-gray-500 dark:text-gray-400">
                <CameraIcon class="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p class="text-lg font-medium">Aucune photo disponible</p>
                <p class="text-sm">Les photos seront affichées ici une fois ajoutées</p>
            </div>
        </div>

        <!-- Overlay avec actions -->
        <div class="absolute top-4 left-4 right-4 flex justify-between items-start">
            <button
                @click="$router.go(-1)"
                class="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            >
                <ArrowLeftIcon class="w-5 h-5 text-gray-700" />
            </button>
      
            <div class="flex gap-2">
                <button
                    class="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                >
                    <HeartIcon
                        class="w-5 h-5"
                        :class="'text-red-500 fill-red-500'"
                    />
                </button>
                <button
                    class="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                >
                    <ShareIcon class="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </div>

        <!-- Badge de statut -->
        <div class="absolute bottom-4 left-4">
            <span
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                :class="business.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
                <div
                    class="w-2 h-2 rounded-full"
                    :class="business.isOpen ? 'bg-green-500' : 'bg-red-500'"
                ></div>
                {{ business.isOpen ? 'Ouvert' : 'Fermé' }}
            </span>
        </div>
    </section>
</template>


<script setup lang="ts">
import { computed, onMounted, watch, nextTick } from 'vue'
import { getOpeningStatus } from '~/composables/useOpeningStatus'
import { usePhotos } from '~/composables/usePhotos'

interface Profile {
  full_name: string | null
  avatar_url?: string | null
}

interface ReviewItem {
  id?: string
  rating: number
  content?: string | null
  created_at?: string | null
  profiles?: Profile
}

const props = defineProps<{ business: any }>()

// Charger les photos de l'établissement
const { photos, getPhotos } = usePhotos()

// Photos filtrées pour cet établissement
const businessPhotos = computed(() => {
  console.log('🔍 BusinessHeader - Toutes les photos:', photos.value.length)
  console.log('📋 BusinessHeader - Photos détail:', photos.value.map(p => ({ id: p.id, business_id: p.business_id, type: p.photo_type, url: p.url })))
  console.log('🏢 BusinessHeader - Business ID recherché:', props.business?.id)
  
  const filtered = photos.value.filter(photo => 
    photo.business_id === props.business?.id && 
    photo.photo_type === 'business_gallery'
  )
  console.log('🎯 BusinessHeader - Photos filtrées:', filtered.length, 'pour business:', props.business?.id)
  console.log('🖼️ BusinessHeader - URLs des photos filtrées:', filtered.map(p => p.url))
  return filtered
})

// Charger les photos au montage du composant
onMounted(async () => {
  console.log('🏢 BusinessHeader - Montage avec business:', props.business?.id)
  if (props.business?.id) {
    await getPhotos({ businessId: props.business.id, photoType: 'business_gallery' })
    console.log('📸 BusinessHeader - Photos après chargement:', photos.value.length)
  }
})

// Recharger si l'établissement change
watch(() => props.business?.id, async (newId) => {
  console.log('🔄 BusinessHeader - Changement business:', newId)
  if (newId) {
    await getPhotos({ businessId: newId, photoType: 'business_gallery' })
    console.log('📸 BusinessHeader - Photos après rechargement:', photos.value.length)
  }
}, { immediate: true })

// Forcer le rechargement des photos quand le composant devient visible
onMounted(() => {
  // Attendre que le business soit disponible
  nextTick(async () => {
    if (props.business?.id) {
      console.log('🔄 BusinessHeader - Rechargement forcé pour:', props.business.id)
      await getPhotos({ businessId: props.business.id, photoType: 'business_gallery' })
      console.log('📸 BusinessHeader - Photos forcées:', photos.value.length)
    }
  })
})

const openingInfo = computed(() => {
  const hours = props.business?.opening_hours ?? []
  try {
    return getOpeningStatus(hours)
  } catch (e) {
    return { open: false, message: '' }
  }
})

const reviewCount = computed(() => {
  return props.business?.review_count ?? props.business?.reviews?.length ?? 0
})

const avgFromReviews = computed(() => {
  const reviews: ReviewItem[] = props.business?.reviews ?? []
  if (!reviews.length) return 0
  const s = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((s / reviews.length) * 10) / 10
})

const displayRating = computed(() => {
  const v = props.business?.average_rating ?? avgFromReviews.value ?? 0
  return typeof v === 'number' ? v.toFixed(1) : Number(v || 0).toFixed(1)
})

const priceSymbols = computed(() => {
  const p = props.business?.price
  if (!p) return ''
  const n = Number(p)
  if (!n || Number.isNaN(n)) return ''
  return '€'.repeat(Math.max(1, Math.min(n, 4)))
})

import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  TagIcon,
  StarIcon,
  PhoneIcon,
  NavigationIcon,
  GlobeIcon,
  CheckIcon,
  PenToolIcon,
  ThumbsUpIcon,
  CameraIcon,
  MailIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon
} from 'lucide-vue-next'



const showWriteReview = ref(false)
const showAddPhoto = ref(false)

// Galerie photos
const photoGallery = ref({
  isOpen: false,
  currentIndex: 0,
  currentPhoto: null
})


const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}


</script>
