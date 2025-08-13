<template>
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
    <UContainer>
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Explorez toutes nos catégories
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Découvrez les meilleurs établissements par catégorie et trouvez exactement ce que vous cherchez
        </p>
        
        <!-- Barre de recherche -->
        <div class="max-w-2xl mx-auto">
          <UInput
            v-model="searchQuery"
            placeholder="Rechercher une catégorie (ex: restaurant, coiffeur, garage...)"
            icon="i-heroicons-magnifying-glass"
            size="xl"
            class="w-full"
            @input="handleSearch"
          />
        </div>
        
        <!-- Statistiques -->
        <div class="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-building-storefront" class="w-4 h-4" />
            <span>{{ totalCategories }} catégories</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-star" class="w-4 h-4" />
            <span>Avis vérifiés</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            <span>Scan QR/NFC</span>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalCategories: number
}

interface Emits {
  (e: 'search', query: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

// SEO
useSeoMeta({
  title: 'Toutes les catégories - Booly',
  description: 'Explorez toutes les catégories d\'établissements sur Booly. Restaurants, services, commerces et bien plus encore.'
})
</script>
