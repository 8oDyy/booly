<template>
  <UApp class="min-h-screen flex flex-col">
    <UHeader
      :links="headerLinks"
      :user-menu="userMenu"
    >
      <template #logo>
        <h1 class="text-xl font-bold">BoNFC</h1>
      </template>
      
      <template #default>
        <div class="hidden md:flex items-center space-x-6">
          <UDropdown :items="categoriesDropdown">
            <UButton
              color="gray"
              variant="ghost"
              trailing-icon="i-heroicons-chevron-down"
            >
              Catégories
            </UButton>
          </UDropdown>
          
          <NuxtLink 
            to="/business"
            class="text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
          >
            Booly pour les pros
          </NuxtLink>
        </div>
      </template>
      
      <template #right>
        <div class="flex items-center gap-3">
          <UButton
            to="/auth/login"
            color="gray"
            variant="ghost"
          >
            Se connecter
          </UButton>
          <UButton
            to="/auth/register"
            color="primary"
          >
            S'inscrire
          </UButton>
        </div>
      </template>
    </UHeader>
    
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <UFooter>
      <template #left>
        <div class="flex flex-col items-start gap-4">
          <h3 class="text-xl font-bold">BoNFC</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Découvrez et notez les meilleurs commerces et lieux autour de vous grâce à notre technologie de validation NFC.
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} BoNFC. Tous droits réservés.
          </p>
        </div>
      </template>

      <UNavigationMenu :items="footerLinks" variant="link" />

      <template #right>
        <UButton
          icon="i-simple-icons-facebook"
          color="gray"
          variant="ghost"
          size="sm"
          aria-label="Facebook"
        />
        <UButton
          icon="i-simple-icons-twitter"
          color="gray"
          variant="ghost"
          size="sm"
          aria-label="Twitter"
        />
        <UButton
          icon="i-simple-icons-instagram"
          color="gray"
          variant="ghost"
          size="sm"
          aria-label="Instagram"
        />
      </template>
    </UFooter>
  </UApp>
</template>

<script setup>
// Menu déroulant des catégories
const categoriesDropdown = [
  [
    {
      label: 'Restaurants',
      icon: 'i-heroicons-utensils',
      to: '/categories/restaurants'
    },
    {
      label: 'Hôtels',
      icon: 'i-heroicons-home',
      to: '/categories/hotels'
    },
    {
      label: 'Shopping',
      icon: 'i-heroicons-shopping-bag',
      to: '/categories/shopping'
    },
    {
      label: 'Services',
      icon: 'i-heroicons-wrench-screwdriver',
      to: '/categories/services'
    }
  ],
  [
    {
      label: 'Beauté & Bien-être',
      icon: 'i-heroicons-sparkles',
      to: '/categories/beauty-wellness'
    },
    {
      label: 'Santé',
      icon: 'i-heroicons-heart',
      to: '/categories/health'
    },
    {
      label: 'Toutes les catégories',
      icon: 'i-heroicons-squares-2x2',
      to: '/categories'
    }
  ]
];

// Configuration de la barre de navigation
const headerLinks = [
  {
    label: 'Accueil',
    to: '/'
  },
  {
    label: 'Catégories',
    children: [
      {
        label: 'Restaurants',
        icon: 'i-heroicons-utensils',
        to: '/categories/restaurants'
      },
      {
        label: 'Hôtels',
        icon: 'i-heroicons-home',
        to: '/categories/hotels'
      },
      {
        label: 'Shopping',
        icon: 'i-heroicons-shopping-bag',
        to: '/categories/shopping'
      },
      {
        label: 'Services',
        icon: 'i-heroicons-wrench-screwdriver',
        to: '/categories/services'
      },
      {
        label: 'Beauté & Bien-être',
        icon: 'i-heroicons-sparkles',
        to: '/categories/beauty-wellness'
      },
      {
        label: 'Santé',
        icon: 'i-heroicons-heart',
        to: '/categories/health'
      },
      {
        label: 'Toutes les catégories',
        icon: 'i-heroicons-squares-2x2',
        to: '/categories'
      }
    ]
  },
  {
    label: 'Booly pour les pros',
    to: '/business'
  }
];

// Configuration du menu utilisateur
const userMenu = {
  items: [
    [
      {
        label: 'Mon profil',
        icon: 'i-heroicons-user',
        to: '/dashboard'
      },
      {
        label: 'Mes avis',
        icon: 'i-heroicons-star',
        to: '/dashboard/reviews'
      },
      {
        label: 'Favoris',
        icon: 'i-heroicons-heart',
        to: '/dashboard/favorites'
      },
      {
        label: 'Paramètres',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/settings'
      }
    ],
    [
      {
        label: 'Se connecter',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        to: '/auth/login'
      },
      {
        label: 'S\'inscrire',
        icon: 'i-heroicons-user-plus',
        to: '/auth/register'
      }
    ]
  ]
};

// Configuration du footer
const footerLinks = [
  {
    label: 'À propos',
    to: '/about'
  },
  {
    label: 'Comment ça marche',
    to: '/how-it-works'
  },
  {
    label: 'Pour les professionnels',
    to: '/business'
  },
  {
    label: 'FAQ',
    to: '/faq'
  },
  {
    label: 'Contact',
    to: '/contact'
  },
  {
    label: 'Support',
    to: '/support'
  },
  {
    label: 'Conditions d\'utilisation',
    to: '/terms'
  },
  {
    label: 'Politique de confidentialité',
    to: '/privacy'
  },
  {
    label: 'Mentions légales',
    to: '/legal'
  }
];
</script>
