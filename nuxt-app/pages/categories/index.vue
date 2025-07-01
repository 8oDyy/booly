<template>
  <div>
    <UContainer class="py-12">
      <h1 class="text-3xl font-bold mb-8">Catégories</h1>
      
      <!-- Barre de recherche -->
      <div class="mb-10">
        <UInput
          v-model="searchQuery"
          placeholder="Rechercher une catégorie..."
          icon="i-heroicons-magnifying-glass"
          class="max-w-md"
          @input="filterCategories"
        />
      </div>
      
      <!-- Catégories principales -->
      <div v-if="filteredCategories.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="category in filteredCategories" 
            :key="category.id" 
            :to="`/categories/${category.slug}`"
            class="group"
          >
            <UCard class="h-full hover:shadow-lg transition-all">
              <div class="p-4 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <UIcon :name="category.icon" class="text-primary-500 w-8 h-8" />
                </div>
                <h3 class="font-medium text-lg mb-1">{{ category.name }}</h3>
                <p class="text-sm text-gray-500">{{ category.count }} établissements</p>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Message si aucune catégorie trouvée -->
      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-face-frown" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-medium text-gray-700 mb-2">Aucune catégorie trouvée</h3>
        <p class="text-gray-500">Essayez avec un autre terme de recherche</p>
        <UButton class="mt-4" @click="resetSearch">Réinitialiser la recherche</UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const searchQuery = ref('');

// Données de démonstration pour les catégories
const categories = ref([
  { id: 1, name: 'Restaurants', slug: 'restaurants', icon: 'i-heroicons-utensils', count: 1245 },
  { id: 2, name: 'Hôtels', slug: 'hotels', icon: 'i-heroicons-home', count: 568 },
  { id: 3, name: 'Shopping', slug: 'shopping', icon: 'i-heroicons-shopping-bag', count: 982 },
  { id: 4, name: 'Services', slug: 'services', icon: 'i-heroicons-wrench-screwdriver', count: 754 },
  { id: 5, name: 'Beauté & Bien-être', slug: 'beauty-wellness', icon: 'i-heroicons-sparkles', count: 421 },
  { id: 6, name: 'Santé', slug: 'health', icon: 'i-heroicons-heart', count: 387 },
  { id: 7, name: 'Automobile', slug: 'automotive', icon: 'i-heroicons-truck', count: 246 },
  { id: 8, name: 'Divertissement', slug: 'entertainment', icon: 'i-heroicons-musical-note', count: 312 },
  { id: 9, name: 'Éducation', slug: 'education', icon: 'i-heroicons-academic-cap', count: 189 },
  { id: 10, name: 'Sports & Loisirs', slug: 'sports-recreation', icon: 'i-heroicons-trophy', count: 278 },
  { id: 11, name: 'Immobilier', slug: 'real-estate', icon: 'i-heroicons-building-office', count: 203 },
  { id: 12, name: 'Services financiers', slug: 'financial-services', icon: 'i-heroicons-banknotes', count: 156 },
]);

const filteredCategories = ref([...categories.value]);

// Filtrer les catégories en fonction de la recherche
const filterCategories = () => {
  if (!searchQuery.value) {
    filteredCategories.value = [...categories.value];
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  filteredCategories.value = categories.value.filter(category => 
    category.name.toLowerCase().includes(query)
  );
};

// Réinitialiser la recherche
const resetSearch = () => {
  searchQuery.value = '';
  filterCategories();
};
</script>
