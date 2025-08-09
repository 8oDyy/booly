<template>
  <div class="header-search">
    <SearchAutocomplete 
      @search="$emit('search', $event)"
      placeholder="Restaurants, coiffeurs, bars..."
    />
  </div>
</template>

<script setup lang="ts">
import SearchAutocomplete from '~/components/ui/SearchAutocomplete.vue'

interface Emits {
  (e: 'search', value: any): void
}

defineEmits<Emits>()
</script>

<style scoped>
.header-search {
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
}

@media (max-width: 768px) {
  .header-search {
    display: none;
  }
}

</style>
