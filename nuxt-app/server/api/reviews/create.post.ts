import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

interface CreateReviewRequest {
  checkId: string
  rating: number
  content: string
  businessId: string
  userId?: string | null
}

interface CreateReviewResponse {
  success: boolean
  reviewId?: string
  error?: string
}

export default defineEventHandler(async (event): Promise<CreateReviewResponse> => {
  try {
    // Vérifier que c'est une requête POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Récupérer les données de la requête
    const body = await readBody<CreateReviewRequest>(event)
    
    // Validation des données
    if (!body.checkId || !body.rating || !body.content || !body.businessId) {
      return {
        success: false,
        error: 'Données manquantes (checkId, rating, content, businessId requis)'
      }
    }

    if (body.rating < 1 || body.rating > 5) {
      return {
        success: false,
        error: 'La note doit être entre 1 et 5'
      }
    }

    if (body.content.trim().length < 10 || body.content.trim().length > 1000) {
      return {
        success: false,
        error: 'Le commentaire doit contenir entre 10 et 1000 caractères'
      }
    }

    // Initialiser Supabase avec la clé de service pour permettre les avis anonymes
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Avis anonymes autorisés - pas de vérification d'utilisateur nécessaire

    // 1. Vérifier que le check existe et est valide
    const { data: check, error: checkError } = await supabase
      .from('checks')
      .select('*')
      .eq('id', body.checkId)
      .single()

    if (checkError || !check) {
      return {
        success: false,
        error: 'Check invalide'
      }
    }

    // Vérifier que le check n'a pas expiré
    if (check.expires_at && new Date(check.expires_at) < new Date()) {
      return {
        success: false,
        error: 'Ce scan a expiré. Veuillez scanner à nouveau.'
      }
    }

    // 2. Vérifier qu'aucun avis n'existe déjà pour ce check
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('check_id', body.checkId)
      .single()

    if (existingReview) {
      return {
        success: false,
        error: 'Un avis a déjà été créé pour ce scan'
      }
    }

    // 3. Créer l'avis avec l'utilisateur connecté ou anonyme
    const ANONYMOUS_USER_ID = 'bc0b58fc-48e1-4629-a3f5-ab328f365a3e' // ID utilisateur anonyme fourni
    const userId = body.userId || ANONYMOUS_USER_ID // Utiliser l'ID utilisateur fourni ou anonyme
    
    console.log('👤 Utilisateur pour l\'avis:', body.userId ? 'Connecté' : 'Anonyme', userId)
    
    const reviewData = {
      business_id: check.business_id!,
      user_id: userId,
      check_id: body.checkId,
      rating: body.rating,
      content: body.content.trim()
    }

    console.log('📝 Données avis à insérer:', reviewData)
    console.log('🔍 Check business_id:', check.business_id)
    console.log('🔍 Check details:', check)

    const { data: createdReview, error: reviewError } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single()

    console.log('📊 Résultat insertion avis:', { createdReview, reviewError })

    if (reviewError || !createdReview) {
      console.error('❌ Erreur lors de la création de l\'avis:', reviewError)
      console.error('❌ Détails erreur:', reviewError?.message, reviewError?.details, reviewError?.hint)
      return {
        success: false,
        error: `Erreur lors de la création de l'avis: ${reviewError?.message || 'Unknown error'}`
      }
    }

    console.log('✅ Avis créé avec succès:', createdReview.id)

    // 4. Mettre à jour les statistiques de l'établissement
    if (check.business_id) {
      await updateBusinessStats(supabase, check.business_id)
    }

    // 4. Mettre à jour le check avec l'ID utilisateur si nécessaire
    if (!check.user_id) {
      await supabase
        .from('checks')
        .update({ user_id: userId })
        .eq('id', body.checkId)
    }

    return {
      success: true,
      reviewId: createdReview.id
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error)
    return {
      success: false,
      error: 'Erreur technique lors de la création de l\'avis'
    }
  }
})

/**
 * Met à jour les statistiques d'un établissement
 */
async function updateBusinessStats(supabase: any, businessId: string) {
  try {
    // Calculer la nouvelle moyenne et le nombre d'avis
    const { data: stats } = await supabase
      .from('reviews')
      .select('rating')
      .eq('business_id', businessId)

    if (stats && stats.length > 0) {
      const averageRating = stats.reduce((sum: number, review: any) => sum + review.rating, 0) / stats.length
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
