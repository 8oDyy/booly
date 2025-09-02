import type { Database } from '~/types/supabase'

type ScanTag = Database['public']['Tables']['scan_tags']['Row']
type ScanTagInsert = Database['public']['Tables']['scan_tags']['Insert']
type ScanTagUpdate = Database['public']['Tables']['scan_tags']['Update']

export interface ScanTagWithStats extends ScanTag {
  business?: {
    id: string
    name: string
    address?: string
  }
  total_scans: number
  recent_scans: number
  last_scan_at?: string
}

export const useScanTagsManagement = () => {
  const supabase = useSupabaseClient<Database>()
  
  console.log('🏷️ useScanTagsManagement - Composable initialisé')

  // Récupérer tous les scan tags avec statistiques
  const getAllScanTags = async (status?: 'active' | 'inactive' | 'all') => {
    console.log('🏷️ getAllScanTags - Début récupération', { status })
    
    try {
      let query = supabase
        .from('scan_tags')
        .select(`
          *,
          business:businesses(id, name, address)
        `)
        .order('created_at', { ascending: false })

      // Filtrer par statut si spécifié
      if (status === 'active') {
        query = query.eq('status', 'active')
      } else if (status === 'inactive') {
        query = query.eq('status', 'inactive')
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ getAllScanTags - Erreur Supabase:', error)
        throw error
      }

      console.log('✅ getAllScanTags - Données récupérées:', data?.length || 0, 'scan tags')

      // Récupérer les statistiques de scan pour chaque tag
      const scanTagsWithStats: ScanTagWithStats[] = []
      
      for (const tag of data || []) {
        // Compter les checks pour ce scan tag
        const { count: totalScans } = await supabase
          .from('checks')
          .select('*', { count: 'exact', head: true })
          .eq('tag_id', tag.id)

        // Compter les checks récents (dernières 24h)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        const { count: recentScans } = await supabase
          .from('checks')
          .select('*', { count: 'exact', head: true })
          .eq('tag_id', tag.id)
          .gte('created_at', yesterday.toISOString())

        scanTagsWithStats.push({
          ...tag,
          business: tag.business ? {
            id: tag.business.id,
            name: tag.business.name,
            address: tag.business.address || undefined
          } : undefined,
          total_scans: totalScans || 0,
          recent_scans: recentScans || 0,
          last_scan_at: undefined // À implémenter si nécessaire
        })
      }

      return scanTagsWithStats
    } catch (error) {
      console.error('❌ getAllScanTags - Erreur:', error)
      throw error
    }
  }

  // Créer un nouveau scan tag
  const createScanTag = async (scanTagData: ScanTagInsert) => {
    console.log('🏷️ createScanTag - Création scan tag:', scanTagData)
    
    try {
      const { data, error } = await supabase
        .from('scan_tags')
        .insert(scanTagData)
        .select(`
          *,
          business:businesses(id, name, address)
        `)
        .single()

      if (error) {
        console.error('❌ createScanTag - Erreur Supabase:', error)
        throw error
      }

      console.log('✅ createScanTag - Scan tag créé:', data)
      return data
    } catch (error) {
      console.error('❌ createScanTag - Erreur:', error)
      throw error
    }
  }

  // Mettre à jour un scan tag
  const updateScanTag = async (id: string, updates: ScanTagUpdate) => {
    console.log('🏷️ updateScanTag - Mise à jour scan tag:', { id, updates })
    
    try {
      const { data, error } = await supabase
        .from('scan_tags')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          business:businesses(id, name, address)
        `)
        .single()

      if (error) {
        console.error('❌ updateScanTag - Erreur Supabase:', error)
        throw error
      }

      console.log('✅ updateScanTag - Scan tag mis à jour:', data)
      return data
    } catch (error) {
      console.error('❌ updateScanTag - Erreur:', error)
      throw error
    }
  }

  // Supprimer un scan tag
  const deleteScanTag = async (id: string) => {
    console.log('🏷️ deleteScanTag - Suppression scan tag:', id)
    
    try {
      const { error } = await supabase
        .from('scan_tags')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ deleteScanTag - Erreur Supabase:', error)
        throw error
      }

      console.log('✅ deleteScanTag - Scan tag supprimé:', id)
      return true
    } catch (error) {
      console.error('❌ deleteScanTag - Erreur:', error)
      throw error
    }
  }

  // Récupérer les statistiques des scan tags
  const getScanTagsStats = async () => {
    console.log('🏷️ getScanTagsStats - Récupération statistiques')
    
    try {
      // Compter les scan tags par statut
      const { data: scanTagsData, error: scanTagsError } = await supabase
        .from('scan_tags')
        .select('status')

      if (scanTagsError) {
        console.error('❌ getScanTagsStats - Erreur scan tags:', scanTagsError)
        throw scanTagsError
      }

      // Compter les scans totaux
      const { count: totalScans, error: scansError } = await supabase
        .from('checks')
        .select('*', { count: 'exact', head: true })

      if (scansError) {
        console.error('❌ getScanTagsStats - Erreur scans:', scansError)
        throw scansError
      }

      // Compter les scans récents (dernières 24h)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const { count: recentScans, error: recentScansError } = await supabase
        .from('checks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString())

      if (recentScansError) {
        console.error('❌ getScanTagsStats - Erreur scans récents:', recentScansError)
        throw recentScansError
      }

      const stats = {
        totalScanTags: scanTagsData?.length || 0,
        activeScanTags: scanTagsData?.filter((tag: any) => tag.status === 'active').length || 0,
        inactiveScanTags: scanTagsData?.filter((tag: any) => tag.status === 'inactive').length || 0,
        totalScans: totalScans || 0,
        recentScans: recentScans || 0
      }

      console.log('✅ getScanTagsStats - Statistiques:', stats)
      return stats
    } catch (error) {
      console.error('❌ getScanTagsStats - Erreur:', error)
      throw error
    }
  }

  return {
    getAllScanTags,
    createScanTag,
    updateScanTag,
    deleteScanTag,
    getScanTagsStats
  }
}
