<template>
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div class="flex items-center gap-4">
                <select
                v-model="reviewFilter"
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">Tous les avis</option>
                    <option value="5">5 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="2">2 étoiles</option>
                    <option value="1">1 étoile</option>
                </select>
                
                <select
                v-model="reviewSort"
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="highest">Meilleures notes</option>
                <option value="lowest">Notes les plus basses</option>
                </select>
            </div>
        </div>
    </div>

    <div v-if="!paginatedReviews.length" class="p-6 text-gray-500 text-sm">Aucun avis pour le moment.</div>

    <ul v-else class="divide-y">
      <li v-for="(r, idx) in paginatedReviews" :key="reviewKey(r, idx)" class="p-4 flex gap-3">
        <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
          <span class="text-sm">{{ initials(r.profiles?.full_name) }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900">
              {{ r.profiles?.full_name || 'Utilisateur' }}
            </p>
            <p class="text-xs text-gray-500">{{ formatDate(r.created_at) }}</p>
          </div>
          <div class="mt-1 text-yellow-500 text-sm">
            <span v-for="i in 5" :key="i">{{ i <= Math.round(Number(r.rating) || 0) ? '★' : '☆' }}</span>
            <span class="ml-2 text-gray-700">{{ Number(r.rating).toFixed(1) }}</span>
          </div>
          <p v-if="r.content" class="mt-2 text-gray-700 whitespace-pre-line">
            {{ r.content }}
          </p>
          <div class="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <button class="hover:text-blue-600">Utile</button>
            <button class="hover:text-blue-600">Partager</button>
            <button class="hover:text-blue-600">Signaler</button>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="paginatedReviews.length < filteredSorted.length" class="p-4 border-t">
      <button @click="loadMore" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
        Charger plus d'avis
      </button>
    </div>
  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Profile { full_name: string | null }
interface ReviewItem {
  id?: string
  rating: number
  content?: string | null
  created_at?: string | null
  profiles?: Profile
}

const props = defineProps<{ reviews: ReviewItem[] | null | undefined }>()

const reviewFilter = ref<'all' | '1' | '2' | '3' | '4' | '5'>('all')
const reviewSort = ref<'recent' | 'oldest' | 'highest' | 'lowest'>('recent')

const filteredSorted = computed(() => {
  let list = [...(props.reviews ?? [])]
  // Filter by rounded rating when a specific star value is chosen
  if (reviewFilter.value !== 'all') {
    const target = Number(reviewFilter.value)
    list = list.filter(r => Math.round(Number(r.rating) || 0) === target)
  }
  // Sort according to selection
  switch (reviewSort.value) {
    case 'oldest':
      list.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
      break
    case 'highest':
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      break
    case 'lowest':
      list.sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0))
      break
    default:
      list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }
  return list
})

const visibleCount = ref(5)
const paginatedReviews = computed(() => filteredSorted.value.slice(0, visibleCount.value))
const loadMore = () => { visibleCount.value += 5 }

const reviewKey = (r: ReviewItem, idx: number): string => {
  if (r.id) return r.id
  if (r.created_at) return `created-${r.created_at}`
  return `idx-${idx}`
}

const initials = (name?: string | null) => {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
  return letters || 'U'
}

const formatDate = (iso?: string | null) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return ''
  }
}
</script>
