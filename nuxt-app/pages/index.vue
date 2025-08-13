<template>
  <div>
    <!-- Hero Section avec barre de recherche -->
    <LandingHeroSection />
    
    <!-- Carrousel des catégories populaires -->
    <LandingCategoriesCarousel />
    
    <!-- Explication du service -->
    <LandingServiceExplanation />
    
    <!-- Liste complète des catégories -->
    <LandingCategoriesList />
    
    <!-- Témoignages clients -->
    <LandingTestimonialsCarousel />
    
    <!-- CTA pour les professionnels -->
    <LandingBusinessCTA />
    
    <!-- Exemples d'avis -->
    <LandingReviewsExamples />
    
    <!-- Commerces populaires -->
    <LandingPopularBusinesses />
  </div>
</template>

<script setup lang="ts">

useSeoMeta({
  title: 'Accueil - Booly',
  description: 'Découvrez Booly, la plateforme de partage d\'avis sur les commerces locaux'
})
// Cette page utilise maintenant des composants modulaires
// Tous les composants sont dans le dossier components/landing/

// Gestion de l'ouverture automatique du modal de connexion
const route = useRoute()
const { openLoginModal } = useAppHeader()

// Vérifier si on doit ouvrir le modal de connexion
onMounted(() => {
  if (route.query.login === 'true') {
    console.log('🔧 Paramètre login=true détecté, ouverture du modal')
    // Petit délai pour s'assurer que les composants sont montés
    nextTick(() => {
      openLoginModal()
    })
  }
})
</script>
