<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p class="text-xl text-gray-600">
          Tout ce que vous devez savoir sur Booly Pro
        </p>
      </div>
      
      <!-- FAQ items -->
      <div class="space-y-4">
        <div
          v-for="faq in faqs"
          :key="faq.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <button
            @click="toggleFaq(faq.id)"
            class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 class="text-lg font-semibold text-gray-900 pr-4">
              {{ faq.question }}
            </h3>
            <UIcon 
              name="i-heroicons-chevron-down" 
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': openFaqs.includes(faq.id) }"
            />
          </button>
          
          <div
            v-if="openFaqs.includes(faq.id)"
            class="px-8 pb-6 text-gray-600 leading-relaxed"
            v-html="faq.answer"
          />
        </div>
      </div>
      
      <!-- Contact CTA -->
      <div class="text-center mt-12">
        <p class="text-gray-600 mb-6">
          Vous avez d'autres questions ?
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            to="/contact"
            size="lg"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 mr-2" />
            Nous contacter
          </UButton>
          <UButton
            href="mailto:support@booly.fr"
            variant="outline"
            size="lg"
            class="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold"
          >
            <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-2" />
            support@booly.fr
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Reactive data
const openFaqs = ref<number[]>([])

// FAQ data
const faqs = [
  {
    id: 1,
    question: "Comment fonctionne la vérification des avis par NFC/QR ?",
    answer: "Chaque client scanne un QR code ou utilise la technologie NFC au moment du paiement. Cela génère un lien unique et temporaire qui permet de laisser un avis authentique. Impossible de falsifier ou de laisser un avis sans avoir réellement effectué un achat."
  },
  {
    id: 2,
    question: "Combien de temps faut-il pour installer Booly Pro ?",
    answer: "L'installation est très simple et prend généralement <strong>moins de 5 minutes</strong>. Nous fournissons des QR codes personnalisés et un guide d'installation détaillé. Notre équipe support est également disponible pour vous accompagner si nécessaire."
  },
  {
    id: 3,
    question: "Puis-je essayer Booly Pro gratuitement ?",
    answer: "Oui ! Nous offrons <strong>30 jours d'essai gratuit</strong> sur tous nos plans, sans engagement et sans carte bancaire requise. Vous pouvez annuler à tout moment pendant la période d'essai."
  },
  {
    id: 4,
    question: "Que se passe-t-il si je change d'avis ?",
    answer: "Aucun problème ! Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Si vous annulez dans les 30 premiers jours, vous serez intégralement remboursé. Pas de frais cachés, pas de pénalités."
  },
  {
    id: 5,
    question: "Booly Pro est-il compatible avec mon système de caisse ?",
    answer: "Booly Pro fonctionne avec <strong>tous les systèmes de caisse</strong> car il ne nécessite aucune intégration technique complexe. Vous placez simplement nos QR codes à proximité de votre caisse ou utilisez nos stickers NFC. Compatible avec tous les TPE du marché."
  },
  {
    id: 6,
    question: "Puis-je personnaliser l'apparence des avis ?",
    answer: "Absolument ! Vous pouvez personnaliser les couleurs, le logo, les messages et l'apparence générale pour correspondre à votre marque. Le plan Pro et Enterprise incluent des options de personnalisation avancées."
  },
  {
    id: 7,
    question: "Comment puis-je intégrer les avis sur mon site web ?",
    answer: "Nous fournissons des widgets prêts à l'emploi que vous pouvez facilement intégrer sur votre site web. Vous pouvez également utiliser notre API pour une intégration personnalisée. Des exemples de code sont disponibles dans votre tableau de bord."
  },
  {
    id: 8,
    question: "Que comprend le support client ?",
    answer: "Tous nos plans incluent un support par email en français. Le plan Pro bénéficie d'un support prioritaire, et le plan Enterprise inclut un support dédié 24/7 avec un responsable de compte attitré."
  },
  {
    id: 9,
    question: "Puis-je gérer plusieurs établissements ?",
    answer: "Oui ! Le plan Enterprise permet de gérer plusieurs établissements depuis un seul tableau de bord. Vous pouvez comparer les performances, gérer les équipes et avoir une vue d'ensemble de tous vos points de vente."
  },
  {
    id: 10,
    question: "Les données sont-elles sécurisées ?",
    answer: "La sécurité est notre priorité. Toutes les données sont chiffrées, hébergées en Europe (RGPD compliant), et nous effectuons des sauvegardes quotidiennes. Nous ne vendons jamais vos données à des tiers."
  }
]

// Methods
const toggleFaq = (id: number) => {
  const index = openFaqs.value.indexOf(id)
  if (index > -1) {
    openFaqs.value.splice(index, 1)
  } else {
    openFaqs.value.push(id)
  }
}
</script>
