<template>
  <UHeader class="border-b border-gray-200 bg-white">
    <!-- Logo à gauche -->
    <template #left>
      <NuxtLink to="/" class="flex items-center">
        <img src="~/assets/logos/logo-checkly.svg" alt="Booly Logo" class="h-8" />
      </NuxtLink>
    </template>
    
    <!-- Centre avec search bar optimisée -->
    <template #default>
      <div class="hidden md:flex flex-1 max-w-2xl mx-8">
        <div class="relative flex-1 max-w-3xl mx-4">
          <div class="modern-search-container">
            <!-- Container principal avec effet glassmorphism -->
            <div class="search-wrapper">
              <!-- Input principal de recherche -->
              <div class="search-input-container">
                <div class="search-icon">
                  <UIcon name="i-heroicons-magnifying-glass" />
                </div>
                <input
                  v-model="searchQuery"
                  placeholder="Que cherchez-vous ?"
                  class="search-input"
                  @input="handleSearchInput"
                  @keydown="handleKeydown"
                  @focus="showCategoryDropdown = true"
                  @blur="hideCategoryDropdown"
                />
                <div class="search-divider"></div>
                
                <!-- Input localisation intégré -->
                <div class="location-icon">
                  <UIcon name="i-heroicons-map-pin" />
                </div>
                <input
                  v-model="locationQuery"
                  placeholder="Où ?"
                  class="location-input"
                />
                
                <!-- Bouton de recherche intégré -->
                <button class="search-button" @click="performSearch">
                  <UIcon name="i-heroicons-arrow-right" class="search-button-icon" />
                </button>
              </div>
              
              <!-- Dropdown des catégories avec style moderne -->
              <div 
                v-if="showCategoryDropdown && filteredCategoriesForDropdown.length > 0"
                class="modern-dropdown"
              >
                <div class="dropdown-header">
                  <span class="dropdown-title">Catégories suggérées</span>
                </div>
                <div 
                  v-for="(category, index) in filteredCategoriesForDropdown" 
                  :key="category.id"
                  :class="[
                    'dropdown-item',
                    { 'dropdown-item-highlighted': index === highlightedIndex }
                  ]"
                  @click="selectCategory(category)"
                >
                  <div class="category-icon">
                    <UIcon name="i-heroicons-tag" />
                  </div>
                  <span class="category-name">{{ category.name }}</span>
                  <div class="category-arrow">
                    <UIcon name="i-heroicons-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
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
import { ref, computed, onMounted } from 'vue'
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
const highlightedIndex = ref(-1)

const { categories, loading, fetchCategories, searchCategories } = useCategories()

// Initialiser les catégories au montage
onMounted(async () => {
  await fetchCategories()
})

// Catégories filtrées pour l'autocomplétion
const filteredCategoriesForDropdown = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value.slice(0, 8) // Afficher les 8 premières par défaut
  }
  return searchCategories(searchQuery.value).slice(0, 8)
})

// Gestion de l'input de recherche
const handleSearchInput = () => {
  highlightedIndex.value = -1
  selectedCategory.value = null
}

// Gestion des touches clavier
const handleKeydown = (event: KeyboardEvent) => {
  if (!showCategoryDropdown.value || !filteredCategoriesForDropdown.value.length) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredCategoriesForDropdown.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectCategory(filteredCategoriesForDropdown.value[highlightedIndex.value])
      } else {
        performSearch()
      }
      break
    case 'Escape':
      showCategoryDropdown.value = false
      highlightedIndex.value = -1
      break
  }
}

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

// Gestion de la recherche avec le nouveau composant
const handleSearch = (searchData: { category?: any, searchTerm: string, location: string }) => {
  const query = new URLSearchParams()
  
  // Gestion de la catégorie sélectionnée
  if (searchData.category) {
    query.set('categoryId', searchData.category.id)
  } else if (searchData.searchTerm.trim()) {
    query.set('q', searchData.searchTerm.trim())
  }
  
  // Gestion de la localisation
  if (searchData.location.trim()) {
    query.set('location', searchData.location.trim())
  }
  
  // Navigation vers la page de recherche
  if (query.toString()) {
    navigateTo(`/search?${query.toString()}`)
  } else {
    navigateTo('/search')
  }
}

// Catégories filtrées pour le dropdown menu (format legacy)
const filteredCategories = computed(() => {
  return categories.value.map(cat => ({
    label: cat.name,
    to: `/search?categoryId=${cat.id}`,
    icon: 'i-heroicons-tag'
  }))
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

const selectCategory = (category: any) => {
  selectedCategory.value = category
  searchQuery.value = category.name || ''
  showCategoryDropdown.value = false
  highlightedIndex.value = -1
}

const userMenuItems = computed(() => [
  {
    label: 'Mon profil',
    icon: 'i-heroicons-user',
    click: () => navigateTo('/profile')
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

<style scoped>
/* Styles modernes pour la barre de recherche */
.modern-search-container {
  position: relative;
  width: 100%;
}

.search-wrapper {
  position: relative;
}

.search-input-container {
  display: flex;
  align-items: center;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border: 1px solid rgba(226, 232, 240, 0.6);
  backdrop-filter: blur(8px);
}

.search-input-container:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input-container:focus-within {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 20px 40px -10px rgba(59, 130, 246, 0.2);
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  background: transparent;
  border: none;
  outline: none;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  min-width: 200px;
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.search-divider {
  width: 1px;
  height: 2rem;
  background: linear-gradient(to bottom, transparent, #d1d5db, transparent);
}

.location-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 3rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.location-input {
  padding: 0.75rem 0.5rem;
  background: transparent;
  border: none;
  outline: none;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  min-width: 120px;
}

.location-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  border-radius: 0.75rem;
  margin: 0 0.5rem;
  transition: all 0.2s ease;
  transform: scale(1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  border: none;
  cursor: pointer;
}

.search-button:hover {
  background: linear-gradient(to right, #1d4ed8, #1e40af);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
}

.search-button:active {
  transform: scale(0.95);
}

.search-button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Styles pour le dropdown moderne */
.modern-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.75rem;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 50;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  border: 1px solid rgba(226, 232, 240, 0.5);
  backdrop-filter: blur(8px);
  animation: dropdownSlideIn 0.2s ease-out;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(243, 244, 246, 0.8);
  background: linear-gradient(to right, rgba(239, 246, 255, 0.5), rgba(238, 242, 255, 0.5));
}

.dropdown-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: linear-gradient(to right, #eff6ff, #eef2ff);
  transform: translateX(2px);
}

.dropdown-item-highlighted {
  background: linear-gradient(to right, #eff6ff, #eef2ff);
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #dbeafe;
  color: #2563eb;
  border-radius: 0.5rem;
  margin-right: 0.75rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover .category-icon {
  background-color: #bfdbfe;
  transform: scale(1.1);
}

.category-name {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.dropdown-item:hover .category-name {
  color: #1e40af;
}

.category-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.dropdown-item:hover .category-arrow {
  color: #2563eb;
  transform: translateX(0.25rem);
}

/* Responsive design */
@media (max-width: 768px) {
  .search-input-container {
    flex-direction: column;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .location-input {
    min-width: auto;
  }
  
  .search-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, #d1d5db, transparent);
  }
}

/* Animation pour les interactions */
.search-input:focus,
.location-input:focus {
  animation: inputFocus 0.3s ease-out;
}

@keyframes inputFocus {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Effet de brillance subtil */
.search-input-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translateX(-100%);
}

.search-input-container:hover::before {
  opacity: 1;
  animation: shimmer 1.5s ease-in-out;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>