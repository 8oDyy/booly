<template>
    <section class="relative">
        <div class="grid grid-cols-4 gap-2 h-96 overflow-hidden">
            <div class="col-span-2 row-span-2">
                <img
                    :src="business.photos[0]?.url"
                    :alt="business.name"
                    class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
            </div>
            <div
                v-for="(photo, index) in business.photos.slice(1, 5)"
                :key="photo.id"
                class="relative overflow-hidden cursor-pointer group"
            >
                <img
                    :src="photo.url"
                    :alt="`${business.name} photo ${index + 2}`"
                    class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <div
                    v-if="index === 3 && business.photos.length > 5"
                    class="absolute inset-0 bg-black/60 flex items-center justify-center"
                >
                    <div class="text-white text-center">
                        <PlusIcon class="w-8 h-8 mx-auto mb-2" />
                        <span class="text-lg font-semibold">+{{ business.photos.length - 5 }}</span>
                    </div>
                </div>
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
import { computed } from 'vue'
import { getOpeningStatus } from '~/composables/useOpeningStatus'

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
