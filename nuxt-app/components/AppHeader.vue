<template>
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
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { navigateTo } from '#imports'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { LoginSchema, RegisterSchema } from '~/composables/useAuth'
  
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
  
  const isLoginOpen = ref(false)
  const isRegisterOpen = ref(false)
  
  const searchQuery = ref('')
  
  const { categories, loading } = useCategories()
  
  const switchToLogin = () => {
    isRegisterOpen.value = false
    isLoginOpen.value = true
  }
  
  const switchToRegister = () => {
    isLoginOpen.value = false
    isRegisterOpen.value = true
  }
  
  const onLoginSubmit = async (payload: FormSubmitEvent<LoginSchema>) => {
    const result = await loginWithEmail(payload)
    if (result.success) {
      isLoginOpen.value = false
    }
  }
  
  const onRegisterSubmit = async (payload: FormSubmitEvent<RegisterSchema>) => {
    const result = await registerWithEmail(payload)
    if (result.success) {
      isRegisterOpen.value = false
    }
  }
  
  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }
  
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