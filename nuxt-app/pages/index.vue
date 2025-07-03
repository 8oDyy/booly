<template>
  <div>
    <!-- Hero Section simplifié avec titre et sous-titre uniquement -->
    <UPageHero
      title="Découvrez les meilleurs commerces près de chez vous"
      description="Des avis authentiques, validés par NFC pour une expérience de confiance"
      class="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white"
      :ui="{
        container: 'relative py-20 md:py-28 flex flex-col items-center justify-center text-center',
        title: 'text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-tight drop-shadow-xl mb-6 max-w-3xl',
        description: 'text-blue-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto',
        wrapper: 'w-full max-w-6xl'
      }"
    >
      <template #background>
        <div class="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 opacity-90"></div>
      </template>
      
      <template #headline>
        <UBadge color="white" variant="solid" class="mb-4 bg-blue-50 text-blue-700 font-medium">Nouveau ! Plateforme locale 100% vérifiée</UBadge>
      </template>
    </UPageHero>

    <!-- Séparateur décoratif -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-blue-700 opacity-10 skew-y-3 transform -translate-y-1/2 h-16"></div>
    </div>

    <!-- Section Catégories avec design amélioré -->
    <UPageSection 
      title="Explorez par catégorie" 
      description="Découvrez les meilleurs commerces et services classés par catégorie"
      class="bg-gradient-to-b from-blue-50 to-white relative py-4"
      :ui="{
        container: 'py-20',
        title: 'font-extrabold text-3xl md:text-4xl text-blue-700 mb-4 text-center font-roboto',
        description: 'text-blue-600/80 text-xl mb-10 text-center max-w-3xl mx-auto font-inter',
        wrapper: 'max-w-7xl mx-auto'
      }"
    >
      <!-- Utilisation de UPageGrid pour une mise en page cohérente et responsive - 4 colonnes -->
      <UPageGrid :cols="{base: 2, sm: 3, md: 4}" class="gap-4">
        <!-- Boucle sur les 7 premières catégories -->
        <NuxtLink 
          v-for="category in categories.slice(0, 7)" 
          :key="category.id" 
          :to="`/categories/${category.name.toLowerCase()}`" 
          class="focus:outline-none group"
        >
          <UCard
            class="flex flex-col items-center p-4 bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 hover:bg-blue-50 h-full"
          >
            <!-- Cercle avec icône plus petit -->
            <div :class="`w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-${category.color}-100 group-hover:bg-${category.color}-200 transition-colors`">
              <UIcon 
                :name="category.icon" 
                :class="`text-${category.color}-500 w-6 h-6 group-hover:text-${category.color}-600 transition-colors`" 
              />
            </div>
            
            <!-- Nom de la catégorie -->
            <span class="font-roboto font-bold text-blue-700 text-base group-hover:text-blue-900 transition mb-1">{{ category.name }}</span>
            
            <!-- Nombre d'établissements -->
            <span class="text-xs text-blue-500 font-inter">{{ category.count }} établissements</span>
          </UCard>
        </NuxtLink>
        
        <!-- La 8ème carte avec trois points pour voir toutes les catégories -->
        <NuxtLink 
          to="/categories" 
          class="focus:outline-none group"
        >
          <UCard
            class="flex flex-col items-center justify-center p-4 bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 hover:bg-blue-50 h-full"
          >
            <!-- Cercle avec icône de points de suspension -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <UIcon 
                name="i-heroicons-solid-ellipsis-horizontal" 
                class="text-gray-500 w-6 h-6 group-hover:text-gray-600 transition-colors" 
              />
            </div>
            
            <!-- Texte pour voir plus -->
            <span class="font-roboto font-bold text-blue-700 text-base group-hover:text-blue-900 transition mb-1">Voir plus</span>
            
            <!-- Indication du nombre total -->
            <span class="text-xs text-blue-500 font-inter">Toutes les catégories</span>
          </UCard>
        </NuxtLink>
      </UPageGrid>
      
      <template #right>
        <UButton 
          to="/categories" 
          variant="ghost" 
          color="blue" 
          trailing-icon="i-heroicons-solid-arrow-right" 
          class="font-roboto"
        >
          Voir toutes les catégories
        </UButton>
      </template>
    </UPageSection>

    <!-- Séparateur avec vague -->
    <div class="relative h-24 overflow-hidden bg-white">
      <svg class="absolute bottom-0 w-full text-blue-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="currentColor" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>

    <!-- Section Commerces populaires avec design amélioré -->
    <UPageSection 
      title="Commerces populaires près de chez vous" 
      description="Découvrez les établissements les mieux notés dans votre région"
      class="bg-blue-50"
      :ui="{
        container: 'py-20',
        title: 'font-extrabold text-3xl md:text-4xl text-blue-700 mb-4 text-center font-roboto',
        description: 'text-blue-600/80 text-xl mb-10 text-center max-w-3xl mx-auto font-inter',
        wrapper: 'max-w-7xl mx-auto'
      }"
    >
      <template #right>
        <UButton 
          variant="ghost" 
          to="/search" 
          color="blue" 
          trailing-icon="i-heroicons-solid-arrow-right" 
          class="font-roboto"
        >
          Voir plus
        </UButton>
      </template>
      
      <!-- Liste des commerces avec UPageGrid pour cohérence -->
      <UPageGrid :cols="{base: 1, md: 2, lg: 3}" class="gap-7">
        <UCard 
          v-for="business in popularBusinesses" 
          :key="business.id" 
          class="bg-white border border-blue-100 shadow-sm hover:shadow-lg transition hover:border-blue-300 overflow-hidden group"
        >
          <template #header>
            <div class="relative h-48 bg-gray-200 overflow-hidden">
              <img 
                :src="business.image" 
                :alt="business.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500'; this.onerror=null;"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <div class="flex justify-between items-end">
                  <div>
                    <UBadge :color="getCategoryColor(business.category)" size="xs" class="mb-2">{{ business.category }}</UBadge>
                    <h3 class="text-xl font-bold text-white drop-shadow-sm">{{ business.name }}</h3>
                  </div>
                  <UBadge color="white" variant="solid" class="text-blue-700 shadow-sm">
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-solid-star" class="mr-1 text-amber-500" />
                      {{ business.rating }}
                    </span>
                  </UBadge>
                </div>
              </div>
            </div>
          </template>
          
          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <UBadge color="blue" size="xs" class="bg-blue-100 text-blue-700 font-medium">Populaire</UBadge>
              <UBadge color="green" variant="outline" size="xs" class="border-green-300 text-green-600">Ouvert</UBadge>
            </div>
            
            <p class="text-gray-700 mb-3 line-clamp-2 font-inter">{{ business.description }}</p>
            
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center text-gray-600">
                <UIcon name="i-heroicons-solid-map-pin" class="w-4 h-4 text-blue-500 mr-1" />
                <span>{{ business.address.split(',')[0] }}</span>
              </div>
              
              <div class="flex items-center text-gray-600">
                <UIcon name="i-heroicons-solid-chat-bubble-left" class="w-4 h-4 text-blue-500 mr-1" />
                <span>{{ business.reviewCount }} avis</span>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div class="flex items-center text-sm text-blue-600">
                <UIcon name="i-heroicons-solid-check-badge" class="w-5 h-5 text-blue-500 mr-1" />
                <span>Vérifié par NFC</span>
              </div>
              
              <UButton 
                size="xs" 
                color="blue" 
                variant="ghost" 
                to="/business/1" 
                trailing-icon="i-heroicons-solid-arrow-right"
              >
                Détails
              </UButton>
            </div>
          </div>
        </UCard>
      </UPageGrid>
    </UPageSection>

    <!-- Séparateur avec points -->
    <div class="relative py-8 bg-blue-50">
      <div class="flex justify-center space-x-2">
        <div class="w-2 h-2 rounded-full bg-blue-300"></div>
        <div class="w-2 h-2 rounded-full bg-blue-400"></div>
        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
        <div class="w-2 h-2 rounded-full bg-blue-600"></div>
        <div class="w-2 h-2 rounded-full bg-blue-700"></div>
      </div>
    </div>
    
    <!-- Section Comment ça marche -->
    <UPageSection 
      title="Comment ça marche ?" 
      class="bg-white"
      :ui="{
        container: 'py-20',
        title: 'font-extrabold text-3xl md:text-4xl text-blue-700 mb-10 text-center font-roboto',
      }"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UPageFeature
          icon="i-lucide-search"
          title="Trouvez un commerce"
          description="Recherchez et explorez les meilleurs établissements autour de vous."
          :ui="{
            icon: 'text-blue-500 w-14 h-14 mb-4',
            title: 'font-bold text-blue-700 text-xl mb-2 font-roboto',
            description: 'text-blue-500 font-inter',
            container: 'bg-white border border-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center',
          }"
        />
        <UPageFeature
          icon="i-lucide-scan-barcode"
          title="Scannez sur place"
          description="Validez votre visite grâce au QR code ou NFC en caisse."
          :ui="{
            icon: 'text-blue-500 w-14 h-14 mb-4',
            title: 'font-bold text-blue-700 text-xl mb-2 font-roboto',
            description: 'text-blue-500 font-inter',
            container: 'bg-white border border-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center',
          }"
        />
        <UPageFeature
          icon="i-lucide-star"
          title="Laissez un avis authentique"
          description="Partagez votre expérience, votre avis est vérifié et utile à tous."
          :ui="{
            icon: 'text-blue-500 w-14 h-14 mb-4',
            title: 'font-bold text-blue-700 text-xl mb-2 font-roboto',
            description: 'text-blue-500 font-inter',
            container: 'bg-white border border-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center',
          }"
        />
      </div>
    </UPageSection>
    
    <!-- Séparateur avec dégradé -->
    <div class="h-24 bg-gradient-to-b from-white to-blue-50"></div>
    
    <!-- Section Derniers avis -->
    <UPageSection 
      title="Derniers avis vérifiés" 
      description="Des avis authentiques validés par notre technologie NFC"
      class="bg-blue-50"
      :ui="{
        container: 'py-20',
        title: 'font-extrabold text-3xl md:text-4xl text-blue-700 mb-4 text-center font-roboto',
        description: 'text-blue-600/80 text-xl mb-10 text-center max-w-3xl mx-auto font-inter',
        wrapper: 'max-w-7xl mx-auto'
      }"
    >
      <template #right>
        <UButton variant="ghost" to="/reviews" color="blue" trailing-icon="i-heroicons-solid-arrow-right" class="font-roboto">
          Voir tous les avis
        </UButton>
      </template>
      
      <!-- Grille d'avis 4x3 -->
      <UPageGrid :rows="3" :cols="{base: 1, md: 2, lg: 4}" class="gap-6">
        <UCard
          v-for="(review, index) in latestReviews"
          :key="index"
          class="bg-white border border-blue-100 shadow-sm hover:shadow-lg transition overflow-hidden"
        >
          <!-- Image du commerce -->
          <template #header>
            <div class="relative h-48 bg-gray-200 overflow-hidden">
              <img 
                v-if="review.image"
                :src="review.image" 
                :alt="review.business.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-blue-100 flex items-center justify-center">
                <UIcon :name="'i-heroicons-solid-building-storefront'" class="w-12 h-12 text-blue-400" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div>
                  <div class="flex items-center">
                    <UIcon v-for="i in 5" :key="i" :name="i <= review.rating ? 'i-heroicons-solid-star' : 'i-heroicons-star'" class="w-4 h-4" :class="i <= review.rating ? 'text-amber-400' : 'text-gray-300'" />
                  </div>
                  <UBadge color="blue" size="xs" class="mb-1">{{ review.business.category }}</UBadge>
                  <h3 class="text-lg font-bold text-white">{{ review.business.name }}</h3>
                </div>
                <UBadge color="white" variant="solid" class="text-blue-700">
                  <span class="flex items-center">
                    <UIcon name="i-heroicons-solid-check-badge" class="mr-1 text-blue-500" />
                    Vérifié
                  </span>
                </UBadge>
              </div>
            </div>
          </template>
          
          <div class="p-4">
            <!-- Utilisateur et note -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <UAvatar 
                  :src="review.user.avatar" 
                  :alt="review.user.name"
                  size="sm"
                  class="mr-2 ring-2 ring-blue-100"
                />
                <span class="font-medium text-sm">{{ review.user.name }}</span>
              </div>
              <div class="flex items-center">
                <UIcon v-for="i in 5" :key="i" :name="i <= review.rating ? 'i-heroicons-solid-star' : 'i-heroicons-star'" class="w-4 h-4" :class="i <= review.rating ? 'text-amber-400' : 'text-gray-300'" />
              </div>
            </div>
            
            <!-- Contenu de l'avis -->
            <p class="text-sm text-gray-700 line-clamp-3 mb-2">{{ review.content }}</p>
            
            <!-- Date et vérification -->
            <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
              <span>{{ review.date }}</span>
              <span class="flex items-center text-blue-600">
                <UIcon name="i-heroicons-qr-code" class="w-4 h-4 mr-1" />
                Validé sur place
              </span>
            </div>
          </div>
        </UCard>
      </UPageGrid>
    </UPageSection>
    
    <!-- Séparateur avec vague inversée -->
    <div class="relative h-24 overflow-hidden bg-blue-50">
      <svg class="absolute bottom-0 w-full text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="currentColor" fill-opacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
    
    <!-- Section Pour les professionnels avec UPageCTA -->
    <UPageCTA 
      title="Vous êtes un professionnel ?" 
      description="Rejoignez notre plateforme et bénéficiez d'avis authentiques vérifiés par NFC. Augmentez votre visibilité et votre crédibilité auprès de vos clients potentiels."
      variant="solid"
      color="blue"
      class="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-xl"
      :links="[
        { label: 'Inscrivez votre commerce', to: '/business/register', color: 'white', variant: 'solid', size: 'lg', class: 'shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1' },
        { label: 'En savoir plus', to: '/business', color: 'white', variant: 'outline', trailingIcon: 'i-heroicons-solid-arrow-right', class: 'hover:bg-white/10 transition-all' }
      ]"
      :ui="{
        container: 'py-16 px-4',
        wrapper: 'max-w-6xl mx-auto',
        title: 'text-3xl md:text-4xl font-bold mb-4 text-white font-roboto',
        description: 'text-xl mb-8 text-blue-100 max-w-3xl font-inter',
        links: 'flex flex-wrap gap-4 mt-8'
      }"
    >
      <div class="relative w-full max-w-sm mx-auto md:mx-0">
        <div class="absolute -top-6 -left-6 w-24 h-24 bg-blue-400/30 rounded-full blur-xl"></div>
        <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"></div>
        
        <UCard class="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl text-white">
          <div class="p-6">
            <h3 class="text-xl font-bold mb-4 flex items-center">
              <UIcon name="i-heroicons-solid-check-badge" class="w-6 h-6 mr-2 text-blue-200" />
              Avantages pour les pros
            </h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <UIcon name="i-heroicons-solid-check-circle" class="text-blue-200 w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>Avis authentiques vérifiés par NFC</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-solid-check-circle" class="text-blue-200 w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>Tableau de bord avec statistiques</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-solid-check-circle" class="text-blue-200 w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>Visibilité accrue auprès des clients</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-solid-check-circle" class="text-blue-200 w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>Outils marketing et promotions</span>
              </li>
            </ul>
          </div>
        </UCard>
      </div>
    </UPageCTA>
  </div>
