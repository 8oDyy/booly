<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <ProHeroSection />
    
    <!-- Features Section -->
    <ProFeaturesSection />
    
    <!-- Pricing Section -->
    <ProPricingSection />
    
    <!-- Benefits Section -->
    <ProBenefitsSection />
    
    <!-- Testimonials Section -->
    <ProTestimonialsSection />
    
    <!-- FAQ Section -->
    <ProFaqSection />
    
    <!-- CTA Section -->
    <ProCtaSection />
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
definePageMeta({
  title: 'Booly Pro - Développez votre activité avec des avis authentiques',
  description: 'Rejoignez Booly Pro et transformez vos avis clients en véritable avantage concurrentiel. Tableau de bord professionnel, avis vérifiés par NFC/QR, analytics avancés.',
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'Booly Pro - Développez votre activité avec des avis authentiques',
  ogTitle: 'Booly Pro - Développez votre activité avec des avis authentiques',
  description: 'Rejoignez Booly Pro et transformez vos avis clients en véritable avantage concurrentiel. Tableau de bord professionnel, avis vérifiés par NFC/QR, analytics avancés.',
  ogDescription: 'Rejoignez Booly Pro et transformez vos avis clients en véritable avantage concurrentiel. Tableau de bord professionnel, avis vérifiés par NFC/QR, analytics avancés.',
  ogImage: '/images/booly-pro-og.jpg',
  twitterCard: 'summary_large_image'
})
</script>
