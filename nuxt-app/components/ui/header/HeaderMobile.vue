<template>
  <div v-if="showMobileMenu" class="mobile-menu">
    <div class="mobile-content">
      <!-- Mobile search -->
      <div class="mobile-search">
        <SearchAutocomplete 
          @search="$emit('search', $event)"
          @search-performed="$emit('close-mobile-menu')"
          placeholder="Restaurants, coiffeurs, bars..."
        />
      </div>
      
      <!-- Mobile navigation -->
      <nav class="mobile-nav">
        <NuxtLink 
          to="/search" 
          class="mobile-nav-link" 
          :class="{ 'mobile-nav-link-active': $route.path.startsWith('/search') }" 
          @click="$emit('close-mobile-menu')"
        >
          Rechercher
        </NuxtLink>
        <NuxtLink 
          to="/business" 
          class="mobile-nav-link mobile-nav-link-pro" 
          :class="{ 'mobile-nav-link-active': $route.path.startsWith('/business') }" 
          @click="$emit('close-mobile-menu')"
        >
          Booly Pro
        </NuxtLink>
      </nav>
      
      <!-- Mobile auth buttons -->
      <div v-if="!user" class="mobile-auth">
        <button class="mobile-auth-btn mobile-auth-btn-login" @click="$emit('open-login')">
          Se connecter
        </button>
        <button class="mobile-auth-btn mobile-auth-btn-register" @click="$emit('open-register')">
          S'inscrire
        </button>
      </div>
      
      <!-- Mobile user section -->
      <div v-else class="mobile-user">
        <div class="mobile-user-info">
          <div class="mobile-user-avatar">
            <img 
              v-if="userAvatar" 
              :src="userAvatar" 
              :alt="userDisplayName"
              class="avatar-img"
            />
            <span v-else class="avatar-initials">{{ userInitials }}</span>
          </div>
          <div class="mobile-user-details">
            <div class="mobile-user-name">{{ userDisplayName }}</div>
            <div class="mobile-user-email">{{ user.email }}</div>
          </div>
        </div>
        
        <div class="mobile-user-actions">
          <button class="mobile-user-action" @click="$router.push('/profile'); $emit('close-mobile-menu')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Mon profil</span>
          </button>
          
          <button class="mobile-user-action" @click="$router.push('/reviews'); $emit('close-mobile-menu')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Mes avis</span>
          </button>
          
          <button class="mobile-user-action mobile-user-action-danger" @click="$emit('logout'); $emit('close-mobile-menu')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchAutocomplete from '~/components/ui/SearchAutocomplete.vue'

interface Props {
  showMobileMenu: boolean
  user: any
  userDisplayName: string
  userInitials: string
  userAvatar: string | null
}

interface Emits {
  (e: 'search', value: any): void
  (e: 'close-mobile-menu'): void
  (e: 'open-login'): void
  (e: 'open-register'): void
  (e: 'logout'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.mobile-menu {
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 40;
  overflow-y: auto;
}

.mobile-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Mobile search */
.mobile-search {
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

/* Mobile navigation */
.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.mobile-nav-link:hover {
  background: #f9fafb;
}

.mobile-nav-link-active {
  background: #eff6ff;
  color: #2563eb;
}

.mobile-nav-link-pro {
  color: #d97706;
  font-weight: 600;
}

.mobile-nav-link-pro:hover {
  background: #fef3c7;
}

.mobile-nav-link-pro.mobile-nav-link-active {
  background: #fef3c7;
  color: #d97706;
}

/* Mobile auth */
.mobile-auth {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.mobile-auth-btn {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.mobile-auth-btn-login {
  background: none;
  color: #374151;
  border-color: #d1d5db;
}

.mobile-auth-btn-login:hover {
  background: #f9fafb;
}

.mobile-auth-btn-register {
  background: #2563eb;
  color: white;
}

.mobile-auth-btn-register:hover {
  background: #1d4ed8;
}

/* Mobile user */
.mobile-user {
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.mobile-user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-weight: 600;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-size: 1rem;
  font-weight: 600;
}

.mobile-user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.mobile-user-email {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.mobile-user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-user-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
  text-align: left;
}

.mobile-user-action:hover {
  background: #f9fafb;
}

.mobile-user-action-danger {
  color: #dc2626;
}

.mobile-user-action-danger:hover {
  background: #fef2f2;
}

@media (min-width: 769px) {
  .mobile-menu {
    display: none;
  }
}
</style>
