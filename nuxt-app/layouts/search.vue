<template>
  <UApp class="min-h-screen flex flex-col">
    <!-- Reuse global header -->
    <AppHeader />

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar : filtres -->
      <aside class="hidden xl:block w-80 shrink-0 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Filtres</h2>
          </template>

          <div class="space-y-6">
            <!-- Catégorie principale -->
            <div>
              <span class="block text-sm font-medium mb-1">Catégorie</span>
              <USelectMenu
                v-model="selectedCategory"
                :options="categories"
                option-attribute="label"
                placeholder="Toutes"
              />
            </div>

            <!-- Note minimale -->
            <div>
              <span class="block text-sm font-medium mb-1">Note minimale</span>
              <URange v-model="minRating" :min="1" :max="5" step="0.5" />
              <div class="text-xs text-gray-500 mt-1">{{ minRating }} ★ et plus</div>
            </div>

            <!-- Ouvert maintenant -->
            <UCheckbox v-model="openNow" label="Ouvert maintenant" />
          </div>
        </UCard>
      </aside>

      <!-- Zone résultats / contenu de page -->
      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Le slot permet à la page /search d'injecter ses résultats -->
        <slot />
      </main>
    </div>

    <!-- Footer global -->
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'

// Composable catégories déjà existant
const { categories } = useCategories()

// États locaux des filtres
const selectedCategory = ref<string | null>(null)
const minRating = ref(3)
const openNow = ref(false)

// (Tu pourras émettre un événement ou utiliser un composable pour que la page /search récupère ces valeurs)
</script>