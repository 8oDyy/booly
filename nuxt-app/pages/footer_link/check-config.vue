<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">Configuration Supabase</h1>
      </template>
      <div class="space-y-4">
        <pre class="bg-gray-100 p-4 rounded overflow-auto">{{ configInfo }}</pre>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
const configInfo = ref('Chargement...')

onMounted(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const supabase = useSupabaseClient()
    
    // Récupérer la configuration publique
    const publicConfig = {
      supabase: {
        url: runtimeConfig.public?.supabase?.url || 'Non défini',
        redirectOptions: useSupabaseAuthClient()?.options?.redirect || 'Non défini',
        authConfig: await $fetch('/_supabase/session', { 
          headers: { accept: 'application/json' } 
        }).catch(() => 'Erreur lors de la récupération')
      }
    }
    
    configInfo.value = JSON.stringify(publicConfig, null, 2)
  } catch (error) {
    configInfo.value = `Erreur: ${error.message}`
  }
})
</script>
