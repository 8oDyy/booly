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
          'Content-Security-Policy': "img-src * 'self' data: http: https:; connect-src 'self' https://*.supabase.co https://*.supabase.in http://localhost:* https://localhost:* ws://localhost:* data: blob:"
        }
      }
    }
  }
})