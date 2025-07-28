<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold text-blue-700 font-roboto">Support</h1>
      </template>
      <div class="space-y-6">
        <p class="text-gray-700">Besoin d'aide ? Notre équipe de support est là pour vous aider.</p>
        
        <div class="grid md:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-question-mark-circle" class="text-blue-600 w-6 h-6" />
                <h2 class="text-xl font-bold">Centre d'aide</h2>
              </div>
            </template>
            <p>Consultez notre base de connaissances pour trouver des réponses à vos questions les plus fréquentes.</p>
            <template #footer>
              <UButton to="/faq" color="primary" variant="ghost">
                Voir la FAQ
              </UButton>
            </template>
          </UCard>
          
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="text-blue-600 w-6 h-6" />
                <h2 class="text-xl font-bold">Contactez-nous</h2>
              </div>
            </template>
            <p>Vous ne trouvez pas ce que vous cherchez ? Envoyez-nous un message et nous vous répondrons rapidement.</p>
            <template #footer>
              <UButton to="/contact" color="primary" variant="ghost">
                Formulaire de contact
              </UButton>
            </template>
          </UCard>
        </div>
        
        <UDivider />
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-lg font-bold mb-2">Support prioritaire pour les professionnels</h3>
          <p class="mb-4">Les professionnels inscrits sur notre plateforme bénéficient d'un support prioritaire.</p>
          <UButton to="/business" color="primary">
            Espace professionnel
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
