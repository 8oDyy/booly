<template>
  <UPageCard class="restaurant-card">
    <div class="flex gap-4 p-4">
      <!-- Photo du restaurant -->
      <div class="flex-shrink-0">
        <img 
          :src="coverPhoto || '/placeholder.svg?height=120&width=120'"
          :alt="business.name"
          class="w-30 h-30 object-cover rounded-lg"
        />
      </div>
      
      <!-- Contenu principal -->
      <div class="flex-1 min-w-0">
        <!-- Nom du restaurant -->
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
          {{ business.name }}
        </h3>
        
        <!-- Note avec étoiles -->
        <div class="flex items-center gap-2 mb-2">
          <div class="flex items-center">
            <UIcon 
              v-for="star in 5" 
              :key="star"
              :name="star <= Math.floor(avgRating) ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
              :class="star <= Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-300'"
              class="w-4 h-4"
            />
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ avgRating.toFixed(1) }} ({{ business.review_count || 0 }} avis)
          </span>
        </div>
        
        <!-- Localisation et catégorie -->
        <div class="flex items-center gap-3 mb-3 flex-wrap">
          <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
            <span>{{ business.city || 'Ville non renseignée' }}</span>
          </div>
          
          <!-- TODO: Ajouter les champs opening_hours à la table businesses -->
          <UBadge 
            :color="isOpenNow ? 'success' : 'error'" 
            variant="subtle"
            size="xs"
          >
            {{ isOpenNow ? 'Ouvert' : 'Fermé' }}
          </UBadge>
          
          <span class="text-xs text-gray-500 dark:text-gray-400">
            <!-- TODO: Implémenter la logique d'horaires -->
            Horaires à définir
          </span>
        </div>
        
        <!-- Description ou dernier commentaire -->
        <div class="mb-3">
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {{ business.description || lastReviewContent || 'Aucune description disponible' }}
          </p>
          <p v-if="lastReview" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            - {{ lastReview.profiles?.full_name || 'Anonyme' }}, {{ formatDate(lastReview.created_at) }}
          </p>
        </div>
        
        <!-- Catégorie -->
        <div class="flex flex-wrap gap-1">
          <UBadge 
            v-if="business.category"
            color="primary" 
            variant="soft"
            size="xs"
          >
            {{ business.category.name }}
          </UBadge>
          
          <!-- TODO: Ajouter les champs services à la table businesses -->
          <UBadge 
            v-for="service in mockServices" 
            :key="service"
            color="neutral" 
            variant="soft"
            size="xs"
          >
            {{ service }}
          </UBadge>
        </div>
      </div>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props du composant - utilise les types Supabase
interface Props {
  business: any // Type BusinessWithReviews du composable
}

const props = defineProps<Props>()

// Photo de couverture (première photo ou placeholder)
const coverPhoto = computed(() => {
  return props.business.photos?.[0]?.url || null
})

// Note moyenne
const avgRating = computed(() => {
  return props.business.avg_rating || 0
})

// Dernier avis
const lastReview = computed(() => {
  const reviews = props.business.reviews || []
  return reviews.length > 0 ? reviews[0] : null
})

const lastReviewContent = computed(() => {
  return lastReview.value?.content || null
})

// TODO: Implémenter la logique d'horaires avec les vraies données
const isOpenNow = computed(() => {
  // Pour l'instant, on retourne aléatoirement true/false
  return Math.random() > 0.5
})

// TODO: Remplacer par les vrais services de la base de données
const mockServices = computed(() => {
  const services = ['Livraison', 'Terrasse']
  return services.slice(0, Math.floor(Math.random() * 3))
})

// Fonction pour formater la date
const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays} jours`
  if (diffDays < 30) return `il y a ${Math.ceil(diffDays / 7)} semaines`
  return `il y a ${Math.ceil(diffDays / 30)} mois`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
