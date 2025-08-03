// pages/search/index.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from '#imports'


definePageMeta({ layout: 'search' })

const route = useRoute()
const results = ref([])


</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Results header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        {{ results.length }} résultats pour "{{ route.query.q || '...' }}"
      </h1>
      <!-- Mobile filters button duplicates layout one but kept for semantics -->
      <UButton icon="i-heroicons-funnel" variant="soft" color="neutral" class="lg:hidden">
        Filtres
      </UButton>
    </div>

    <!-- Results list -->
    <div class="space-y-4">
      <SearchCard v-for="biz in results" :business="biz" />
    </div>
  </div>
</template>