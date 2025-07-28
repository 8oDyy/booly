<template>
  <UPage>
    <UPageHeader
      title="Paiement réussi"
      class="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white"
      :ui="{
        container: 'relative py-4 flex flex-col items-center justify-center text-center',
        title: 'text-white text-2xl font-bold mb-0',
        wrapper: 'w-full max-w-6xl'
      }"
    />
    
    <UPageBody>
      <UContainer class="py-12">
        <UCard class="max-w-2xl mx-auto text-center">
          <div class="flex flex-col items-center p-6">
            <UIcon name="i-heroicons-check-circle" class="w-24 h-24 text-green-500 mb-6" />
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Merci pour votre abonnement !</h2>
            <p class="text-gray-600 mb-6">
              Votre paiement a été traité avec succès et votre abonnement est maintenant actif.
              Vous pouvez commencer à utiliser toutes les fonctionnalités premium dès maintenant.
            </p>
            <div class="space-y-4 w-full">
              <UButton to="/dashboard" color="primary" block>
                Accéder à mon tableau de bord
              </UButton>
              <UButton to="/" color="gray" variant="outline" block>
                Retour à l'accueil
              </UButton>
            </div>
          </div>
        </UCard>
      </UContainer>
    </UPageBody>
  </UPage>
</template>

<script setup>
import { useToast } from '@nuxt/ui'

definePageMeta({
  title: 'Paiement réussi - Booly',
  description: 'Votre paiement a été traité avec succès'
})

const toast = useToast()

onMounted(() => {
  toast.add({
    title: 'Paiement réussi',
    description: 'Votre abonnement est maintenant actif',
    color: 'green'
  })
})
</script>
