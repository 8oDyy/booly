<template>
  <UApp class="min-h-screen flex flex-col">
    <!-- HEADER -->
    <UHeader :links="navLinks" :user="user">
      <!-- The Header component only exposes `left`, `default` and `right` slots. -->
      <template #left>
        <h1 class="font-extrabold text-3xl md:text-4xl text-blue-700 font-roboto">BoNFC</h1>
      </template>

      <template #default>
        <div class="hidden md:flex items-center space-x-6">
          <UDropdownMenu :items="categoriesMenu" placement="bottom-start">
            <UButton
              color="neutral"
              variant="ghost"
              trailing-icon="i-heroicons-chevron-down"
              class="font-roboto"
            >
              Catégories
            </UButton>
          </UDropdownMenu>

          <NuxtLink
            to="/business"
            class="font-bold text-blue-700 hover:text-blue-900 transition font-roboto"
          >
            Booly pour les pros
          </NuxtLink>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <UButton to="/auth/login" color="neutral" variant="ghost" class="font-roboto">
            Se connecter
          </UButton>
          <UButton to="/auth/register" color="primary" class="font-roboto">
            S'inscrire
          </UButton>
        </div>
      </template>
    </UHeader>

    <!-- MAIN CONTENT -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- FOOTER -->
    <UFooter class="border-t border-blue-100 bg-gradient-to-b from-blue-50 to-white mt-12">
      <template #top>
        <UContainer class="py-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Branding + social -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-lucide-store" class="w-8 h-8 text-blue-600" />
                <span class="font-extrabold text-2xl text-blue-700 font-roboto">Booly</span>
              </div>
              <p class="text-blue-600/80 font-inter mb-4 max-w-xs">
                Découvrez et notez les meilleurs commerces autour de vous grâce à la validation NFC.
              </p>
              <div class="flex gap-3 mt-4">
                <UButton icon="i-simple-icons-x" color="neutral" variant="ghost" size="sm" aria-label="Twitter" to="https://twitter.com/" target="_blank" />
                <UButton icon="i-simple-icons-instagram" color="neutral" variant="ghost" size="sm" aria-label="Instagram" to="https://instagram.com/" target="_blank" />
                <UButton icon="i-simple-icons-linkedin" color="neutral" variant="ghost" size="sm" aria-label="LinkedIn" to="https://linkedin.com/" target="_blank" />
              </div>
            </div>

            <!-- Footer links -->
            <div class="md:col-span-2">
              <UFooterColumns :columns="footerColumns" />
            </div>
          </div>
        </UContainer>
      </template>

      <template #bottom>
        <UContainer class="py-4 border-t border-blue-100">
          <div class="flex flex-col md:flex-row justify-between items-center gap-2">
            <p class="text-sm text-blue-600/70">
              &copy; {{ new Date().getFullYear() }} Booly. Tous droits réservés.
            </p>
            <div class="flex items-center gap-6">
              <NuxtLink to="/terms" class="text-sm text-blue-600/70 hover:text-blue-900 font-inter">
                Conditions d'utilisation
              </NuxtLink>
              <NuxtLink to="/privacy" class="text-sm text-blue-600/70 hover:text-blue-900 font-inter">
                Confidentialité
              </NuxtLink>
              <NuxtLink to="/legal" class="text-sm text-blue-600/70 hover:text-blue-900 font-inter">
                Mentions légales
              </NuxtLink>
            </div>
          </div>
        </UContainer>
      </template>
    </UFooter>
  </UApp>
</template>

<script setup lang="ts">
// Navigation links shown directly in the header on desktop
const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Catégories', to: '/categories' },
  { label: 'Commerces', to: '/search' }
];

// Grouped items passed to UDropdown
const categoriesMenu = [
  [
    { label: 'Restaurants', icon: 'i-heroicons-utensils', to: '/categories/restaurants' },
    { label: 'Hôtels', icon: 'i-heroicons-home', to: '/categories/hotels' },
    { label: 'Shopping', icon: 'i-heroicons-shopping-bag', to: '/categories/shopping' },
    { label: 'Services', icon: 'i-heroicons-wrench-screwdriver', to: '/categories/services' },
    { label: 'Beauté & Bien-être', icon: 'i-heroicons-sparkles', to: '/categories/beauty-wellness' },
    { label: 'Santé', icon: 'i-heroicons-heart', to: '/categories/health' },
    { label: 'Toutes les catégories', icon: 'i-heroicons-squares-2x2', to: '/categories' }
  ]
];

// Replace with Supabase session later
const user = null;

// Footer columns
const footerColumns = [
  {
    label: 'Ressources',
    children: [
      { label: 'À propos', to: '/about' },
      { label: 'Comment ça marche', to: '/how-it-works' },
      { label: 'Pour les professionnels', to: '/business' }
    ]
  },
  {
    label: 'Aide',
    children: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
      { label: 'Support', to: '/support' }
    ]
  }
];
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;700;900&display=swap');
html,
body {
  font-family: 'Roboto', 'Inter', Arial, sans-serif;
}
</style>
