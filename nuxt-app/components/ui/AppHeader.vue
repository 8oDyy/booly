<template>
  <header class="yelp-header">
    <!-- Desktop Header -->
    <div class="header-container desktop-header">
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

    <!-- Mobile Header -->
    <div class="mobile-header">
      <!-- Left: Profile/Login Button -->
      <div class="mobile-left">
        <button 
          v-if="!user" 
          @click="openLoginModal"
          class="mobile-login-btn"
        >
          Se connecter
        </button>
        <div 
          v-else
          class="mobile-user-menu"
          @click.stop
        >
          <button 
            @click="toggleUserDropdown"
            class="mobile-profile-btn"
          >
            <div class="mobile-user-avatar">
              <img 
                v-if="userAvatar" 
                :src="userAvatar" 
                :alt="userDisplayName"
                class="avatar-img"
              />
              <span v-else class="avatar-initials">{{ userInitials }}</span>
            </div>
          </button>
          
          <!-- Mobile User Dropdown -->
          <div v-if="showUserDropdown" class="mobile-user-dropdown">
            <div class="mobile-dropdown-header">
              <div class="mobile-dropdown-user">
                <div class="mobile-dropdown-avatar">
                  <img 
                    v-if="userAvatar" 
                    :src="userAvatar" 
                    :alt="userDisplayName"
                    class="avatar-img"
                  />
                  <span v-else class="avatar-initials">{{ userInitials }}</span>
                </div>
                <div class="mobile-dropdown-info">
                  <h4>{{ userDisplayName }}</h4>
                  <p>{{ user.email }}</p>
                </div>
              </div>
            </div>
            
            <div class="mobile-dropdown-menu">
              <!-- Notifications dans le menu mobile -->
              <button class="mobile-dropdown-item mobile-notifications">
                <UIcon name="i-heroicons-bell" class="w-5 h-5" />
                Notifications
                <span class="mobile-notification-badge">3</span>
              </button>
              
              <div class="mobile-dropdown-divider"></div>
              
              <NuxtLink to="/profile" class="mobile-dropdown-item" @click="closeUserDropdown">
                <UIcon name="i-heroicons-user" class="w-5 h-5" />
                Mon profil
              </NuxtLink>
              
              <NuxtLink to="/reviews" class="mobile-dropdown-item" @click="closeUserDropdown">
                <UIcon name="i-heroicons-star" class="w-5 h-5" />
                Mes avis
              </NuxtLink>
              
              <NuxtLink to="/settings" class="mobile-dropdown-item" @click="closeUserDropdown">
                <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
                Paramètres
              </NuxtLink>
              
              <div class="mobile-dropdown-divider"></div>
              
              <button @click="handleLogout; closeUserDropdown()" class="mobile-dropdown-item mobile-dropdown-item-danger">
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Logo -->
      <div class="mobile-center">
        <HeaderLogo />
      </div>

      <!-- Right: Empty space for balance -->
      <div class="mobile-right">
      </div>
    </div>

    <!-- Mobile Search Bar (below navbar) -->
    <div class="mobile-search-bar">
      <div class="mobile-search-container">
        <HeaderSearchMobile @search="handleSearch" />
      </div>
    </div>
    

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
import { watch } from 'vue'
import { useAppHeader } from '~/composables/useAppHeader'
import HeaderLogo from '~/components/ui/header/HeaderLogo.vue'
import HeaderSearchMobile from '~/components/ui/header/HeaderSearchMobile.vue'
import HeaderNavigation from '~/components/ui/header/HeaderNavigation.vue'
import HeaderActions from '~/components/ui/header/HeaderActions.vue'
import LoginModal from '~/components/auth/LoginModal.vue'
import RegisterModal from '~/components/auth/RegisterModal.vue'
import HeaderSearch from '~/components/ui/header/HeaderSearch.vue'

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

// Debug watcher pour isLoginOpen
watch(isLoginOpen, (newValue, oldValue) => {
  console.log('🔧 AppHeader - isLoginOpen changed:', { oldValue, newValue })
}, { immediate: true })
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

/* Desktop header - visible only on desktop */
.desktop-header {
  display: flex;
}

/* Mobile header - visible only on mobile */
.mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 4rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  z-index: 45;
}

.mobile-left, .mobile-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.mobile-left {
  justify-content: flex-start;
}

.mobile-right {
  justify-content: flex-end;
}

.mobile-center {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
}

/* Mobile login button */
.mobile-login-btn {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-login-btn:hover {
  background: #1d4ed8;
}

/* Mobile user menu */
.mobile-user-menu {
  position: relative;
}

.mobile-profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.mobile-profile-btn:hover {
  background: #f3f4f6;
}

.mobile-user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-weight: 600;
}

.mobile-user-avatar .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-user-avatar .avatar-initials {
  font-size: 0.875rem;
}

/* Mobile user dropdown */
.mobile-user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 280px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 60;
  overflow: hidden;
}

.mobile-dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
}

.mobile-dropdown-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-dropdown-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-weight: 600;
}

.mobile-dropdown-avatar .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-dropdown-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.mobile-dropdown-info p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.mobile-dropdown-menu {
  padding: 0.5rem 0;
}

.mobile-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.mobile-dropdown-item:hover {
  background: #f9fafb;
}

.mobile-dropdown-item-danger {
  color: #dc2626;
}

.mobile-dropdown-item-danger:hover {
  background: #fef2f2;
}

.mobile-dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 0.5rem 0;
}

.mobile-notifications {
  position: relative;
  justify-content: space-between;
}

.mobile-notification-badge {
  background: #dc2626;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  text-align: center;
}



/* Mobile search bar below navbar */
.mobile-search-bar {
  display: none;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}

.mobile-search-container {
  max-width: 100%;
}

@media (max-width: 768px) {
  .desktop-header {
    display: none;
  }
  
  .mobile-header {
    display: flex;
  }
  
  .mobile-search-bar {
    display: block;
  }
}
</style>
