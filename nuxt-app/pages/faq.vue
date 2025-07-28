<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold text-blue-700 font-roboto">Foire Aux Questions</h1>
      </template>
      <div class="space-y-6">
        <UAccordion :items="faqItems" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
const faqItems = [
  {
    label: 'Comment fonctionne la validation NFC ?',
    content: 'La validation NFC permet de confirmer votre présence dans un commerce en approchant votre téléphone du badge NFC installé dans l\'établissement. Cette technologie garantit l\'authenticité des avis laissés sur notre plateforme.',
    default: true
  },
  {
    label: 'Comment créer un compte sur Booly ?',
    content: 'Pour créer un compte, cliquez sur "S\'inscrire" dans le menu en haut à droite. Vous pouvez vous inscrire avec votre email et un mot de passe, ou utiliser votre compte Google ou Facebook pour une inscription plus rapide.'
  },
  {
    label: 'Je suis un professionnel, comment inscrire mon commerce ?',
    content: 'Rendez-vous sur la page "Booly pour les pros" accessible depuis le menu principal. Vous pourrez y créer votre profil professionnel et suivre les étapes pour ajouter votre établissement à notre plateforme.'
  },
  {
    label: 'Les avis sont-ils modérés ?',
    content: 'Oui, tous les avis sont soumis à une modération pour garantir qu\'ils respectent nos conditions d\'utilisation. De plus, notre système de validation NFC assure que seuls les clients ayant réellement visité l\'établissement peuvent laisser un avis.'
  },
  {
    label: 'Comment supprimer mon compte ?',
    content: 'Pour supprimer votre compte, connectez-vous et rendez-vous dans les paramètres de votre profil. Vous y trouverez l\'option "Supprimer mon compte". Notez que cette action est irréversible et supprimera toutes vos données.'
  }
]
</script>
