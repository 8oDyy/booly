import type { Database } from '~/types/supabase'

type Business = Database['public']['Tables']['businesses']['Row']
type BusinessUpdate = Database['public']['Tables']['businesses']['Update']
type BusinessInsert = Database['public']['Tables']['businesses']['Insert']

export const useBusinessManagement = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // État réactif de l'entreprise
  const business = ref<Business | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Charger l'entreprise de l'utilisateur
  const loadUserBusiness = async () => {
    if (!user.value?.id) {
      console.warn('🔐 useBusinessManagement - Aucun utilisateur connecté')
      return null
    }

    try {
      loading.value = true
      error.value = null

      console.log('🏢 useBusinessManagement - Chargement entreprise pour:', user.value.id)

      const { data, error: supabaseError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.value.id)
        .single()

      if (supabaseError) {
        console.error('❌ useBusinessManagement - Erreur Supabase:', supabaseError)
        
        // Si l'entreprise n'existe pas, ce n'est pas une erreur critique
        if (supabaseError.code === 'PGRST116') {
          console.log('ℹ️ useBusinessManagement - Aucune entreprise trouvée')
          business.value = null
          return null
        }
        
        throw supabaseError
      }

      console.log('✅ useBusinessManagement - Entreprise chargée:', data.name)
      business.value = data
      return data

    } catch (err) {
      console.error('❌ useBusinessManagement - Erreur lors du chargement:', err)
      error.value = 'Erreur lors du chargement de l\'entreprise'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Créer une nouvelle entreprise
  const createBusiness = async (businessData: Omit<BusinessInsert, 'owner_id'>) => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      loading.value = true
      error.value = null

      console.log('📝 useBusinessManagement - Création entreprise:', businessData.name)

      const newBusiness: BusinessInsert = {
        ...businessData,
        owner_id: user.value.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from('businesses')
        .insert(newBusiness)
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ useBusinessManagement - Erreur création:', supabaseError)
        throw supabaseError
      }

      console.log('✅ useBusinessManagement - Entreprise créée:', data.name)
      business.value = data
      return data

    } catch (err) {
      console.error('❌ useBusinessManagement - Erreur lors de la création:', err)
      error.value = 'Erreur lors de la création de l\'entreprise'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour l'entreprise
  const updateBusiness = async (updates: BusinessUpdate) => {
    if (!user.value?.id || !business.value?.id) {
      throw new Error('Utilisateur non connecté ou entreprise non trouvée')
    }

    try {
      loading.value = true
      error.value = null

      console.log('💾 useBusinessManagement - Mise à jour entreprise:', updates)

      const { data, error: supabaseError } = await supabase
        .from('businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', business.value.id)
        .eq('owner_id', user.value.id) // Sécurité supplémentaire
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ useBusinessManagement - Erreur mise à jour:', supabaseError)
        throw supabaseError
      }

      console.log('✅ useBusinessManagement - Entreprise mise à jour:', data.name)
      business.value = data
      return data

    } catch (err) {
      console.error('❌ useBusinessManagement - Erreur lors de la mise à jour:', err)
      error.value = 'Erreur lors de la sauvegarde'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Supprimer l'entreprise
  const deleteBusiness = async () => {
    if (!user.value?.id || !business.value?.id) {
      throw new Error('Utilisateur non connecté ou entreprise non trouvée')
    }

    try {
      loading.value = true
      error.value = null

      console.log('🗑️ useBusinessManagement - Suppression entreprise:', business.value.name)

      const { error: supabaseError } = await supabase
        .from('businesses')
        .delete()
        .eq('id', business.value.id)
        .eq('owner_id', user.value.id) // Sécurité supplémentaire

      if (supabaseError) {
        console.error('❌ useBusinessManagement - Erreur suppression:', supabaseError)
        throw supabaseError
      }

      console.log('✅ useBusinessManagement - Entreprise supprimée')
      business.value = null
      return true

    } catch (err) {
      console.error('❌ useBusinessManagement - Erreur lors de la suppression:', err)
      error.value = 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Charger automatiquement l'entreprise quand l'utilisateur change
  watch(user, async (newUser) => {
    if (newUser?.id) {
      await loadUserBusiness()
    } else {
      business.value = null
    }
  }, { immediate: true })

  return {
    business: readonly(business),
    loading: readonly(loading),
    error: readonly(error),
    loadUserBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness
  }
}
