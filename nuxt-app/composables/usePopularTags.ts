import { useSupabaseClient } from '#imports'
import { ref, onMounted } from 'vue'

export const usePopularTags = () => {
  const popularTags = ref<{ id: string; name: string; count: number }[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchPopularTags = async () => {
    loading.value = true
    error.value = null
    
    try {
      const supabase = useSupabaseClient()
      
      // Requête pour obtenir les tags les plus utilisés
      const { data, error: supabaseError } = await supabase
        .from('business_tags')
        .select(`
          tag_id,
          tag:tags!business_tags_tag_id_fkey (
            id, 
            name
          )
        `)
        .not('tag', 'is', null)
      
      if (supabaseError) throw supabaseError
      
      // Compter les occurrences de chaque tag
      const tagCounts: Record<string, { id: string; name: string; count: number }> = {}
      
      // Définir le type pour les éléments de data
      type BusinessTag = {
        tag_id: string;
        tag: {
          id: string;
          name: string;
        } | null;
      }
      
      // Utiliser le type défini pour éviter les erreurs TypeScript
      (data as BusinessTag[])?.forEach(item => {
        if (item.tag && item.tag.id && item.tag.name) {
          const tagId = item.tag.id
          if (!tagCounts[tagId]) {
            tagCounts[tagId] = { 
              id: tagId, 
              name: item.tag.name, 
              count: 0 
            }
          }
          tagCounts[tagId].count++
        }
      })
      
      // Convertir en tableau, trier par nombre d'occurrences et prendre les 5 premiers
      const sortedTags = Object.values(tagCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(tag => ({
          id: tag.id,
          name: tag.name,
          count: tag.count
        }))
      
      popularTags.value = sortedTags
      console.log('Tags populaires récupérés:', sortedTags)
    } catch (err) {
      console.error('Erreur lors de la récupération des tags populaires:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      
      // Fallback sur des tags par défaut en cas d'erreur
      popularTags.value = [
        { id: 'terrasse', name: 'Terrasse', count: 0 },
        { id: 'romantique', name: 'Romantique', count: 0 },
        { id: 'familial', name: 'Familial', count: 0 },
        { id: 'wifi', name: 'WiFi', count: 0 },
        { id: 'parking', name: 'Parking', count: 0 }
      ]
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPopularTags()
  })

  return {
    popularTags,
    loading,
    error,
    fetchPopularTags
  }
}
