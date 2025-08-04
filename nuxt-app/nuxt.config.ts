// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui-pro',
    '@nuxtjs/supabase',
    '@pinia/nuxt'
  ],
  
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  
  // Configuration de Supabase pour désactiver la redirection automatique
  supabase: {
    // URL et clé explicites pour s'assurer qu'elles sont correctement utilisées
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    // Désactiver la redirection automatique vers la page de connexion
    redirect: false,
    // Ou spécifier les routes qui ne nécessitent pas d'authentification
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/', '/about', '/how-it-works', '/faq', '/contact', '/support', '/terms', '/privacy', '/legal', '/auth/register']
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },
  
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com",
            "style-src  'self' 'unsafe-inline'",
            "img-src    'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com https://via.placeholder.com",
            "connect-src 'self' https://*.supabase.co https://maps.googleapis.com https://maps.gstatic.com https://api.iconify.design"
          ].join('; ')
        }
      }
    }
  }
})