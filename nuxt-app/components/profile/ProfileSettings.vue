<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div class="p-6 border-b border-gray-100">
      <h2 class="text-xl font-semibold text-gray-900">Paramètres du profil</h2>
      <p class="text-sm text-gray-500 mt-1">Gérez vos informations personnelles et préférences</p>
    </div>

    <div class="p-6 space-y-6">
      <!-- Informations personnelles -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nom complet -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <input
              v-model="formData.full_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Votre nom complet"
            />
          </div>

          <!-- Nom d'utilisateur -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="@votre_nom"
            />
          </div>

          <!-- Bio -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              v-model="formData.bio"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Parlez-nous de vous..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Photo de profil -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Photo de profil</h3>
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
            <img
              :src="formData.avatar_url || 'https://i.pravatar.cc/300'"
              alt="Photo de profil"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
          <div class="flex-1">
            <input
              v-model="formData.avatar_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="URL de votre photo de profil"
            />
            <p class="text-xs text-gray-500 mt-1">Ou collez l'URL d'une image</p>
          </div>
        </div>
      </div>

      <!-- Préférences de notification -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input
              v-model="preferences.emailNotifications"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">Notifications par email</p>
              <p class="text-xs text-gray-500">Recevez des emails pour les nouveaux avis et réponses</p>
            </div>
          </label>

          <label class="flex items-center gap-3">
            <input
              v-model="preferences.marketingEmails"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">Emails marketing</p>
              <p class="text-xs text-gray-500">Recevez nos newsletters et offres spéciales</p>
            </div>
          </label>

          <label class="flex items-center gap-3">
            <input
              v-model="preferences.reviewReminders"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">Rappels d'avis</p>
              <p class="text-xs text-gray-500">Rappels pour laisser des avis après vos visites</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Confidentialité -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confidentialité</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input
              v-model="preferences.publicProfile"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">Profil public</p>
              <p class="text-xs text-gray-500">Permettre aux autres utilisateurs de voir votre profil</p>
            </div>
          </label>

          <label class="flex items-center gap-3">
            <input
              v-model="preferences.showEmail"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">Afficher l'email</p>
              <p class="text-xs text-gray-500">Afficher votre email sur votre profil public</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
        <button
          @click="saveSettings"
          :disabled="loading"
          class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading">Enregistrement...</span>
          <span v-else>Enregistrer les modifications</span>
        </button>
        
        <button
          @click="resetForm"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>

      <!-- Message de succès/erreur -->
      <div v-if="message" :class="[
        'p-3 rounded-lg text-sm',
        message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
      ]">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Database } from '~/types/supabase'

interface Props {
  profile: Database['public']['Tables']['profiles']['Row'] | null
}

interface Emits {
  (e: 'profile-updated', profile: Database['public']['Tables']['profiles']['Row']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// État du formulaire
const formData = reactive({
  full_name: '',
  username: '',
  bio: '',
  avatar_url: ''
})

// Préférences utilisateur (stockées localement pour l'instant)
const preferences = reactive({
  emailNotifications: true,
  marketingEmails: false,
  reviewReminders: true,
  publicProfile: true,
  showEmail: false
})

// État de l'interface
const loading = ref(false)
const message = ref<{ type: 'success' | 'error', text: string } | null>(null)

// Supabase client
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

// Initialiser le formulaire avec les données du profil
const initializeForm = () => {
  if (props.profile) {
    formData.full_name = props.profile.full_name || ''
    formData.username = props.profile.username || ''
    formData.bio = props.profile.bio || ''
    formData.avatar_url = props.profile.avatar_url || ''
  }
}

// Watcher pour réinitialiser le formulaire quand le profil change
watch(() => props.profile, initializeForm, { immediate: true })

// Gestion des erreurs d'image
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://i.pravatar.cc/300'
}

// Sauvegarder les paramètres
const saveSettings = async () => {
  if (!user.value) return

  loading.value = true
  message.value = null

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        full_name: formData.full_name || null,
        username: formData.username || null,
        bio: formData.bio || null,
        avatar_url: formData.avatar_url || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    message.value = {
      type: 'success',
      text: 'Profil mis à jour avec succès !'
    }

    emit('profile-updated', data)

    // Effacer le message après 3 secondes
    setTimeout(() => {
      message.value = null
    }, 3000)

  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde:', error)
    message.value = {
      type: 'error',
      text: error.message || 'Erreur lors de la sauvegarde'
    }
  } finally {
    loading.value = false
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  initializeForm()
  message.value = null
}

// Initialiser le formulaire au montage
onMounted(() => {
  initializeForm()
})
</script>
