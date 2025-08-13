import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

interface ValidateCheckRequest {
  checkId: string
}

interface ValidateCheckResponse {
  success: boolean
  business?: {
    id: string
    name: string
    description: string | null
    address: string | null
    city: string | null
    average_rating: number | null
    review_count: number | null
  }
  canCreateReview?: boolean
  error?: string
}

export default defineEventHandler(async (event): Promise<ValidateCheckResponse> => {
  try {
    // Vérifier que c'est une requête POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Récupérer les données de la requête
    const body = await readBody<ValidateCheckRequest>(event)
    
    if (!body.checkId) {
      return {
        success: false,
        error: 'ID de check manquant'
      }
    }

    // Initialiser Supabase avec la clé de service
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

    console.log('🔍 Validation du check:', body.checkId)

    // 1. Vérifier que le check existe et récupérer les infos business
    const { data: check, error: checkError } = await supabase
      .from('checks')
      .select(`
        *,
        businesses (
          id,
          name,
          description,
          address,
          city,
          average_rating,
          review_count
        )
      `)
      .eq('id', body.checkId)
      .single()

    console.log('📊 Résultat check:', { check, checkError })

    if (checkError || !check) {
      console.error('❌ Check non trouvé:', checkError)
      return {
        success: false,
        error: 'Check invalide ou expiré'
      }
    }

    // 2. Vérifier si le check n'a pas expiré
    if (check.expires_at && new Date(check.expires_at) < new Date()) {
      console.error('❌ Check expiré:', check.expires_at)
      return {
        success: false,
        error: 'Ce scan a expiré. Veuillez scanner à nouveau.'
      }
    }

    // 3. Vérifier si un avis existe déjà pour ce check
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('check_id', body.checkId)
      .single()

    console.log('📝 Avis existant:', { existingReview, reviewError })

    const canCreateReview = !existingReview
    console.log('✅ Peut créer avis:', canCreateReview)

    return {
      success: true,
      business: check.businesses as any,
      canCreateReview
    }

  } catch (error) {
    console.error('❌ Erreur lors de la validation du check:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return {
      success: false,
      error: `Erreur technique lors de la validation: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
})
