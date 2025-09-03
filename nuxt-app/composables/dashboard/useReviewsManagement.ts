import type { Database } from '~/types/supabase'

type Review = Database['public']['Tables']['reviews']['Row']
type Response = Database['public']['Tables']['responses']['Row']
type Business = Database['public']['Tables']['businesses']['Row']

export interface ReviewWithDetails extends Review {
  business?: {
    name: string
    id: string
  }
  user_profile?: {
    username?: string
  }
  response?: Response
  hasResponse: boolean
}

export interface ReviewFilters {
  rating?: number
  hasResponse?: boolean
  businessId?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export const useReviewsManagement = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // Récupérer tous les avis pour les établissements de l'utilisateur
  const getAllReviews = async (filters?: ReviewFilters): Promise<ReviewWithDetails[]> => {
    console.log('🔍 getAllReviews - Début de la fonction')
    console.log('👤 User connecté:', user.value?.id)
    
    if (!user.value?.id) {
      console.error('❌ Utilisateur non connecté')
      throw new Error('Utilisateur non connecté')
    }

    try {
      console.log('📊 Récupération des établissements pour user:', user.value.id)
      
      // 1. Récupérer les établissements de l'utilisateur
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.value.id)

      console.log('🏢 Résultat businesses:', { businesses, error: businessError })

      if (businessError) throw businessError

      if (!businesses || businesses.length === 0) {
        console.log('⚠️ Aucun établissement trouvé pour cet utilisateur')
        return []
      }

      const businessIds = businesses.map(b => b.id)
      console.log('🏢 IDs des établissements:', businessIds)

      // 2. Construire la requête des avis avec filtres
      console.log('🔍 Construction de la requête Supabase pour les avis')
      
      let query = supabase
        .from('reviews')
        .select(`
          id,
          rating,
          content,
          created_at,
          business_id,
          user_id,
          businesses!inner(id, name),
          responses(id, content, created_at)
        `)
        .in('business_id', businessIds)
        .order('created_at', { ascending: false })

      console.log('📝 Requête de base construite')

      // Appliquer les filtres si fournis
      if (filters?.rating) {
        console.log('🔍 Filtre rating appliqué:', filters.rating)
        query = query.eq('rating', filters.rating)
      }
      if (filters?.hasResponse !== undefined) {
        console.log('🔍 Filtre hasResponse appliqué:', filters.hasResponse)
        if (filters.hasResponse) {
          query = query.not('responses', 'is', null)
        } else {
          query = query.is('responses', null)
        }
      }
      if (filters?.businessId) {
        console.log('🔍 Filtre businessId appliqué:', filters.businessId)
        query = query.eq('business_id', filters.businessId)
      }

      console.log('🚀 Exécution de la requête Supabase...')
      const { data: reviewsData, error: reviewsError } = await query

      console.log('📊 Résultat de la requête:', { reviewsData, error: reviewsError })

      if (reviewsError) throw reviewsError

      // 3. Transformer les données pour inclure les détails
      return (reviewsData || []).map(review => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        created_at: review.created_at,
        updated_at: review.created_at, // Utiliser created_at comme fallback
        business_id: review.business_id,
        user_id: review.user_id,
        check_id: '', // Placeholder pour check_id
        business: review.businesses,
        user_profile: undefined, // Pas de profil utilisateur pour l'instant
        response: review.responses ? {
          id: review.responses.id,
          content: review.responses.content,
          created_at: review.responses.created_at,
          updated_at: review.responses.created_at,
          review_id: review.id,
          business_owner_id: review.user_id
        } : undefined,
        hasResponse: !!review.responses
      }))
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error)
      throw error
    }
  }

  // Répondre à un avis
  const respondToReview = async (reviewId: string, content: string): Promise<Response> => {
    console.log('🚀 respondToReview - Début de la fonction')
    console.log('🚀 respondToReview - reviewId:', reviewId)
    console.log('🚀 respondToReview - content:', content)
    console.log('🚀 respondToReview - user.value?.id:', user.value?.id)
    
    if (!user.value?.id) {
      console.error('❌ respondToReview - Utilisateur non connecté')
      throw new Error('Utilisateur non connecté')
    }

    try {
      // Vérifier que l'avis appartient à un établissement de l'utilisateur
      console.log('🔍 respondToReview - Vérification de l\'avis et de l\'autorisation...')
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('id', reviewId)
        .single()

      console.log('📊 respondToReview - Résultat requête review:', { review, error: reviewError })

      if (reviewError) {
        console.error('❌ respondToReview - Erreur lors de la récupération de l\'avis:', reviewError)
        throw reviewError
      }

      console.log('🔍 respondToReview - Review businesses:', review.businesses)
      console.log('🔍 respondToReview - Owner ID from review:', (review.businesses as any)?.owner_id)
      console.log('🔍 respondToReview - Current user ID:', user.value.id)

      if ((review.businesses as any).owner_id !== user.value.id) {
        console.error('❌ respondToReview - Utilisateur non autorisé')
        throw new Error('Vous n\'êtes pas autorisé à répondre à cet avis')
      }

      // Vérifier qu'il n'y a pas déjà une réponse
      console.log('🔍 respondToReview - Vérification de l\'existence d\'une réponse...')
      const { data: existingResponse, error: existingError } = await supabase
        .from('responses')
        .select('id')
        .eq('review_id', reviewId)
        .single()

      console.log('📊 respondToReview - Résultat vérification réponse existante:', { existingResponse, error: existingError })

      if (existingResponse) {
        console.error('❌ respondToReview - Une réponse existe déjà')
        throw new Error('Une réponse existe déjà pour cet avis')
      }

      // Créer la réponse
      console.log('💾 respondToReview - Création de la réponse...')
      const insertData = {
        review_id: reviewId,
        business_owner_id: user.value.id,
        content: content
      }
      console.log('💾 respondToReview - Données à insérer:', insertData)

      const { data: response, error: responseError } = await supabase
        .from('responses')
        .insert(insertData)
        .select()
        .single()

      console.log('📊 respondToReview - Résultat insertion:', { response, error: responseError })

      if (responseError) {
        console.error('❌ respondToReview - Erreur lors de l\'insertion:', responseError)
        throw responseError
      }

      console.log('✅ respondToReview - Réponse créée avec succès:', response)
      return response
    } catch (error) {
      console.error('❌ respondToReview - Erreur générale:', error)
      throw error
    }
  }

  // Modifier une réponse existante
  const updateResponse = async (responseId: string, content: string): Promise<Response> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const { data: response, error } = await supabase
        .from('responses')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', responseId)
        .eq('business_owner_id', user.value.id)
        .select()
        .single()

      if (error) throw error

      return response
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réponse:', error)
      throw error
    }
  }

  // Supprimer une réponse
  const deleteResponse = async (responseId: string): Promise<void> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const { error } = await supabase
        .from('responses')
        .delete()
        .eq('id', responseId)
        .eq('business_owner_id', user.value.id)

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la suppression de la réponse:', error)
      throw error
    }
  }

  // Signaler un avis (placeholder pour l'instant)
  const reportReview = async (reviewId: string, reason: string): Promise<void> => {
    // TODO: Implémenter le système de signalement
    console.log('Signalement d\'avis:', { reviewId, reason })
    
    // Pour l'instant, on simule juste l'action
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Obtenir les statistiques des avis
  const getReviewsStats = async () => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.value.id)

      if (businessError) throw businessError

      if (!businesses || businesses.length === 0) {
        return {
          total: 0,
          withResponse: 0,
          withoutResponse: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      }

      const businessIds = businesses.map(b => b.id)

      // Compter les avis totaux
      const { count: total, error: totalError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds)

      if (totalError) throw totalError

      // Compter les avis avec réponse
      const { count: withResponse, error: responseError } = await supabase
        .from('reviews')
        .select(`
          *,
          responses!inner(id)
        `, { count: 'exact', head: true })
        .in('business_id', businessIds)

      if (responseError) throw responseError

      // Récupérer la distribution des notes
      const { data: ratings, error: ratingsError } = await supabase
        .from('reviews')
        .select('rating')
        .in('business_id', businessIds)

      if (ratingsError) throw ratingsError

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      let totalRating = 0

      ratings?.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++
        totalRating += review.rating
      })

      const averageRating = ratings?.length ? totalRating / ratings.length : 0

      return {
        total: total || 0,
        withResponse: withResponse || 0,
        withoutResponse: (total || 0) - (withResponse || 0),
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  return {
    getAllReviews,
    respondToReview,
    updateResponse,
    deleteResponse,
    reportReview,
    getReviewsStats
  }
}
