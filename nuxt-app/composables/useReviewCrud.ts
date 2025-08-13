import type { Database } from '~/types/supabase'

type Review = Database['public']['Tables']['reviews']['Row']
type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

interface ReviewFormData {
  rating: number
  content: string
  checkId: string
  businessId: string
}

interface CreateReviewResponse {
  success: boolean
  review?: Review
  error?: string
}

export const useReviewCrud = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  /**
   * Crée un avis basé sur un check valide (avec ou sans compte)
   */
  const createReviewFromCheck = async (formData: ReviewFormData): Promise<CreateReviewResponse> => {
    try {
      // Permettre les avis anonymes - pas besoin d'être connecté

      // 1. Vérifier que le check est valide et n'a pas déjà d'avis
      const { data: check, error: checkError } = await supabase
        .from('checks')
        .select('*')
        .eq('id', formData.checkId)
        .single()

      if (checkError || !check) {
        return {
          success: false,
          error: 'Check invalide'
        }
      }

      // Vérifier que le check appartient à l'utilisateur ou au device (si utilisateur connecté)
      if (user.value && check.user_id && check.user_id !== user.value.id) {
        return {
          success: false,
          error: 'Ce check ne vous appartient pas'
        }
      }

      // Vérifier que le check n'a pas expiré
      if (check.expires_at && new Date(check.expires_at) < new Date()) {
        return {
          success: false,
          error: 'Ce scan a expiré. Veuillez scanner à nouveau.'
        }
      }

      // Vérifier qu'aucun avis n'existe déjà pour ce check
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('check_id', formData.checkId)
        .single()

      if (existingReview) {
        return {
          success: false,
          error: 'Un avis a déjà été créé pour ce scan'
        }
      }

      // 2. Créer l'avis
      const reviewData: ReviewInsert = {
        business_id: formData.businessId,
        user_id: user.value?.id || crypto.randomUUID(), // Générer un ID anonyme si pas connecté
        check_id: formData.checkId,
        rating: formData.rating,
        content: formData.content
      }

      const { data: createdReview, error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single()

      if (reviewError || !createdReview) {
        return {
          success: false,
          error: 'Erreur lors de la création de l\'avis'
        }
      }

      // 3. Mettre à jour les statistiques de l'établissement
      await updateBusinessStats(formData.businessId)

      return {
        success: true,
        review: createdReview
      }

    } catch (error) {
      console.error('Erreur lors de la création de l\'avis:', error)
      return {
        success: false,
        error: 'Erreur technique lors de la création de l\'avis'
      }
    }
  }

  /**
   * Met à jour les statistiques d'un établissement (note moyenne, nombre d'avis)
   */
  const updateBusinessStats = async (businessId: string) => {
    try {
      // Calculer la nouvelle moyenne et le nombre d'avis
      const { data: stats } = await supabase
        .from('reviews')
        .select('rating')
        .eq('business_id', businessId)

      if (stats && stats.length > 0) {
        const averageRating = stats.reduce((sum, review) => sum + review.rating, 0) / stats.length
        const reviewCount = stats.length

        // Mettre à jour l'établissement
        await supabase
          .from('businesses')
          .update({
            average_rating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
            review_count: reviewCount,
            last_review_at: new Date().toISOString()
          })
          .eq('id', businessId)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error)
    }
  }

  /**
   * Récupère les avis d'un établissement
   */
  const getBusinessReviews = async (businessId: string, limit = 10, offset = 0) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return { data, error }
  }

  /**
   * Récupère les avis d'un utilisateur
   */
  const getUserReviews = async (userId?: string, limit = 10, offset = 0) => {
    const targetUserId = userId || user.value?.id

    if (!targetUserId) {
      return { data: null, error: 'Utilisateur non connecté' }
    }

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        businesses (
          id,
          name,
          address,
          city
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return { data, error }
  }

  /**
   * Supprime un avis (seulement par son auteur)
   */
  const deleteReview = async (reviewId: string) => {
    if (!user.value) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    try {
      // Vérifier que l'avis appartient à l'utilisateur
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .select('user_id, business_id')
        .eq('id', reviewId)
        .single()

      if (reviewError || !review) {
        return { success: false, error: 'Avis introuvable' }
      }

      if (review.user_id !== user.value.id) {
        return { success: false, error: 'Vous ne pouvez supprimer que vos propres avis' }
      }

      // Supprimer l'avis
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

      if (deleteError) {
        return { success: false, error: 'Erreur lors de la suppression' }
      }

      // Mettre à jour les statistiques de l'établissement
      await updateBusinessStats(review.business_id)

      return { success: true }

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error)
      return { success: false, error: 'Erreur technique' }
    }
  }

  /**
   * Modifie un avis existant
   */
  const updateReview = async (reviewId: string, updateData: Partial<ReviewFormData>) => {
    if (!user.value) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    try {
      // Vérifier que l'avis appartient à l'utilisateur
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .select('user_id, business_id')
        .eq('id', reviewId)
        .single()

      if (reviewError || !review) {
        return { success: false, error: 'Avis introuvable' }
      }

      if (review.user_id !== user.value.id) {
        return { success: false, error: 'Vous ne pouvez modifier que vos propres avis' }
      }

      // Préparer les données de mise à jour
      const reviewUpdate: ReviewUpdate = {
        updated_at: new Date().toISOString()
      }

      if (updateData.rating !== undefined) reviewUpdate.rating = updateData.rating
      if (updateData.content !== undefined) reviewUpdate.content = updateData.content

      // Mettre à jour l'avis
      const { data: updatedReview, error: updateError } = await supabase
        .from('reviews')
        .update(reviewUpdate)
        .eq('id', reviewId)
        .select()
        .single()

      if (updateError) {
        return { success: false, error: 'Erreur lors de la mise à jour' }
      }

      // Mettre à jour les statistiques si la note a changé
      if (updateData.rating !== undefined) {
        await updateBusinessStats(review.business_id)
      }

      return { success: true, review: updatedReview }

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avis:', error)
      return { success: false, error: 'Erreur technique' }
    }
  }

  return {
    createReviewFromCheck,
    getBusinessReviews,
    getUserReviews,
    deleteReview,
    updateReview,
    updateBusinessStats
  }
}
