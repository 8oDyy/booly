import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from '#app'

export const useAppHeader = () => {
  const { user, logout, loginWithGoogle, loginWithGithub } = useAuth()
  
  // État des modales
  const isLoginOpen = ref(false)
  const isRegisterOpen = ref(false)
  
  // État du menu mobile et dropdown utilisateur
  const showMobileMenu = ref(false)
  const showUserDropdown = ref(false)
  
  // État de la recherche
  const searchQuery = ref('')
  const locationQuery = ref('')
  const selectedCategory = ref<{ to?: string; label?: string } | null>(null)
  
  // Méthodes pour les modales
  const openLoginModal = () => {
    isLoginOpen.value = true
    isRegisterOpen.value = false
  }
  
  const openRegisterModal = () => {
    isRegisterOpen.value = true
    isLoginOpen.value = false
  }
  
  const closeModals = () => {
    isLoginOpen.value = false
    isRegisterOpen.value = false
  }
  
  const switchToLogin = () => {
    isRegisterOpen.value = false
    isLoginOpen.value = true
  }
  
  const switchToRegister = () => {
    isLoginOpen.value = false
    isRegisterOpen.value = true
  }
  
  // Méthodes pour les menus
  const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
    if (showMobileMenu.value) {
      showUserDropdown.value = false
    }
  }
  
  const closeMobileMenu = () => {
    showMobileMenu.value = false
  }
  
  const toggleUserDropdown = () => {
    showUserDropdown.value = !showUserDropdown.value
    if (showUserDropdown.value) {
      showMobileMenu.value = false
    }
  }
  
  const closeUserDropdown = () => {
    showUserDropdown.value = false
  }
  
  // Fermer les menus en cliquant à l'extérieur
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.user-dropdown-container')) {
      closeUserDropdown()
    }
    if (!target.closest('.mobile-menu-button') && !target.closest('.mobile-menu')) {
      closeMobileMenu()
    }
  }
  
  // Gestion de la recherche
  const handleSearch = (searchData: { category?: any, searchTerm: string, location: string }) => {
    const query = new URLSearchParams()
    
    if (searchData.category) {
      query.set('categoryId', searchData.category.id)
    } else if (searchData.searchTerm.trim()) {
      query.set('q', searchData.searchTerm.trim())
    }
    
    if (searchData.location.trim()) {
      query.set('location', searchData.location.trim())
    }
    
    if (query.toString()) {
      navigateTo(`/search?${query.toString()}`)
    } else {
      navigateTo('/search')
    }
  }
  
  const performSearch = () => {
    const query = new URLSearchParams()
    
    if (selectedCategory.value) {
      if (selectedCategory.value.to) {
        const categoryPath = selectedCategory.value.to.toString().split('/')
        const categoryId = categoryPath[categoryPath.length - 1]
        query.set('category', categoryId)
      } else if (selectedCategory.value.label) {
        query.set('category', selectedCategory.value.label.toLowerCase().replace(/\s+/g, '-'))
      }
    } else if (searchQuery.value.trim()) {
      query.set('query', searchQuery.value.trim())
    }
    
    if (locationQuery.value.trim()) {
      query.set('location', locationQuery.value.trim())
    }
    
    if (query.toString()) {
      navigateTo(`/search?${query.toString()}`)
    } else {
      navigateTo('/search')
    }
  }
  
  // Gestion de la déconnexion
  const handleLogout = async () => {
    closeUserDropdown()
    await logout()
    await navigateTo('/')
  }
  
  // Informations utilisateur formatées
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return user.value.user_metadata?.full_name || 
           user.value.user_metadata?.name || 
           user.value.email?.split('@')[0] || 
           'Utilisateur'
  })
  
  const userInitials = computed(() => {
    if (!user.value) return ''
    const name = userDisplayName.value
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  })
  
  const userAvatar = computed(() => {
    return user.value?.user_metadata?.avatar_url || null
  })
  
  // Lifecycle
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  return {
    // État
    user,
    isLoginOpen,
    isRegisterOpen,
    showMobileMenu,
    showUserDropdown,
    searchQuery,
    locationQuery,
    selectedCategory,
    
    // Computed
    userDisplayName,
    userInitials,
    userAvatar,
    
    // Méthodes modales
    openLoginModal,
    openRegisterModal,
    closeModals,
    switchToLogin,
    switchToRegister,
    
    // Méthodes menus
    toggleMobileMenu,
    closeMobileMenu,
    toggleUserDropdown,
    closeUserDropdown,
    
    // Méthodes recherche
    handleSearch,
    performSearch,
    
    // Méthodes auth
    handleLogout,
    loginWithGoogle,
    loginWithGithub
  }
}
