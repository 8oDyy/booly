<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Close Button -->
      <button class="modal-close" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="auth-modal">
        <!-- Header -->
        <div class="auth-modal-header">
          <h3 class="auth-modal-title">Se connecter</h3>
          <p class="auth-modal-subtitle">Accédez à votre compte Booly</p>
        </div>

        <!-- Formulaire de connexion -->
        <form @submit.prevent="onSubmit" class="auth-form">
          <div class="form-fields">
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="loginState.email"
                type="email"
                placeholder="votre@email.com"
                required
                :disabled="loginLoading"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe *</label>
              <input
                id="password"
                v-model="loginState.password"
                type="password"
                placeholder="••••••••"
                required
                :disabled="loginLoading"
                class="form-input"
              />
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input
                  v-model="loginState.remember"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-text">Se souvenir de moi</span>
              </label>
              <a href="/auth/forgot-password" class="forgot-link">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="loginLoading"
            class="login-button"
          >
            <span v-if="loginLoading" class="loading-spinner"></span>
            {{ loginLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>ou</span>
        </div>

        <!-- Connexion sociale -->
        <div class="social-login">
          <button
            @click="handleGoogleLogin"
            :disabled="socialLoading"
            class="social-button google-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>
          
          <button
            @click="handleGithubLogin"
            :disabled="socialLoading"
            class="social-button github-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continuer avec GitHub
          </button>
        </div>

        <!-- Footer -->
        <div class="auth-modal-footer">
          <p>
            Pas encore de compte ?
            <button @click="switchToRegister" class="switch-link">
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'switch-to-register'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { loginWithEmail, loginWithGoogle, loginWithGithub, loginLoading } = useAuth()

// État du modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// État du formulaire
const loginState = reactive({
  email: '',
  password: '',
  remember: false
})

const socialLoading = ref(false)

// Fermer le modal
const closeModal = () => {
  isOpen.value = false
}

// Soumission du formulaire
const onSubmit = async () => {
  if (!loginState.email || !loginState.password) return
  
  const mockEvent = {
    data: {
      email: loginState.email,
      password: loginState.password
    }
  }
  
  const result = await loginWithEmail(mockEvent as any)
  if (result.success) {
    closeModal()
    // Reset form
    loginState.email = ''
    loginState.password = ''
    loginState.remember = false
  }
}

// Connexion avec Google
const handleGoogleLogin = async () => {
  socialLoading.value = true
  try {
    const result = await loginWithGoogle()
    if (result.success) {
      closeModal()
    }
  } finally {
    socialLoading.value = false
  }
}

// Connexion avec GitHub
const handleGithubLogin = async () => {
  socialLoading.value = true
  try {
    const result = await loginWithGithub()
    if (result.success) {
      closeModal()
    }
  } finally {
    socialLoading.value = false
  }
}

// Basculer vers l'inscription
const switchToRegister = () => {
  closeModal()
  emit('switch-to-register')
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 28rem;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.auth-modal {
  padding: 2rem;
}

.auth-modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.auth-modal-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
}

.checkbox-text {
  color: #374151;
}

.forgot-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.auth-divider span {
  background: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.social-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.social-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.github-button {
  background: #24292e;
  color: white;
  border-color: #24292e;
}

.github-button:hover:not(:disabled) {
  background: #1a1e22;
  border-color: #1a1e22;
}

.auth-modal-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.auth-modal-footer p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.switch-link {
  color: #2563eb;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.switch-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .auth-modal {
    padding: 1.5rem;
  }
}
</style>
