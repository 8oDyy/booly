<template>
  <UPage>
    <UPageHeader
      title="Paiement annulé"
      class="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500 text-white"
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
            <UIcon name="i-heroicons-exclamation-circle" class="w-24 h-24 text-amber-500 mb-6" />
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Paiement annulé</h2>
            <p class="text-gray-600 mb-6">
              Votre paiement a été annulé et aucun montant n'a été débité.
              Si vous avez rencontré un problème ou si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
            <div class="space-y-4 w-full">
              <UButton to="/business" color="primary" block>
                Retour aux plans tarifaires
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
  title: 'Paiement annulé - Booly',
  description: 'Votre paiement a été annulé'
})

const toast = useToast()

onMounted(() => {
  toast.add({
    title: 'Paiement annulé',
    description: 'Aucun montant n\'a été débité',
    color: 'amber'
  })
})
</script>