</template>

<script setup>
// Données pour les catégories
const categories = [
  { 
    id: 1, 
    name: 'Restaurants', 
    icon: 'i-heroicons-solid-fire', 
    color: 'blue', 
    count: 248 
  },
  { 
    id: 2, 
    name: 'Hôtels', 
    icon: 'i-heroicons-solid-home', 
    color: 'indigo', 
    count: 124 
  },
  { 
    id: 3, 
    name: 'Shopping', 
    icon: 'i-heroicons-solid-shopping-bag', 
    color: 'purple', 
    count: 187 
  },
  { 
    id: 4, 
    name: 'Services', 
    icon: 'i-heroicons-solid-wrench-screwdriver', 
    color: 'teal', 
    count: 156 
  },
  { 
    id: 5, 
    name: 'Beauté', 
    icon: 'i-heroicons-solid-sparkles', 
    color: 'pink', 
    count: 93 
  },
  { 
    id: 6, 
    name: 'Santé', 
    icon: 'i-heroicons-solid-heart', 
    color: 'red', 
    count: 112 
  },
  { 
    id: 7, 
    name: 'Loisirs', 
    icon: 'i-heroicons-solid-ticket', 
    color: 'amber', 
    count: 78 
  },
  { 
    id: 8, 
    name: 'Éducation', 
    icon: 'i-heroicons-solid-academic-cap', 
    color: 'emerald', 
    count: 64 
  }
];

