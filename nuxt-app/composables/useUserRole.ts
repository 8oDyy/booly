import type { Database } from '~/types/supabase'

export const useUserRole = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient<Database>()

  // État réactif pour le statut pro
  const isPro = ref<boolean | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Vérifier si l'utilisateur actuel est un professionnel
   * Un utilisateur est considéré comme pro s'il possède au moins un établissement
   */
  const checkProStatus = async (): Promise<boolean> => {
    if (!user.value) {
      isPro.value = false
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      const { data: businesses, error: dbError } = await client
        .from('businesses')
        .select('id')
        .eq('owner_id', user.value.id)
        .limit(1)

      if (dbError) {
        console.error('Erreur lors de la vérification du statut pro:', dbError)
        error.value = dbError.message
        isPro.value = false
        return false
      }

      const isProUser = businesses && businesses.length > 0
      isPro.value = isProUser
      return isProUser

    } catch (err: any) {
      console.error('Erreur lors de la vérification du statut pro:', err)
      error.value = err.message || 'Erreur inconnue'
      isPro.value = false
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtenir la liste des établissements possédés par l'utilisateur
   */
  const getUserBusinesses = async () => {
    if (!user.value) return []

    try {
      const { data: businesses, error: dbError } = await client
        .from('businesses')
        .select(`
          id,
          name,
          address,
          city,
          category_id,
          average_rating,
          review_count,
          created_at
        `)
        .eq('owner_id', user.value.id)
        .order('created_at', { ascending: false })

      if (dbError) {
        console.error('Erreur lors de la récupération des établissements:', dbError)
        return []
      }

      return businesses || []
    } catch (err) {
      console.error('Erreur lors de la récupération des établissements:', err)
      return []
    }
  }

  /**
   * Vérifier automatiquement le statut pro lors des changements d'utilisateur
   */
  watch(user, async (newUser) => {
    if (newUser) {
      await checkProStatus()
    } else {
      isPro.value = false
    }
  }, { immediate: true })

  return {
    isPro: readonly(isPro),
    isLoading: readonly(isLoading),
    error: readonly(error),
    checkProStatus,
    getUserBusinesses
  }
}
