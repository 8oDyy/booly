<script setup lang="ts">
import { onMounted } from 'vue'
import { useSupabaseClient } from '#imports'   // alias Nuxt

// Typage auto si tu as déjà généré "types/supabase"
const supabase = useSupabaseClient()

onMounted(async () => {
  const { data, error } = await supabase
    .from('business_tags')
    // ↓ jointure vers la table `tags` via la FK business_tags_tag_id_fkey
    .select('id, tag:tags!business_tags_tag_id_fkey(id, name)')
    .limit(5)

  console.log('Résultat jointure business_tags ➜ tags :', { data, error })
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Debug tags</h1>
    <p>Ouvre la console du navigateur (F12) pour voir le résultat.</p>
  </div>
</template>