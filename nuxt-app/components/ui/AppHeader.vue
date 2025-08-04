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
      <div class="hidden md:flex flex-1 max-w-2xl mx-8">
        <div class="w-full bg-gray-50 rounded-full border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
          <div class="flex items-center">
            
            <!-- Partie catégorie -->
            <div class="flex items-center pl-4 pr-2 border-r border-gray-200 relative">
              <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @focus="showCategoryDropdown = true"
                  @blur="hideCategoryDropdown"
                  @input="filterCategories"
                  placeholder="Que cherchez-vous ?"
                  class="bg-transparent border-0 outline-none text-gray-700 placeholder-gray-500 w-48"
                />
                
                <!-- Dropdown catégories -->
                <div v-if="showCategoryDropdown && filteredCategories.length" class="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div class="max-h-60 overflow-y-auto">
                    <button
                      v-for="category in filteredCategories"
                      :key="category.id"
                      @mousedown="selectCategory(category)"
                      class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span class="text-sm">{{ category.name }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Partie localisation -->
            <div class="flex items-center flex-1 pl-2 pr-4">
              <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <input
                v-model="locationQuery"
                placeholder="Où ?"
                class="bg-transparent border-0 outline-none text-gray-700 placeholder-gray-500 flex-1"
              />
            </div>
            
            <!-- Bouton de recherche -->
            <button
              @click="performSearch"
              class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 m-1 transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="hidden md:flex items-center space-x-6 flex-1 justify-center">
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
import type { FormSubmitEvent, DropdownMenuItem } from '@nuxt/ui'
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

// États des menus et modals
const showCategoryDropdown = ref(false)
const showCategoriesMenu = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const searchQuery = ref('')
const locationQuery = ref('')
const selectedCategory = ref<DropdownMenuItem | null>(null)

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

// Catégories filtrées pour la recherche
const filteredCategories = computed<DropdownMenuItem[]>(() => {
  // Créer une copie limitée pour éviter les problèmes de référence profonde
  const result: DropdownMenuItem[] = [];
  
  // Limiter à 5 éléments maximum
  const maxItems = 5;
  let count = 0;
  
  // Filtrer les catégories en fonction de la recherche
  if (!searchQuery.value) {
    // Prendre les 5 premières catégories si pas de recherche
    for (let i = 0; i < Math.min(categories.value.length, maxItems); i++) {
      result.push(categories.value[i]);
    }
  } else {
    // Filtrer par recherche
    for (let i = 0; i < categories.value.length && count < maxItems; i++) {
      const cat = categories.value[i];
      if (cat.label && cat.label.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        result.push(cat);
        count++;
      }
    }
  }
  
  return result;
})

// Méthodes
const filterCategories = () => {
  // La logique de filtrage est dans le computed
}

const hideCategoryDropdown = () => {
  setTimeout(() => {
    showCategoryDropdown.value = false
  }, 200)
}

const selectCategory = (category: DropdownMenuItem) => {
  selectedCategory.value = category
  searchQuery.value = category.label || ''
  showCategoryDropdown.value = false
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

const performSearch = () => {
  const query = new URLSearchParams()
  
  // Gestion de la catégorie sélectionnée
  if (selectedCategory.value) {
    if (selectedCategory.value.to) {
      // Extraire l'ID de catégorie de l'URL 'to'
      const categoryPath = selectedCategory.value.to.toString().split('/')
      const categoryId = categoryPath[categoryPath.length - 1]
      query.set('category', categoryId)
    } else if (selectedCategory.value.label) {
      // Utiliser le label comme catégorie si pas de 'to'
      query.set('category', selectedCategory.value.label.toLowerCase().replace(/\s+/g, '-'))
    }
  } else if (searchQuery.value.trim()) {
    // Si pas de catégorie sélectionnée mais texte de recherche présent
    query.set('query', searchQuery.value.trim())
  }
  
  // Gestion de la localisation
  if (locationQuery.value.trim()) {
    query.set('location', locationQuery.value.trim())
  }
  
  // Vérifier qu'au moins un paramètre de recherche est présent
  if (query.toString()) {
    // Navigation vers la page de recherche avec les paramètres
    navigateTo(`/search?${query.toString()}`)
  } else {
    // Si aucun paramètre, aller à la page de recherche sans paramètres
    navigateTo('/search')
  }
}

</script>