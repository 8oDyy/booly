import type { Database } from '~/types/supabase'

type Business = Database['public']['Tables']['businesses']['Row']
type Review = Database['public']['Tables']['reviews']['Row']
type Check = Database['public']['Tables']['checks']['Row']

export interface DashboardStats {
  averageRating: number
  totalScans: number
  totalReviews: number
  websiteVisits: number // Placeholder pour l'instant
}

export interface RecentReview {
  id: string
  rating: number
  content: string | null
  created_at: string
  user_id: string
  business_name?: string
}

export const useDashboardStats = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // Récupérer les statistiques générales pour l'utilisateur connecté
  const getStats = async (): Promise<DashboardStats> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      // 1. Récupérer les établissements de l'utilisateur
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('id, average_rating, review_count')
        .eq('owner_id', user.value.id)

      if (businessError) throw businessError

      if (!businesses || businesses.length === 0) {
        return {
          averageRating: 0,
          totalScans: 0,
          totalReviews: 0,
          websiteVisits: 0
        }
      }

      const businessIds = businesses.map(b => b.id)

      // 2. Calculer la note moyenne globale
      const totalRating = businesses.reduce((sum, business) => {
        return sum + (business.average_rating || 0) * (business.review_count || 0)
      }, 0)
      const totalReviewCount = businesses.reduce((sum, business) => {
        return sum + (business.review_count || 0)
      }, 0)
      const averageRating = totalReviewCount > 0 ? totalRating / totalReviewCount : 0

      // 3. Compter le nombre total de scans (checks)
      const { count: totalScans, error: scansError } = await supabase
        .from('checks')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)

      if (scansError) throw scansError

      // 4. Compter le nombre total d'avis
      const { count: totalReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)

      if (reviewsError) throw reviewsError

      return {
        averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
        totalScans: totalScans || 0,
        totalReviews: totalReviews || 0,
        websiteVisits: 0 // Placeholder pour l'instant
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  // Récupérer les derniers avis pour l'utilisateur connecté
  const getRecentReviews = async (limit: number = 10): Promise<RecentReview[]> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      // Récupérer les établissements de l'utilisateur
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.value.id)

      if (businessError) throw businessError

      if (!businesses || businesses.length === 0) {
        return []
      }

      const businessIds = businesses.map(b => b.id)

      // Récupérer les derniers avis avec les informations de l'établissement
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          content,
          created_at,
          user_id,
          business_id,
          businesses!inner(name)
        `)
        .in('business_id', businessIds)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (reviewsError) throw reviewsError

      return (reviews || []).map(review => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        created_at: review.created_at || '',
        user_id: review.user_id,
        business_name: (review.businesses as any)?.name
      }))
    } catch (error) {
      console.error('Erreur lors de la récupération des derniers avis:', error)
      throw error
    }
  }

  // Récupérer l'évolution des notes dans le temps (pour le graphique)
  const getRatingEvolution = async (days: number = 30) => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      // Récupérer les établissements de l'utilisateur
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.value.id)

      if (businessError) throw businessError

      if (!businesses || businesses.length === 0) {
        return []
      }

      const businessIds = businesses.map(b => b.id)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Récupérer les avis des X derniers jours
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating, created_at')
        .in('business_id', businessIds)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (reviewsError) throw reviewsError

      return reviews || []
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'évolution des notes:', error)
      throw error
    }
  }

  return {
    getStats,
    getRecentReviews,
    getRatingEvolution
  }
}
