<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Avis récents de la communauté
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez les derniers avis vérifiés laissés par nos utilisateurs
        </p>
      </div>
      
      <!-- Reviews grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Loading state -->
        <div v-if="loading" v-for="i in 6" :key="i" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-xl bg-gray-200"></div>
            <div class="ml-3 flex-1">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div class="space-y-2 mb-4">
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            <div class="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>

        <!-- Reviews -->
        <div
          v-else
          v-for="review in reviews"
          :key="review.id"
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Business info -->
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <UIcon name="i-heroicons-building-storefront" class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-3 flex-1">
              <h3 class="font-semibold text-gray-900 text-sm">{{ review.businesses?.name || 'Établissement' }}</h3>
              <p class="text-gray-500 text-xs">{{ getCategoryName(review.businesses?.category_id || null) }}</p>
            </div>
            <div class="text-right">
              <div class="flex items-center">
                <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                <span class="text-sm font-medium text-gray-900 ml-1">{{ review.rating }}</span>
              </div>
            </div>
          </div>
          
          <!-- Review content -->
          <p class="text-gray-700 text-sm mb-4 leading-relaxed">{{ review.content }}</p>
          
          <!-- User info -->
          <div class="flex items-center pt-4 border-t border-gray-100">
            <img 
              :src="review.profiles?.avatar_url || getDefaultAvatar(getUserName(review.profiles))" 
              :alt="getUserName(review.profiles)"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ getUserName(review.profiles) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(review.created_at || '') }}</p>
            </div>
          </div>
            <div class="ml-auto">
              <div class="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                <UIcon name="i-heroicons-shield-check" class="w-3 h-3 inline mr-1" />
                Vérifié
              </div>
            </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'
import { useCategories } from '~/composables/useCategories'

const supabase = useSupabaseClient<Database>()
const { categories, fetchCategories } = useCategories()

const loading = ref(true)
const reviews = ref<any[]>([])

// Récupérer les avis récents depuis la base de données
const fetchRecentReviews = async () => {
  console.log('🔍 ReviewsExamples: Début du chargement des avis récents')
  
  try {
    console.log('📡 ReviewsExamples: Exécution de la requête Supabase...')
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        businesses (
          *,
          categories (
            name
          )
        ),
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(6)

    console.log('📥 ReviewsExamples: Réponse Supabase reçue:', { data, error })

    if (error) {
      console.error('❌ ReviewsExamples: Erreur lors du chargement des avis:', error)
      return
    }

    console.log('📊 ReviewsExamples: Nombre d\'avis récupérés:', data?.length || 0)
    console.log('🔍 ReviewsExamples: Premier avis (exemple):', data?.[0])

    reviews.value = (data as any[]) || []
    console.log('✅ ReviewsExamples: Avis stockés dans reviews.value:', reviews.value.length)
  } catch (error) {
    console.error('💥 ReviewsExamples: Exception lors du chargement des avis:', error)
  } finally {
    loading.value = false
    console.log('🏁 ReviewsExamples: Chargement terminé, loading =', loading.value)
  }
}

// Charger les données au montage
onMounted(async () => {
  console.log('🚀 ReviewsExamples: Composant monté, début du chargement des données')
  
  try {
    console.log('📂 ReviewsExamples: Chargement des catégories...')
    await fetchCategories()
    console.log('✅ ReviewsExamples: Catégories chargées:', categories.value.length)
    
    console.log('📝 ReviewsExamples: Chargement des avis...')
    await fetchRecentReviews()
    
    console.log('🎉 ReviewsExamples: Chargement complet terminé')
  } catch (error) {
    console.error('💥 ReviewsExamples: Erreur lors du chargement initial:', error)
  }
})

// Fonction pour obtenir le nom d'utilisateur
const getUserName = (profile: any): string => {
  console.log('👤 ReviewsExamples: getUserName appelé avec profile:', profile)
  
  if (!profile) {
    console.log('👤 ReviewsExamples: Profile null, retour "Utilisateur anonyme"')
    return 'Utilisateur anonyme'
  }
  
  const username = profile.username || ''
  const full_name = profile.full_name || ''
  
  console.log('👤 ReviewsExamples: username:', username)
  console.log('👤 ReviewsExamples: full_name:', full_name)
  
  if (username) {
    const fullName = `${username}`
    console.log('👤 ReviewsExamples: Username:', username)
    return fullName
  } else if (full_name) {
    console.log('👤 ReviewsExamples: Nom complet:', full_name)
    return full_name
  }
  
  console.log('👤 ReviewsExamples: Aucun nom trouvé, retour "Utilisateur anonyme"')
  return 'Utilisateur anonyme'
}

// Fonction pour générer un avatar par défaut
const getDefaultAvatar = (name: string): string => {
  console.log('🖼️ ReviewsExamples: getDefaultAvatar appelé avec name:', name)
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  console.log('🖼️ ReviewsExamples: Initiales générées:', initials)
  
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500'
  ]
  
  const colorIndex = name.length % colors.length
  const color = colors[colorIndex]
  
  console.log('🖼️ ReviewsExamples: Couleur sélectionnée:', color)
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="${color.replace('bg-', '#')}" rx="16"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial" font-size="12" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `)}`
}

// Fonction pour obtenir le nom de catégorie
const getCategoryName = (categoryId: string | null): string => {
  console.log('📂 ReviewsExamples: getCategoryName appelé avec categoryId:', categoryId)
  console.log('📂 ReviewsExamples: Catégories disponibles:', categories.value.length)
  
  if (!categoryId) {
    console.log('📂 ReviewsExamples: categoryId null, retour "Non catégorisé"')
    return 'Non catégorisé'
  }
  
  const category = categories.value.find(cat => cat.id === categoryId)
  console.log('📂 ReviewsExamples: Catégorie trouvée:', category)
  
  const result = category?.name || 'Non catégorisé'
  console.log('📂 ReviewsExamples: Nom de catégorie final:', result)
  
  return result
}

// Fonction pour formater la date
const formatDate = (dateString: string): string => {
  console.log('📅 ReviewsExamples: formatDate appelé avec dateString:', dateString)
  
  if (!dateString) {
    console.log('📅 ReviewsExamples: dateString vide, retour ""')
    return ''
  }
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  console.log('📅 ReviewsExamples: Différence en jours:', diffDays)
  
  if (diffDays === 1) {
    console.log('📅 ReviewsExamples: Retour "Hier"')
    return 'Hier'
  } else if (diffDays < 7) {
    const result = `Il y a ${diffDays} jours`
    console.log('📅 ReviewsExamples: Retour:', result)
    return result
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    const result = `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`
    console.log('📅 ReviewsExamples: Retour:', result)
    return result
  } else {
    const result = date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    console.log('📅 ReviewsExamples: Retour date formatée:', result)
    return result
  }
}
</script>
