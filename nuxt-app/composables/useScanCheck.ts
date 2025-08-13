import type { Database } from '~/types/supabase'

type ScanTag = Database['public']['Tables']['scan_tags']['Row']
type Check = Database['public']['Tables']['checks']['Row']
type CheckInsert = Database['public']['Tables']['checks']['Insert']
type Business = Database['public']['Tables']['businesses']['Row']

interface ScanCheckResponse {
  success: boolean
  check?: Check
  business?: Business
  error?: string
  canCreateReview?: boolean
}

interface CreateCheckData {
  tagValue: string
  deviceHash?: string
  userAgent?: string
}

export const useScanCheck = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  /**
   * Valide un scan de tag QR/NFC et crée un check si valide
   */
  const validateScanAndCreateCheck = async (tagValue: string): Promise<ScanCheckResponse> => {
    try {
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
        .eq('tag_value', tagValue)
        .eq('tag_status', 'active')
        .single()

      if (tagError || !scanTag) {
        return {
          success: false,
          error: 'Tag QR/NFC invalide ou inactif'
        }
      }

      // 2. Générer un hash du device (basé sur user agent + timestamp pour l'unicité)
      const deviceHash = await generateDeviceHash()

      // 3. Vérifier si un check existe déjà pour ce tag + device/user dans les dernières 24h
      const existingCheckQuery = supabase
        .from('checks')
        .select('*')
        .eq('tag_id', scanTag.id)
        .gte('scanned_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      // Si utilisateur connecté, vérifier par user_id, sinon par device_hash
      if (user.value) {
        existingCheckQuery.eq('user_id', user.value.id)
      } else {
        existingCheckQuery.eq('device_hash', deviceHash)
      }

      const { data: existingCheck } = await existingCheckQuery.single()

      if (existingCheck) {
        // Vérifier si un avis existe déjà pour ce check
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('check_id', existingCheck.id)
          .single()

        return {
          success: true,
          check: existingCheck,
          business: scanTag.businesses as Business,
          canCreateReview: !existingReview,
          error: existingReview ? 'Un avis a déjà été créé pour ce scan' : undefined
        }
      }

      // 4. Créer un nouveau check
      const newCheck: CheckInsert = {
        tag_id: scanTag.id,
        business_id: scanTag.business_id,
        user_id: user.value?.id || null,
        device_hash: deviceHash,
        ip: null, // Sera rempli côté serveur
        user_agent: navigator.userAgent,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Expire dans 24h
      }

      const { data: createdCheck, error: checkError } = await supabase
        .from('checks')
        .insert(newCheck)
        .select()
        .single()

      if (checkError || !createdCheck) {
        return {
          success: false,
          error: 'Erreur lors de la création du check'
        }
      }

      return {
        success: true,
        check: createdCheck,
        business: scanTag.businesses as Business,
        canCreateReview: true
      }

    } catch (error) {
      console.error('Erreur lors de la validation du scan:', error)
      return {
        success: false,
        error: 'Erreur technique lors de la validation du scan'
      }
    }
  }

  /**
   * Vérifie si un check est encore valide pour créer un avis
   */
  const validateCheckForReview = async (checkId: string): Promise<ScanCheckResponse> => {
    try {
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
        .eq('id', checkId)
        .single()

      if (checkError || !check) {
        return {
          success: false,
          error: 'Check invalide'
        }
      }

      // Vérifier si le check n'a pas expiré
      if (check.expires_at && new Date(check.expires_at) < new Date()) {
        return {
          success: false,
          error: 'Ce scan a expiré. Veuillez scanner à nouveau.'
        }
      }

      // Vérifier si un avis existe déjà
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('check_id', checkId)
        .single()

      if (existingReview) {
        return {
          success: false,
          error: 'Un avis a déjà été créé pour ce scan'
        }
      }

      return {
        success: true,
        check,
        business: check.businesses as Business,
        canCreateReview: true
      }

    } catch (error) {
      console.error('Erreur lors de la validation du check:', error)
      return {
        success: false,
        error: 'Erreur technique lors de la validation'
      }
    }
  }

  /**
   * Génère un hash unique pour le device
   */
  const generateDeviceHash = async (): Promise<string> => {
    const data = `${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}-${Date.now()}`
    const encoder = new TextEncoder()
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Récupère les informations d'un tag par sa valeur
   */
  const getScanTagInfo = async (tagValue: string) => {
    const { data, error } = await supabase
      .from('scan_tags')
      .select(`
        *,
        businesses (
          id,
          name,
          description,
          address,
          city
        )
      `)
      .eq('tag_value', tagValue)
      .eq('tag_status', 'active')
      .single()

    return { data, error }
  }

  return {
    validateScanAndCreateCheck,
    validateCheckForReview,
    getScanTagInfo,
    generateDeviceHash
  }
}
