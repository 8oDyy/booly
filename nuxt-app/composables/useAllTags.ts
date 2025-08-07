import { useSupabaseClient } from '#imports'
import { ref, onMounted } from 'vue'

export const useAllTags = () => {
  const allTags = ref<{ id: string; name: string }[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchAllTags = async () => {
    loading.value = true
    error.value = null
    
    try {
      const supabase = useSupabaseClient()
      
      // Requête pour obtenir tous les tags
      const { data, error: supabaseError } = await supabase
        .from('tags')
        .select('id, name')
        .order('name')
      
      if (supabaseError) throw supabaseError
      
      // Définir le type pour les éléments de data
      type Tag = {
        id: string;
        name: string;
      }
      
      // Convertir les données en format attendu
      allTags.value = (data as Tag[])?.map(tag => ({
        id: tag.id,
        name: tag.name
      })) || []
      
      console.log('Tous les tags récupérés:', allTags.value)
    } catch (err) {
      console.error('Erreur lors de la récupération des tags:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      
      // Fallback sur des tags par défaut en cas d'erreur
      allTags.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAllTags()
  })

  return {
    allTags,
    loading,
    error,
    fetchAllTags
  }
}
