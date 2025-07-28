<template>
  <UApp class="min-h-screen flex flex-col">
    <!-- HEADER avec Nuxt UI -->
    <UHeader class="border-b border-gray-200 bg-white">
      <!-- Logo à gauche -->
      <template #left>
        <NuxtLink to="/" class="flex items-center">
          <img src="~/assets/logos/logo-checkly.svg" alt="Booly Logo" class="h-8" />
        </NuxtLink>
      </template>

      <!-- Centre avec search bar et dropdown menu -->
      <template #default>
        <div class="hidden md:flex items-center space-x-6 flex-1 justify-center">
          <!-- Search bar simple -->
          <UInputGroup>
            <UInput 
              v-model="searchQuery" 
              placeholder="Rechercher un service..." 
              icon="i-heroicons-magnifying-glass-20-solid"
              class="w-64"
            />
          </UInputGroup>
          
          <!-- Dropdown menu catégories -->
          <UDropdownMenu :items="categories" :loading="loading">
            <UButton color="neutral" variant="ghost" trailing-icon="i-heroicons-chevron-down-20-solid">
              Catégories
            </UButton>
          </UDropdownMenu>
          
          <!-- Bouton Booly Pro -->
          <UButton
            to="/business"
            color="primary"
            variant="ghost"
            label="Booly Pro"
          />
        </div>
      </template>

      <!-- Boutons à droite -->
      <template #right>
        <div class="flex items-center gap-3">
          <!-- Boutons d'authentification -->
          <div class="flex items-center gap-2">
            <template v-if="user">
              <!-- Afficher l'avatar et le menu utilisateur si connecté -->
              <UDropdownMenu :items="userMenuItems">
                <UAvatar
                  :alt="user.email || 'Utilisateur'"
                  :src="user.user_metadata?.avatar_url"
                  size="sm"
                />
              </UDropdownMenu>
            </template>
            <template v-else>
              <div class="flex gap-2">
                <!-- Modal Se connecter -->
                <UModal v-model="isLoginOpen">
                  <UButton label="Se connecter" color="secondary" variant="subtle" @click="isLoginOpen = true" />
                  <template #body>
                    <div class="flex flex-col items-center justify-center gap-4 p-4">
                      <UPageCard class="w-full max-w-md">
                        <UAuthForm
                          :schema="loginSchema"
                          title="Se connecter"
                          description="Entrez vos identifiants pour accéder à votre compte."
                          icon="i-lucide-user"
                          :fields="loginFields"
                          :providers="providers"
                          :loading="loginLoading"
                          @submit="onLoginSubmit"
                        >
                          <template #footer>
                            <div class="text-center text-sm text-gray-500 mt-4">
                              Pas encore de compte ? 
                              <UButton variant="link" @click="switchToRegister">S'inscrire</UButton>
                            </div>
                          </template>
                        </UAuthForm>
                      </UPageCard>
                    </div>
                  </template>
                </UModal>
                
                <!-- Modal S'inscrire -->
                <UModal v-model="isRegisterOpen">
                  <UButton label="S'inscrire" color="primary" @click="isRegisterOpen = true" />
                  <template #body>
                    <div class="flex flex-col items-center justify-center gap-4 p-4">
                      <UPageCard class="w-full max-w-md">
                        <UAuthForm
                          :schema="registerSchema"
                          title="S'inscrire"
                          description="Créez un compte pour accéder à tous nos services."
                          icon="i-lucide-user-plus"
                          :fields="registerFields"
                          :providers="providers"
                          :loading="registerLoading"
                          @submit="onRegisterSubmit"
                        >
                          <template #footer>
                            <div class="text-center text-sm text-gray-500 mt-4">
                              Déjà un compte ? 
                              <UButton variant="link" @click="switchToLogin">Se connecter</UButton>
                            </div>
                          </template>
                        </UAuthForm>
                      </UPageCard>
                    </div>
                  </template>
                </UModal>
              </div>
            </template>
          </div>
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
import type { FormSubmitEvent } from '@nuxt/ui'
import type { LoginSchema, RegisterSchema } from '~/composables/useAuth'

// Utilisation du composable d'authentification
const { 
  user,
  loginLoading,
  registerLoading,
  loginFields,
  registerFields,
  loginSchema,
  registerSchema,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginWithGithub,
  logout
} = useAuth()

// Reactive state pour les modals d'authentification
const isLoginOpen = ref(false)
const isRegisterOpen = ref(false)

// Search bar
const searchQuery = ref('')

// Utiliser le composable pour récupérer les catégories depuis Supabase
const { categories, loading, error } = useCategories()

// Fonctions pour basculer entre les modals
const switchToLogin = () => {
  isRegisterOpen.value = false
  isLoginOpen.value = true
}

const switchToRegister = () => {
  isLoginOpen.value = false
  isRegisterOpen.value = true
}

// Fonction pour gérer la soumission du formulaire de connexion
const onLoginSubmit = async (payload: FormSubmitEvent<LoginSchema>) => {
  const result = await loginWithEmail(payload)
  if (result.success) {
    isLoginOpen.value = false
  }
}

// Fonction pour gérer la soumission du formulaire d'inscription
const onRegisterSubmit = async (payload: FormSubmitEvent<RegisterSchema>) => {
  const result = await registerWithEmail(payload)
  if (result.success) {
    isRegisterOpen.value = false
  }
}

// Fonction pour se déconnecter
const handleLogout = async () => {
  await logout()
  // Rafraîchir la page après déconnexion pour mettre à jour l'UI
  window.location.reload()
}

// Menu utilisateur pour le dropdown
const userMenuItems = computed(() => [
  {
    label: 'Mon profil',
    icon: 'i-heroicons-user',
    click: () => navigateTo('/account')
  },
  {
    label: 'Mes réservations',
    icon: 'i-heroicons-calendar',
    click: () => navigateTo('/account/bookings')
  },
  {
    label: 'Paramètres',
    icon: 'i-heroicons-cog-6-tooth',
    click: () => navigateTo('/account/settings')
  },
  {
    label: 'Se déconnecter',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: handleLogout
  }
])

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
]

// Providers pour l'authentification OAuth
const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: (event: MouseEvent) => {
    event.preventDefault()
    loginWithGoogle()
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: (event: MouseEvent) => {
    event.preventDefault()
    loginWithGithub()
  }
}]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;700;900&display=swap');
html,
body {
  font-family: 'Roboto', 'Inter', Arial, sans-serif;
}
</style>
