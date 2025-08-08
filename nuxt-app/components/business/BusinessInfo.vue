<template>
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div class="flex-1">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ business.name }}</h1>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <MapPinIcon class="w-4 h-4" />
                    <span>{{ business.address }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <TagIcon class="w-4 h-4" />
                    <span>{{ categoryDisplay }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rating et avis -->
            <div class="flex items-center gap-4 mb-4">
              <div class="flex items-center gap-2">
                <div class="flex items-center">
                  <StarIcon
                    v-for="i in 5"
                    :key="i"
                    class="w-5 h-5"
                    :class="i <= (business.average_rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
                  />
                </div>
                <span class="text-xl font-semibold text-gray-900">{{ (business.average_rating ?? 0).toFixed(1) }}</span>
                <span class="text-gray-600">({{ business.review_count ?? 0 }} avis)</span>
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Gamme de prix:</span>
                <span class="text-sm font-medium">{{ business.price }}</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
                <UBadge
                    v-for="(tag, i) in displayTags"
                    :key="i"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    >
                    {{ tag }}
                </UBadge>
            </div>
          </div>

          <!-- Actions principales -->
          <div class="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-64">
            <button
              v-if="business.phone"
              class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <PhoneIcon class="w-5 h-5" />
              Appeler
            </button>
            
            <button
              class="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <NavigationIcon class="w-5 h-5" />
              Itinéraire
            </button>
            
            <button
              v-if="business.website"
              class="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <GlobeIcon class="w-5 h-5" />
              Site web
            </button>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Profile {
  full_name: string | null
  avatar_url?: string | null
}

interface Props {
  business: {
    id: string
    name: string
    address: string | null
    price: string | null
    phone: string | null
    website: string | null
    category?: { id: string; name: string; slug: string } | null
    photos?: Array<{ url: string; description: string | null }>
    average_rating?: number | null
    review_count?: number | null
    business_tags?: Array<{
      tag?: { id: string; name: string } | null
    }>
    opening_hours?: any[]
    last_review_content?: string | null
    last_review_date?: string | null
    last_review_author?: string | null
    city?: string | null
  }
}


const props = defineProps<Props>()

const mappedBusiness = {
  ...props.business, // données brutes de Supabase
  business_tags: (props.business.business_tags ?? []).map((bt) => ({
    tag: bt.tag ?? undefined // ⬅️ convertit null → undefined
  }))
}

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



const categoryDisplay = computed(() => {
  const cat = mappedBusiness.category
  if (!cat) return ''
  if (typeof cat === 'string') return cat
  return cat?.name ?? ''
})

const displayTags = computed(() =>
  (mappedBusiness.business_tags ?? [])
    .map(bt => bt.tag?.name)
    .filter(Boolean)
)


</script>
