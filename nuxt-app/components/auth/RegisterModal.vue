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
          <h3 class="auth-modal-title">S'inscrire</h3>
          <p class="auth-modal-subtitle">Créez votre compte Booly</p>
        </div>

        <!-- Formulaire d'inscription -->
        <form @submit.prevent="onSubmit" class="auth-form">
          <div class="form-fields">
            <div class="form-group">
              <label for="register-email">Email *</label>
              <input
                id="register-email"
                v-model="registerState.email"
                type="email"
                placeholder="votre@email.com"
                required
                :disabled="registerLoading"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="register-password">Mot de passe *</label>
              <input
                id="register-password"
                v-model="registerState.password"
                type="password"
                placeholder="••••••••"
                required
                minlength="8"
                :disabled="registerLoading"
                class="form-input"
              />
              <small class="password-hint">Au moins 8 caractères</small>
            </div>

            <div class="form-group">
              <label for="register-confirm-password">Confirmer le mot de passe *</label>
              <input
                id="register-confirm-password"
                v-model="registerState.confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                :disabled="registerLoading"
                class="form-input"
                :class="{ 'input-error': passwordMismatch }"
              />
              <small v-if="passwordMismatch" class="error-message">
                Les mots de passe ne correspondent pas
              </small>
            </div>

            <div class="terms-checkbox">
              <label class="checkbox-label">
                <input
                  v-model="registerState.acceptTerms"
                  type="checkbox"
                  required
                  class="checkbox-input"
                />
                <span class="checkbox-text">
                  J'accepte les 
                  <a href="/terms" target="_blank" class="terms-link">conditions d'utilisation</a>
                  et la 
                  <a href="/privacy" target="_blank" class="terms-link">politique de confidentialité</a>
                </span>
              </label>
            </div>
          </div>

          <!-- Bouton d'inscription -->
          <button
            type="submit"
            :disabled="registerLoading || !registerState.acceptTerms || !!passwordMismatch"
            class="register-button"
          >
            <span v-if="registerLoading" class="loading-spinner"></span>
            {{ registerLoading ? 'Inscription...' : "S'inscrire" }}
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
            Déjà un compte ?
            <button @click="switchToLogin" class="switch-link">
              Se connecter
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
  (e: 'switch-to-login'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { registerWithEmail, loginWithGoogle, loginWithGithub, registerLoading } = useAuth()

// État du modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// État du formulaire
const registerState = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const socialLoading = ref(false)

// Vérification de correspondance des mots de passe
const passwordMismatch = computed(() => {
  return registerState.password && registerState.confirmPassword && 
         registerState.password !== registerState.confirmPassword
})

// Fermer le modal
const closeModal = () => {
  isOpen.value = false
}

// Soumission du formulaire
const onSubmit = async () => {
  if (!registerState.email || !registerState.password || !registerState.confirmPassword || !registerState.acceptTerms) {
    return
  }
  
  if (passwordMismatch.value) {
    return
  }
  
  const mockEvent = {
    data: {
      email: registerState.email,
      password: registerState.password,
      confirmPassword: registerState.confirmPassword
    }
  }
  
  const result = await registerWithEmail(mockEvent as any)
  
  if (result.success) {
    closeModal()
    // Reset form
    registerState.email = ''
    registerState.password = ''
    registerState.confirmPassword = ''
    registerState.acceptTerms = false
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

// Basculer vers la connexion
const switchToLogin = () => {
  closeModal()
  emit('switch-to-login')
}
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  color: #6b7280;
  border: none;
  cursor: pointer;
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

.input-error {
  border-color: #dc2626;
}

.input-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.password-hint {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.terms-checkbox {
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.checkbox-text {
  color: #374151;
  line-height: 1.4;
}

.terms-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-button {
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

.register-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.register-button:disabled {
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

.google-button {
  border: 1px solid #e5e7eb;
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
