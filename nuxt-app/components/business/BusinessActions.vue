<template>
  <aside class="bg-white rounded-lg border p-4">
    <div class="space-y-3">
      <a
        v-if="business?.phone"
        class="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        :href="`tel:${business.phone}`"
        role="button"
      >
        📞 Appeler
      </a>

      <button
        class="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        @click="openDirections"
      >
        🗺️ Itinéraire
      </button>

      <button
        class="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        @click="shareBusiness"
      >
        🔗 Partager
      </button>

      <button
        class="w-full inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        :class="{ 'bg-yellow-50 ring-yellow-300 text-yellow-800': isFavorite, 'bg-white': !isFavorite }"
        @click="toggleFavorite"
      >
        <span v-if="isFavorite">★ Favori</span>
        <span v-else>☆ Favori</span>
      </button>
    </div>

    <div v-if="tags.length" class="mt-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="t in tags" :key="t.id" class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          #{{ t.name }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = defineProps<{ business: any }>()

const isFavorite = ref(false)
const favKey = computed(() => `fav-business-${props.business?.id || ''}`)

onMounted(() => {
  try {
    if (process.client && favKey.value) {
      isFavorite.value = localStorage.getItem(favKey.value) === '1'
    }
  } catch {}
})

function toggleFavorite() {
  try {
    isFavorite.value = !isFavorite.value
    if (process.client && favKey.value) {
      if (isFavorite.value) localStorage.setItem(favKey.value, '1')
      else localStorage.removeItem(favKey.value)
    }
  } catch {}
}

function buildMapsUrl() {
  const lat = props.business?.latitude
  const lng = props.business?.longitude
  if (lat && lng) return `https://www.google.com/maps?q=${lat},${lng}`
  const q = encodeURIComponent(
    [props.business?.name, props.business?.address, props.business?.city].filter(Boolean).join(', ')
  )
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

function openDirections() {
  const url = buildMapsUrl()
  if (process.client) window.open(url, '_blank')
}

async function shareBusiness() {
  const title = props.business?.name || 'Commerce'
  const text = props.business?.description || ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  try {
    if (process.client && (navigator as any)?.share) {
      await (navigator as any).share({ title, text, url })
    } else if (process.client && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      // Optional: toast could be added if a global toast exists
    }
  } catch {}
}

const tags = computed(() => {
  const list = props.business?.business_tags ?? []
  // the select alias is tag:tags(...)
  return list
    .map((bt: any) => bt.tag)
    .filter(Boolean)
})
</script>
