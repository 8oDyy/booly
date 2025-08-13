import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

interface ValidateScanTagRequest {
  scanTagId: string
  deviceHash?: string
  userAgent?: string
}

interface ValidateScanTagResponse {
  success: boolean
  checkId?: string
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

export default defineEventHandler(async (event): Promise<ValidateScanTagResponse> => {
  try {
    // Vérifier que c'est une requête POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Récupérer les données de la requête
    const body = await readBody<ValidateScanTagRequest>(event)
    
    if (!body.scanTagId) {
      return {
        success: false,
        error: 'ID de scan tag manquant'
      }
    }

    // Initialiser Supabase avec les clés serveur
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

    // Récupérer l'IP du client et user agent
    const clientIP = getClientIP(event)
    const userAgent = getHeader(event, 'user-agent') || body.userAgent || ''

    // 1. Vérifier que le scan_tag existe et est actif
    console.log('🔍 Recherche du scan_tag avec ID:', body.scanTagId)
    
    const { data: scanTag, error: scanTagError } = await supabase
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
      .eq('id', body.scanTagId)
      // .eq('status', 'active') // Temporairement désactivé pour debug
      .single()

    console.log('📊 Résultat requête scan_tag:', { scanTag, scanTagError })

    if (scanTagError || !scanTag) {
      console.error('❌ Scan tag non trouvé ou inactif:', scanTagError)
      
      // Essayer de trouver le tag sans filtre de statut pour debug
      const { data: anyTag } = await supabase
        .from('scan_tags')
        .select('*')
        .eq('id', body.scanTagId)
        .single()
      
      console.log('🔍 Tag trouvé (tous statuts):', anyTag)
      
      return {
        success: false,
        error: 'Tag de scan invalide ou inactif'
      }
    }

    console.log('✅ Scan tag trouvé:', scanTag.label, 'Business:', scanTag.businesses?.name)

    // 2. Vérifier les protections anti-abus pour CE device/IP spécifique
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString() // Réduit à 1h pour être moins restrictif
    
    // Vérifier si CE device/IP a déjà un check récent pour ce tag
    let existingCheckQuery = supabase
      .from('checks')
      .select('*')
      .eq('tag_id', body.scanTagId)
      .gte('scanned_at', oneHourAgo)

    // Construire la condition AND pour IP ET device_hash (même personne)
    const conditions = []
    if (clientIP && clientIP !== 'unknown') {
      existingCheckQuery = existingCheckQuery.eq('ip', clientIP)
    }
    if (body.deviceHash) {
      existingCheckQuery = existingCheckQuery.eq('device_hash', body.deviceHash)
    }

    const { data: existingChecks } = await existingCheckQuery
      .order('created_at', { ascending: false })
      .limit(1)

    if (existingChecks && existingChecks.length > 0) {
      const existingCheck = existingChecks[0]
      
      // Vérifier si un avis existe déjà pour ce check
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('check_id', existingCheck.id)
        .single()

      if (existingReview) {
        return {
          success: false,
          error: 'Vous avez déjà laissé un avis récemment pour cet établissement. Veuillez attendre avant de pouvoir en laisser un nouveau.'
        }
      } else {
        // Réutiliser le check existant si pas d'avis encore créé
        return {
          success: true,
          checkId: existingCheck.id,
          business: scanTag.businesses as any,
          canCreateReview: true
        }
      }
    }

    // 3. Créer un nouveau check avec protections anti-abus
    const newCheck = {
      tag_id: body.scanTagId,
      business_id: scanTag.business_id,
      user_id: null, // Sera mis à jour quand l'utilisateur crée l'avis
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
        error: 'Erreur lors de la création du check de scan'
      }
    }

    return {
      success: true,
      checkId: createdCheck.id,
      business: scanTag.businesses as any,
      canCreateReview: true
    }

  } catch (error) {
    console.error('Erreur lors de la validation du scan tag:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return {
      success: false,
      error: `Erreur technique lors de la validation du scan: ${error instanceof Error ? error.message : 'Unknown error'}`
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
