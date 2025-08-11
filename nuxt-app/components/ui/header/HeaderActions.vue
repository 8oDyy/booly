<template>
  <div class="header-actions">
    <!-- Notifications (desktop) - seulement si connecté -->
    <button v-if="user" class="notification-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span class="notification-badge">3</span>
    </button>
    
    <!-- Boutons d'authentification -->
    <div v-if="!user" class="auth-buttons">
      <button class="auth-btn auth-btn-login" @click="$emit('open-login')">
        Se connecter
      </button>
      <button class="auth-btn auth-btn-register" @click="$emit('open-register')">
        S'inscrire
      </button>
    </div>
    
    <!-- Menu utilisateur connecté -->
    <div v-else class="user-menu" @click.stop>
      <button 
        class="user-btn" 
        :class="{ 'user-btn-open': showUserDropdown }"
        @click="$emit('toggle-user-dropdown')"
      >
        <div class="user-avatar">
          <img 
            v-if="userAvatar" 
            :src="userAvatar" 
            :alt="userDisplayName"
            class="avatar-img"
          />
          <span v-else class="avatar-initials">{{ userInitials }}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dropdown-icon">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>
      
      <!-- Dropdown menu -->
      <div v-if="showUserDropdown" class="user-dropdown">
        <div class="dropdown-header">
          <div class="dropdown-user">
            <div class="dropdown-avatar">
              <img 
                v-if="userAvatar" 
                :src="userAvatar" 
                :alt="userDisplayName"
                class="avatar-img"
              />
              <span v-else class="avatar-initials">{{ userInitials }}</span>
            </div>
            <div class="dropdown-info">
              <h4>{{ userDisplayName }}</h4>
              <p>{{ user.email }}</p>
            </div>
          </div>
        </div>
        
        <div class="dropdown-menu">
          <!-- Notifications dans le menu mobile -->
          <button class="dropdown-item mobile-notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Notifications
            <span class="mobile-notification-badge">3</span>
          </button>
          
          <div class="dropdown-divider mobile-only"></div>
          
          <NuxtLink to="/profile" class="dropdown-item" @click="$emit('close-user-dropdown')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mon profil
          </NuxtLink>
          
          <!-- Dashboard Pro - seulement si abonné -->
          <NuxtLink 
            v-if="hasActiveSubscription" 
            to="/dashboard" 
            class="dropdown-item dropdown-item-pro" 
            @click="$emit('close-user-dropdown')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard Pro
          </NuxtLink>
          
          <NuxtLink to="/reviews" class="dropdown-item" @click="$emit('close-user-dropdown')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Mes avis
          </NuxtLink>
          
          <NuxtLink to="/settings" class="dropdown-item" @click="$emit('close-user-dropdown')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Paramètres
          </NuxtLink>
          
          <div class="dropdown-divider"></div>
          
          <button @click="$emit('logout')" class="dropdown-item dropdown-item-danger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu button -->
    <button class="mobile-menu-btn" @click="$emit('toggle-mobile-menu')">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const { hasActiveSubscription } = useSubscription()

interface Props {
  user: any
  userDisplayName: string
  userInitials: string
  userAvatar: string | null
  showUserDropdown: boolean
}

interface Emits {
  (e: 'open-login'): void
  (e: 'open-register'): void
  (e: 'toggle-user-dropdown'): void
  (e: 'close-user-dropdown'): void
  (e: 'toggle-mobile-menu'): void
  (e: 'logout'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Notifications */
.notification-btn {
  position: relative;
  padding: 0.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.notification-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #dc2626;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  text-align: center;
}

/* Auth buttons */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auth-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.auth-btn-login {
  background: none;
  color: #374151;
  border-color: #d1d5db;
}

.auth-btn-login:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.auth-btn-register {
  background: #2563eb;
  color: white;
}

.auth-btn-register:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* User menu */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.user-btn:hover {
  background: #f3f4f6;
}

.user-btn-open {
  background: #f3f4f6;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.875rem;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-size: 0.75rem;
  font-weight: 600;
}

.dropdown-icon {
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.user-btn-open .dropdown-icon {
  transform: rotate(180deg);
}

/* User dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-avatar {
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

.dropdown-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.dropdown-info p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.dropdown-menu {
  padding: 0.5rem 0;
}

.dropdown-item {
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

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-item-danger {
  color: #dc2626;
}

.dropdown-item-danger:hover {
  background: #fef2f2;
}

.dropdown-item-pro {
  color: #1d4ed8;
  font-weight: 600;
}

.dropdown-item-pro:hover {
  background: #eff6ff;
  color: #1e40af;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 0.5rem 0;
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  padding: 0.5rem;
  border: none;
  background: none;
  color: #374151;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.mobile-menu-btn:hover {
  background: #f3f4f6;
}

/* Mobile notifications in dropdown */
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

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .auth-buttons {
    display: none;
  }
  
  .notification-btn {
    display: none;
  }
  
  .user-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-notifications {
    display: flex;
  }
  
  .mobile-only {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-notifications {
    display: none;
  }
}
</style>