// Données pour les commerces populaires
const popularBusinesses = [
  {
    id: 1,
    name: 'Le Bistrot Parisien',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500',
    rating: 4.8,
    reviewCount: 156,
    description: 'Cuisine française traditionnelle dans un cadre élégant et chaleureux. Produits frais et de saison.',
    address: '15 rue des Fleurs, Paris'
  },
  {
    id: 2,
    name: 'Hôtel du Parc',
    category: 'Hôtel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500',
    rating: 4.6,
    reviewCount: 87,
    description: 'Établissement 4 étoiles avec vue panoramique, spa et service personnalisé.',
    address: '8 avenue du Parc, Lyon'
  },
  {
    id: 3,
    name: 'Boutique Mode & Style',
    category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500',
    rating: 4.5,
    reviewCount: 62,
    description: 'Vêtements et accessoires de créateurs locaux et internationaux pour homme et femme.',
    address: '23 rue du Commerce, Marseille'
  }
];

// Fonction pour obtenir la couleur en fonction de la catégorie
const getCategoryColor = (categoryName) => {
  const colorMap = {
    'Restaurant': 'blue',
    'Hôtel': 'indigo',
    'Shopping': 'purple',
    'Service': 'teal',
    'Beauté': 'pink',
    'Santé': 'red',
    'Loisir': 'amber',
    'Éducation': 'emerald'
  };
  
  return colorMap[categoryName] || 'blue';
};

