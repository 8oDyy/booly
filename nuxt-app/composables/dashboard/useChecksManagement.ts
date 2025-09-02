import { ref } from 'vue'
import type { Database } from '~/types/supabase'

type Check = Database['public']['Tables']['checks']['Row']
type ScanTag = Database['public']['Tables']['scan_tags']['Row']
type CheckInsert = Database['public']['Tables']['checks']['Insert']
type ScanTagInsert = Database['public']['Tables']['scan_tags']['Insert']
type ScanTagUpdate = Database['public']['Tables']['scan_tags']['Update']

export interface CheckWithDetails extends Check {
  scan_tag: ScanTag
  business: {
    id: string
    name: string
  }
  isExpired: boolean
  timeRemaining?: string
}

export interface ScanTagWithStats extends ScanTag {
  checksCount: number
  lastScanAt?: string
  business: {
    id: string
    name: string
  }
}

export interface ChecksStats {
  totalChecks: number
  activeChecks: number
  expiredChecks: number
  totalScanTags: number
  activeScanTags: number
}

export interface CheckFilters {
  status?: 'active' | 'expired'
  tagType?: 'QR' | 'NFC'
  businessId?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export const useChecksManagement = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  console.log('🔧 useChecksManagement - Initialisation du composable')

  // Récupérer tous les checks pour les établissements de l'utilisateur
  const getAllChecks = async (filters?: CheckFilters): Promise<CheckWithDetails[]> => {
    console.log('🔍 getAllChecks - Début de la fonction')
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

      // 2. Construire la requête des checks avec filtres
      console.log('🔍 Construction de la requête Supabase pour les checks')
      
      let query = supabase
        .from('checks')
        .select(`
          *,
          scan_tags!inner(
            id,
            code,
            label,
            type,
            status,
            business_id,
            created_at,
            updated_at,
            deactivated_at,
            businesses!inner(id, name)
          )
        `)
        .in('business_id', businessIds)
        .order('created_at', { ascending: false })

      console.log('📝 Requête de base construite')

      // Appliquer les filtres si fournis
      if (filters?.status) {
        console.log('🔍 Filtre status appliqué:', filters.status)
        const now = new Date().toISOString()
        if (filters.status === 'active') {
          query = query.gt('expires_at', now)
        } else if (filters.status === 'expired') {
          query = query.lte('expires_at', now)
        }
      }

      if (filters?.businessId) {
        console.log('🔍 Filtre businessId appliqué:', filters.businessId)
        query = query.eq('business_id', filters.businessId)
      }

      console.log('🚀 Exécution de la requête Supabase...')
      const { data: checksData, error: checksError } = await query

      console.log('📊 Résultat de la requête:', { checksData, error: checksError })

      if (checksError) throw checksError

      const now = new Date()

      // 3. Transformer les données pour inclure les détails
      return (checksData || []).map(check => {
        const expiresAt = check.expires_at ? new Date(check.expires_at) : null
        const isExpired = expiresAt ? expiresAt <= now : false
        
        let timeRemaining = undefined
        if (expiresAt && !isExpired) {
          const diff = expiresAt.getTime() - now.getTime()
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          timeRemaining = `${hours}h ${minutes}m`
        }

        return {
          ...check,
          scan_tag: check.scan_tags,
          business: check.scan_tags.businesses,
          isExpired,
          timeRemaining
        }
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des checks:', error)
      throw error
    }
  }

  // Récupérer tous les scan tags de l'utilisateur
  const getScanTags = async (): Promise<ScanTagWithStats[]> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.value.id)

      if (!businesses || businesses.length === 0) {
        return []
      }

      const businessIds = businesses.map(b => b.id)

      const { data: scanTags, error } = await supabase
        .from('scan_tags')
        .select(`
          *,
          businesses!inner(id, name),
          checks(id, created_at)
        `)
        .in('business_id', businessIds)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (scanTags || []).map(tag => ({
        ...tag,
        business: tag.businesses,
        checksCount: tag.checks?.length || 0,
        lastScanAt: tag.checks?.[0]?.created_at
      }))
    } catch (error) {
      console.error('Erreur lors de la récupération des scan tags:', error)
      throw error
    }
  }

  // Créer un nouveau scan tag
  const createScanTag = async (data: {
    code: string
    label?: string
    type: 'QR' | 'NFC'
    businessId: string
  }) => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const { data: scanTag, error } = await supabase
        .from('scan_tags')
        .insert({
          code: data.code,
          label: data.label,
          type: data.type,
          business_id: data.businessId,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      return scanTag
    } catch (error) {
      console.error('Erreur lors de la création du scan tag:', error)
      throw error
    }
  }

  // Mettre à jour un scan tag
  const updateScanTag = async (id: string, data: ScanTagUpdate) => {
    try {
      const { data: scanTag, error } = await supabase
        .from('scan_tags')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return scanTag
    } catch (error) {
      console.error('Erreur lors de la mise à jour du scan tag:', error)
      throw error
    }
  }

  // Supprimer un scan tag
  const deleteScanTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scan_tags')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la suppression du scan tag:', error)
      throw error
    }
  }

  // Obtenir les statistiques des checks
  const getChecksStats = async (): Promise<ChecksStats> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.value.id)

      if (!businesses || businesses.length === 0) {
        return {
          totalChecks: 0,
          activeChecks: 0,
          expiredChecks: 0,
          totalScanTags: 0,
          activeScanTags: 0
        }
      }

      const businessIds = businesses.map(b => b.id)
      const now = new Date().toISOString()

      const [
        { count: totalChecks },
        { count: activeChecks },
        { count: expiredChecks },
        { count: totalScanTags },
        { count: activeScanTags }
      ] = await Promise.all([
        supabase.from('checks').select('*', { count: 'exact', head: true }).in('business_id', businessIds),
        supabase.from('checks').select('*', { count: 'exact', head: true }).in('business_id', businessIds).gt('expires_at', now),
        supabase.from('checks').select('*', { count: 'exact', head: true }).in('business_id', businessIds).lte('expires_at', now),
        supabase.from('scan_tags').select('*', { count: 'exact', head: true }).in('business_id', businessIds),
        supabase.from('scan_tags').select('*', { count: 'exact', head: true }).in('business_id', businessIds).eq('status', 'active')
      ])

      return {
        totalChecks: totalChecks || 0,
        activeChecks: activeChecks || 0,
        expiredChecks: expiredChecks || 0,
        totalScanTags: totalScanTags || 0,
        activeScanTags: activeScanTags || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        totalChecks: 0,
        activeChecks: 0,
        expiredChecks: 0,
        totalScanTags: 0,
        activeScanTags: 0
      }
    }
  }

  return {
    getAllChecks,
    getScanTags,
    createScanTag,
    updateScanTag,
    deleteScanTag,
    getChecksStats
  }
}
