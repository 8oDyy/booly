import { ref, computed } from 'vue'
import { useBusinesses } from './useBusinesses'

// Types pour les catégories
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

// Cache global pour les catégories
const categoriesCache = ref<Category[]>([])
const cacheTimestamp = ref<number>(0)
const loading = ref(false)
const error = ref<string | null>(null)

// Durée du cache: 3 heures (en millisecondes)
const CACHE_DURATION = 3 * 60 * 60 * 1000

/**
 * Composable pour la gestion des catégories avec cache serveur
 */
export const useCategories = () => {
  const { getCategories } = useBusinesses()

  /**
   * Vérifie si le cache est encore valide
   */
  const isCacheValid = computed(() => {
    const now = Date.now()
    return categoriesCache.value.length > 0 && (now - cacheTimestamp.value) < CACHE_DURATION
  })

  /**
   * Récupère les catégories depuis Supabase ou le cache
   */
  const fetchCategories = async (forceRefresh = false): Promise<Category[]> => {
    // Si le cache est valide et qu'on ne force pas le refresh, retourner le cache
    if (isCacheValid.value && !forceRefresh) {
      return categoriesCache.value
    }

    // Si une requête est déjà en cours, attendre qu'elle se termine
    if (loading.value) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!loading.value) {
            resolve(categoriesCache.value)
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }

    loading.value = true
    error.value = null

    try {
      const categories = await getCategories()
      
      // Mettre à jour le cache
      categoriesCache.value = categories
      cacheTimestamp.value = Date.now()
      
      console.log(`Catégories chargées et mises en cache: ${categories.length} catégories`)
      return categories
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories:', err)
      error.value = err.message || 'Erreur lors du chargement des catégories'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Filtre les catégories selon une requête de recherche
   */
  const searchCategories = (query: string): Category[] => {
    if (!query.trim()) return categoriesCache.value
    
    const searchTerm = query.toLowerCase().trim()
    return categoriesCache.value.filter(category => 
      category.name.toLowerCase().includes(searchTerm) ||
      category.slug.toLowerCase().includes(searchTerm) ||
      (category.description && category.description.toLowerCase().includes(searchTerm))
    )
  }

  /**
   * Trouve une catégorie par son ID
   */
  const getCategoryById = (id: string): Category | undefined => {
    return categoriesCache.value.find(category => category.id === id)
  }

  /**
   * Trouve une catégorie par son slug
   */
  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categoriesCache.value.find(category => category.slug === slug)
  }

  /**
   * Force le rechargement du cache
   */
  const refreshCache = () => {
    return fetchCategories(true)
  }

  return {
    // État
    categories: computed(() => categoriesCache.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isCacheValid,
    
    // Méthodes
    fetchCategories,
    searchCategories,
    getCategoryById,
    getCategoryBySlug,
    refreshCache
  }
}
