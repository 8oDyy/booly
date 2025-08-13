import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

interface ScanValidationRequest {
  tagValue: string
  deviceHash?: string
  userAgent?: string
}

interface ScanValidationResponse {
  success: boolean
  checkId?: string
  businessId?: string
  error?: string
  canCreateReview?: boolean
}

export default defineEventHandler(async (event): Promise<ScanValidationResponse> => {
  try {
    // Vérifier que c'est une requête POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Récupérer les données de la requête
    const body = await readBody<ScanValidationRequest>(event)
    
    if (!body.tagValue) {
      return {
        success: false,
        error: 'Tag value manquant'
      }
    }

    // Initialiser Supabase avec les clés serveur
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!, // Utiliser la service key pour les opérations serveur
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Récupérer l'IP du client
    const clientIP = getClientIP(event)
    const userAgent = getHeader(event, 'user-agent') || body.userAgent || ''

    // 1. Vérifier si le tag existe et est actif
    const { data: scanTag, error: tagError } = await supabase
      .from('scan_tags')
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
      .eq('tag_value', body.tagValue)
      .eq('tag_status', 'active')
      .single()

    if (tagError || !scanTag) {
      return {
        success: false,
        error: 'Tag QR/NFC invalide ou inactif'
      }
    }

    // 2. Vérifier si un check existe déjà pour ce tag + device dans les dernières 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    let existingCheckQuery = supabase
      .from('checks')
      .select('*')
      .eq('tag_id', scanTag.id)
      .gte('scanned_at', twentyFourHoursAgo)

    // Si on a un device_hash, l'utiliser pour la vérification
    if (body.deviceHash) {
      existingCheckQuery = existingCheckQuery.eq('device_hash', body.deviceHash)
    }

    const { data: existingChecks } = await existingCheckQuery

    if (existingChecks && existingChecks.length > 0) {
      const existingCheck = existingChecks[0]
      
      // Vérifier si un avis existe déjà pour ce check
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('check_id', existingCheck.id)
        .single()

      return {
        success: true,
        checkId: existingCheck.id,
        businessId: scanTag.business_id,
        canCreateReview: !existingReview,
        error: existingReview ? 'Un avis a déjà été créé pour ce scan' : undefined
      }
    }

    // 3. Créer un nouveau check
    const newCheck = {
      tag_id: scanTag.id,
      business_id: scanTag.business_id,
      user_id: null, // Sera mis à jour quand l'utilisateur se connecte
      device_hash: body.deviceHash || null,
      ip: clientIP,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Expire dans 24h
    }

    const { data: createdCheck, error: checkError } = await supabase
      .from('checks')
      .insert(newCheck)
      .select()
      .single()

    if (checkError || !createdCheck) {
      console.error('Erreur lors de la création du check:', checkError)
      return {
        success: false,
        error: 'Erreur lors de la création du check'
      }
    }

    return {
      success: true,
      checkId: createdCheck.id,
      businessId: scanTag.business_id,
      canCreateReview: true
    }

  } catch (error) {
    console.error('Erreur lors de la validation du scan:', error)
    return {
      success: false,
      error: 'Erreur technique lors de la validation du scan'
    }
  }
})

/**
 * Récupère l'IP du client en tenant compte des proxies
 */
function getClientIP(event: any): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIP = getHeader(event, 'x-real-ip')
  const cfConnectingIP = getHeader(event, 'cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return event.node.req.socket?.remoteAddress || 'unknown'
}
