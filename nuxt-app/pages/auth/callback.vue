<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard>
      <template #header>
        <div class="flex justify-center p-4">
          <UIcon name="i-heroicons-arrow-path" class="text-4xl animate-spin" />
        </div>
        <h3 class="text-xl font-bold text-center">Authentification en cours...</h3>
      </template>
      <p class="text-center">Vous allez être redirigé automatiquement.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const router = useRouter()

// Traitement du callback d'authentification
onMounted(async () => {
  try {
    const { error } = await supabase.auth.getSession()
    if (error) throw error
    
    // Redirection vers la page d'accueil après authentification réussie
    router.push('/')
  } catch (error) {
    console.error('Erreur lors du traitement du callback:', error)
    router.push('/')
  }
})
</script>