// Données pour les avis récents
const latestReviews = [
  {
    id: 1,
    user: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150'
    },
    business: {
      name: 'Le Bistrot Parisien',
      category: 'Restaurant'
    },
    rating: 5,
    date: '2025-06-28',
    content: 'Excellente expérience ! La nourriture était délicieuse et le service impeccable. Je recommande vivement ce restaurant pour un dîner romantique.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500'
  },
  {
    id: 2,
    user: {
      name: 'Thomas Dubois',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
    },
    business: {
      name: 'Hôtel du Parc',
      category: 'Hôtel'
    },
    rating: 4,
    date: '2025-06-25',
    content: 'Chambre spacieuse et confortable, personnel très attentionné. Seul bémol : le petit-déjeuner pourrait être plus varié.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500'
  },
  {
    id: 3,
    user: {
      name: 'Julie Moreau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150'
    },
    business: {
      name: 'Boutique Mode & Style',
      category: 'Shopping'
    },
    rating: 5,
    date: '2025-06-22',
    content: 'Superbe boutique avec des pièces uniques ! J’ai trouvé exactement ce que je cherchais et le personnel est de très bon conseil.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500'
  },
  {
    id: 4,
    user: {
      name: 'Antoine Bernard',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150'
    },
    business: {
      name: 'Spa Zen',
      category: 'Beauté'
    },
    rating: 5,
    date: '2025-06-20',
    content: 'Moment de détente absolue ! Le massage aux pierres chaudes était divin et l’ambiance très relaxante. Je reviendrai !',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=500'
  },
  {
    id: 5,
    user: {
      name: 'Camille Petit',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150'
    },
    business: {
      name: 'Café des Arts',
      category: 'Restaurant'
    },
    rating: 4,
    date: '2025-06-18',
    content: 'Cadre charmant et pâtisseries délicieuses. Parfait pour travailler ou se retrouver entre amis. Le wifi est rapide !',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=500'
  },
  {
    id: 6,
    user: {
      name: 'Lucas Girard',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150'
    },
    business: {
      name: 'Auto Service Plus',
      category: 'Service'
    },
    rating: 5,
    date: '2025-06-15',
    content: 'Service rapide et efficace. Le garagiste a identifié et réparé le problème en moins d’une heure. Prix raisonnable.',
    image: null
  }
];

const searchQuery = ref('');
const locationQuery = ref('');

// Recherche avec redirection (pour utilisation future dans la navbar)
const onSearch = () => {
  // Rediriger vers la page de recherche avec les paramètres
  navigateTo({
    path: '/search',
    query: {
      q: searchQuery.value,
      location: locationQuery.value
    }
  });
};
</script>
