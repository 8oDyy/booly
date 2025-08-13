<template>
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
              &copy; {{ currentYear }} Booly. Tous droits réservés.
            </p>
            <div class="flex items-center gap-6">
              <NuxtLink to="/footer_link/terms" class="text-sm text-blue-600/70 hover:text-blue-900 font-inter">
                Conditions d'utilisation
              </NuxtLink>
              <NuxtLink to="/footer_link/privacy" class="text-sm text-blue-600/70 hover:text-blue-900 font-inter">
                Confidentialité
              </NuxtLink>
              <NuxtLink to="/footer_link/legal" class="text-sm text-blue-600/70 hover:text-blue-900 font-inter">
                Mentions légales
              </NuxtLink>
            </div>
          </div>
        </UContainer>
      </template>
    </UFooter>
  </template>
  
  <script setup lang="ts">
  const footerColumns = [
    {
      label: 'Ressources',
      children: [
        { label: 'À propos', to: '/footer_link/about' },
        { label: 'Comment ça marche', to: '/footer_link/how-it-works' },
        { label: 'Pour les professionnels', to: '/landingPro' }
      ]
    },
    {
      label: 'Aide',
      children: [
        { label: 'FAQ', to: '/footer_link/faq' },
        { label: 'Contact', to: '/footer_link/contact' },
        { label: 'Support', to: '/footer_link/support' }
      ]
    }
  ]
  
  const currentYear = new Date().getFullYear()
  </script>