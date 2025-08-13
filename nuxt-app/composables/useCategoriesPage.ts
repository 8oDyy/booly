import { ref } from 'vue'
import type { Database } from '~/types/supabase'

type Category = Database['public']['Tables']['categories']['Row']

// Cache global pour les catégories de la page
const categoriesPageCache = ref<Category[]>([])
const cacheTimestamp = ref<number>(0)
const loading = ref(false)
const error = ref<string | null>(null)

// Durée du cache: 3 heures (en millisecondes)
const CACHE_DURATION = 3 * 60 * 60 * 1000

/**
 * Composable spécifique pour la page catégories avec types Supabase complets
 */
export const useCategoriesPage = () => {
  const supabase = useSupabaseClient<Database>()

  /**
   * Vérifie si le cache est encore valide
   */
  const isCacheValid = computed(() => {
    const now = Date.now()
    return categoriesPageCache.value.length > 0 && (now - cacheTimestamp.value) < CACHE_DURATION
  })

  /**
   * Récupère toutes les catégories depuis Supabase
   */
  const fetchCategories = async (): Promise<void> => {
    // Si le cache est valide, on ne refait pas la requête
    if (isCacheValid.value) {
      console.log('📂 useCategoriesPage: Utilisation du cache existant')
      return
    }

    console.log('📂 useCategoriesPage: Récupération des catégories depuis Supabase...')
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (supabaseError) {
        console.error('❌ useCategoriesPage: Erreur Supabase:', supabaseError)
        error.value = supabaseError.message
        return
      }

      console.log('✅ useCategoriesPage: Catégories récupérées:', data?.length || 0)
      
      // Mise à jour du cache
      categoriesPageCache.value = data || []
      cacheTimestamp.value = Date.now()

    } catch (err) {
      console.error('💥 useCategoriesPage: Exception lors de la récupération:', err)
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  /**
   * Force le rechargement des catégories (ignore le cache)
   */
  const refreshCategories = async (): Promise<void> => {
    console.log('🔄 useCategoriesPage: Rechargement forcé des catégories')
    cacheTimestamp.value = 0 // Invalide le cache
    await fetchCategories()
  }

  /**
   * Recherche des catégories par nom ou description
   */
  const searchCategories = (query: string): Category[] => {
    if (!query.trim()) return categoriesPageCache.value

    const searchTerm = query.toLowerCase().trim()
    return categoriesPageCache.value.filter(category => 
      category.name.toLowerCase().includes(searchTerm) ||
      (category.description && category.description.toLowerCase().includes(searchTerm))
    )
  }

  /**
   * Récupère une catégorie par son ID
   */
  const getCategoryById = (id: string): Category | undefined => {
    return categoriesPageCache.value.find(category => category.id === id)
  }

  /**
   * Récupère une catégorie par son slug
   */
  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categoriesPageCache.value.find(category => category.slug === slug)
  }

  return {
    // État
    categories: categoriesPageCache,
    loading,
    error,
    
    // Computed
    isCacheValid,
    
    // Méthodes
    fetchCategories,
    refreshCategories,
    searchCategories,
    getCategoryById,
    getCategoryBySlug
  }
}
