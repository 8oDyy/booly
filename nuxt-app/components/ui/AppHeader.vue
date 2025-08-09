<template>
  <header class="yelp-header">
    <div class="header-container">
      <!-- Logo -->
      <HeaderLogo />
      
      <!-- Search (desktop) -->
      <HeaderSearch @search="handleSearch" />
      
      <!-- Navigation (desktop) -->
      <HeaderNavigation />
      
      <!-- Actions -->
      <HeaderActions
        :user="user"
        :user-display-name="userDisplayName"
        :user-initials="userInitials"
        :user-avatar="userAvatar"
        :show-user-dropdown="showUserDropdown"
        @open-login="openLoginModal"
        @open-register="openRegisterModal"
        @toggle-user-dropdown="toggleUserDropdown"
        @close-user-dropdown="closeUserDropdown"
        @toggle-mobile-menu="toggleMobileMenu"
        @logout="handleLogout"
      />
    </div>
    
    <!-- Mobile menu -->
    <HeaderMobile
      :show-mobile-menu="showMobileMenu"
      :user="user"
      :user-display-name="userDisplayName"
      :user-initials="userInitials"
      :user-avatar="userAvatar"
      @search="handleSearch"
      @close-mobile-menu="closeMobileMenu"
      @open-login="openLoginModal"
      @open-register="openRegisterModal"
      @logout="handleLogout"
    />
  </header>
  
  <!-- Modales d'authentification -->
  <LoginModal 
    v-model="isLoginOpen" 
    @switch-to-register="switchToRegister"
  />
  <RegisterModal 
    v-model="isRegisterOpen" 
    @switch-to-login="switchToLogin"

  />
</template>

<script setup lang="ts">
import { useAppHeader } from '~/composables/useAppHeader'
import HeaderLogo from '~/components/ui/header/HeaderLogo.vue'
import HeaderSearch from '~/components/ui/header/HeaderSearch.vue'
import HeaderNavigation from '~/components/ui/header/HeaderNavigation.vue'
import HeaderActions from '~/components/ui/header/HeaderActions.vue'
import HeaderMobile from '~/components/ui/header/HeaderMobile.vue'
import LoginModal from '~/components/auth/LoginModal.vue'
import RegisterModal from '~/components/auth/RegisterModal.vue'

// Utilisation du composable useAppHeader
const {
  // État
  user,
  showUserDropdown,
  showMobileMenu,
  isLoginOpen,
  isRegisterOpen,
  
  // Propriétés calculées
  userDisplayName,
  userInitials,
  userAvatar,
  
  // Méthodes pour les modales
  openLoginModal,
  openRegisterModal,
  switchToLogin,
  switchToRegister,
  
  // Méthodes pour le menu mobile
  toggleMobileMenu,
  closeMobileMenu,
  
  // Méthodes pour le dropdown utilisateur
  toggleUserDropdown,
  closeUserDropdown,
  
  // Gestion de la recherche
  handleSearch,
  
  // Gestion de la déconnexion
  handleLogout
} = useAppHeader()
</script>

<style scoped>
/* Yelp-style header */
.yelp-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  gap: 1rem;
}

@media (max-width: 768px) {
  .header-container {
    height: 3.5rem;
    padding: 0 0.75rem;
  }
}
</style>
