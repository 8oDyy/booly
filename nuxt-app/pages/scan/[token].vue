<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-xl p-12 mx-4">
          <div class="relative mb-8">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <UIcon name="i-heroicons-qr-code" class="w-10 h-10 text-white" />
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-primary-600" />
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Validation de votre scan</h3>
          <p class="text-gray-600 mb-2">Vérification de l'authenticité du QR code...</p>
          <p class="text-sm text-primary-600 font-medium">Redirection automatique en cours</p>
          <div class="mt-6 flex justify-center">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-xl p-12 mx-4 border-l-4 border-red-500">
          <div class="relative mb-8">
            <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <UIcon name="i-heroicons-qr-code" class="w-10 h-10 text-red-400" />
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">QR Code invalide</h2>
          <p class="text-gray-600 mb-8 text-lg">{{ error }}</p>
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-red-500 mt-0.5" />
              <div class="text-left">
                <h4 class="text-sm font-semibold text-red-800 mb-1">Causes possibles :</h4>
                <ul class="text-sm text-red-700 space-y-1">
                  <li>• QR code expiré ou désactivé</li>
                  <li>• Code non reconnu par notre système</li>
                  <li>• Problème de connexion réseau</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton to="/" color="primary" size="lg" class="px-8">
              <UIcon name="i-heroicons-home" class="w-5 h-5 mr-2" />
              Retour à l'accueil
            </UButton>
            <UButton @click="retryValidation" color="neutral" variant="outline" size="lg">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 mr-2" />
              Réessayer
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

definePageMeta({
  title: 'Validation du scan...'
})

const route = useRoute()
const supabase = useSupabaseClient<Database>()

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)

// Fonction pour valider le scan_tag via l'API sécurisée
const validateScanTagAndCreateCheck = async (scanTagId: string) => {
  try {
    console.log('🔍 Début validation scan tag:', scanTagId)
    
    const deviceHash = await generateDeviceHash()
    console.log('📱 Device hash généré:', deviceHash)
    
    const requestBody = {
      scanTagId,
      deviceHash,
      userAgent: navigator.userAgent
    }
    console.log('📤 Envoi requête API:', requestBody)
    
    const response = await $fetch('/api/scan/validate-tag', {
      method: 'POST',
      body: requestBody
    })

    console.log('📥 Réponse API reçue:', response)
    return response
  } catch (error) {
    console.error('❌ Erreur lors de la validation du scan tag:', error)
    console.error('❌ Détails erreur:', error)
    return {
      success: false,
      error: 'Erreur technique lors de la validation du scan'
    }
  }
}

// Fonctions utilitaires pour la sécurité
const generateDeviceHash = async (): Promise<string> => {
  const data = `${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}-${new Date().getDate()}`
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Fonction pour réessayer la validation
const retryValidation = async () => {
  error.value = null
  loading.value = true
  
  const scanTagId = route.params.token as string
  
  try {
    const result = await validateScanTagAndCreateCheck(scanTagId)
    
    if (result.success && result.checkId) {
      console.log('✅ Validation réussie, redirection vers avis avec check:', result.checkId)
      
      // Redirection vers la page d'avis avec l'ID du check
      await navigateTo(`/avis/${result.checkId}`, { replace: true })
    } else {
      console.error('❌ Échec validation:', result.error)
      error.value = result.error || 'Erreur lors de la validation du scan'
      loading.value = false
    }
  } catch (err) {
    console.error('❌ Erreur lors de la validation:', err)
    error.value = 'Erreur technique lors de la validation du scan'
    loading.value = false
  }
}

// Validation du scan tag et redirection automatique
onMounted(async () => {
  const scanTagId = route.params.token as string
  
  if (!scanTagId) {
    error.value = 'Token de scan manquant'
    loading.value = false
    return
  }

  console.log('🎯 Début validation pour scan tag:', scanTagId)

  try {
    const result = await validateScanTagAndCreateCheck(scanTagId)
    
    if (result.success && result.checkId) {
      console.log('✅ Validation réussie, redirection vers avis avec check:', result.checkId)
      
      // Redirection vers la page d'avis avec l'ID du check
      await navigateTo(`/avis/${result.checkId}`, { replace: true })
    } else {
      console.error('❌ Échec validation:', result.error)
      error.value = result.error || 'Erreur lors de la validation du scan'
      loading.value = false
    }
  } catch (err) {
    console.error('❌ Erreur lors de la validation:', err)
    error.value = 'Erreur technique lors de la validation du scan'
    loading.value = false
  }
})

// SEO
useSeoMeta({
  title: 'Validation du scan - Booly',
  description: 'Validation du scan en cours...'
})
</script>
