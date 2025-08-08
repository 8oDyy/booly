import { ref } from 'vue'
import type { Database } from '~/types/supabase'

/** ------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------- */
const randomImage = () => `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/300`

/** ------------------------------------------------------------------------
 * Row aliases & derived types
 * --------------------------------------------------------------------- */
export type Profile = Database['public']['Tables']['profiles']['Row']

export type Review = Database['public']['Tables']['reviews']['Row'] & {
  business?: {
    id: string
    name: string
    address: string | null
    city: string | null
    postal_code: string | null
    country: string | null
    average_rating: number | null
    price: '1' | '2' | '3' | '4' | null
    image?: string
  }
  photos: Database['public']['Tables']['photos']['Row'][]
}

export type Photo = Database['public']['Tables']['photos']['Row'] & {
  business?: (Database['public']['Tables']['businesses']['Row'] & { image?: string }) | undefined
  review?: Database['public']['Tables']['reviews']['Row'] | null
}

export type Check = Database['public']['Tables']['checks']['Row'] & {
  business?: {
    id: string
    name: string
    address: string | null
    city: string | null
    postal_code: string | null
    country: string | null
    average_rating: number | null
    price: '1' | '2' | '3' | '4' | null
    image?: string
  }
}

/** ------------------------------------------------------------------------
 * Main composable
 * --------------------------------------------------------------------- */
export const useProfile = () => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  /* State */
  const profile = ref<Profile | null>(null)
  const reviews = ref<Review[]>([])
  const photos = ref<Photo[]>([])
  const pendingChecks = ref<Check[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /* -------------------------------------------------------------------- */
  /* Profile                                                              */
  /* -------------------------------------------------------------------- */
  const fetchProfile = async () => {
    if (!user.value) return null
    isLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
      if (err) throw err
      profile.value = data
    } catch (err: any) {
      console.error('Erreur lors de la récupération du profil:', err)
      error.value = err.message || 'Erreur lors de la récupération du profil'
    } finally {
      isLoading.value = false
    }
  }

  /* -------------------------------------------------------------------- */
  /* Reviews                                                              */
  /* -------------------------------------------------------------------- */
  const fetchReviews = async () => {
    if (!user.value) return
    isLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await client
        .from('reviews')
        .select(`
          *,
          business:business_id (
            id, name, address, city, postal_code, country, average_rating, price
          ),
          photos:photos (
            id, url, description, business_id, created_at, review_id, user_id
          )
        `)
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })

      if (err) throw err

      reviews.value = (data || []).map((r): Review => {
        const business = r.business ? { ...r.business, image: randomImage() } : undefined
        return { ...r, business }
      })
    } catch (err: any) {
      console.error('Erreur lors de la récupération des avis:', err)
      error.value = err.message || 'Erreur lors de la récupération des avis'
    } finally {
      isLoading.value = false
    }
  }

  /* -------------------------------------------------------------------- */
  /* Photos                                                               */
  /* -------------------------------------------------------------------- */
  const fetchPhotos = async () => {
    if (!user.value) return
    isLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await client
        .from('photos')
        .select(`
          *,
          business:business_id (
            id, name, address, city, postal_code, country, average_rating, price, created_at, description, category_id, email, phone, website
          ),
          review:review_id ( * )
        `)
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })

      if (err) throw err

    } catch (err: any) {
      console.error('Erreur lors de la récupération des photos:', err)
      error.value = err.message || 'Erreur lors de la récupération des photos'
    } finally {
      isLoading.value = false
    }
  }

  /* -------------------------------------------------------------------- */
  /* Pending checks                                                       */
  /* -------------------------------------------------------------------- */
  const fetchPendingChecks = async () => {
    if (!user.value) return
    isLoading.value = true
    error.value = null
    try {
      const { data: checksData, error: checksErr } = await client
        .from('checks')
        .select(`
          *,
          business:business_id (
            id, name, address, city, postal_code, country, average_rating, price
          )
        `)
        .eq('user_id', user.value.id)
        .is('used', false)
        .order('created_at', { ascending: false })

      if (checksErr) throw checksErr

      const now = new Date()
      pendingChecks.value = (checksData || [])
        .filter(c => !c.expires_at || new Date(c.expires_at) > now)
        .map((c): Check => {
          const business = c.business ? { ...c.business, image: randomImage() } : undefined
          return { ...c, business }
        })
    } catch (err: any) {
      console.error('Erreur lors de la récupération des checks en attente:', err)
      error.value = err.message || 'Erreur lors de la récupération des checks en attente'
      pendingChecks.value = []
    } finally {
      isLoading.value = false
    }
  }

  /* -------------------------------------------------------------------- */
  /* Aggregated loader                                                    */
  /* -------------------------------------------------------------------- */
  const loadProfileData = async () => {
    if (!user.value) return
    isLoading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchProfile(),
        fetchReviews(),
        fetchPhotos(),
        fetchPendingChecks()
      ])
    } catch (err: any) {
      console.error('Erreur lors du chargement des données du profil:', err)
      error.value = err.message || 'Erreur lors du chargement des données du profil'
    } finally {
      isLoading.value = false
    }
  }

  /* -------------------------------------------------------------------- */
  /* Filters                                                              */
  /* -------------------------------------------------------------------- */
  const filterReviews = (q: string) => {
    if (!q) return reviews.value
    const query = q.toLowerCase()
    return reviews.value.filter(r =>
      (r.content?.toLowerCase() || '').includes(query) ||
      r.business?.name.toLowerCase().includes(query) ||
      (r.business?.city?.toLowerCase() || '').includes(query)
    )
  }

  const filterPhotos = (q: string) => {
    if (!q) return photos.value
    const query = q.toLowerCase()
    return photos.value.filter(p =>
      (p.description?.toLowerCase() || '').includes(query) ||
      p.business?.name.toLowerCase().includes(query) ||
      (p.business?.city?.toLowerCase() || '').includes(query) ||
      (p.review?.content?.toLowerCase() || '').includes(query)
    )
  }

  /* -------------------------------------------------------------------- */
  /* Expose                                                               */
  /* -------------------------------------------------------------------- */
  return {
    profile,
    reviews,
    photos,
    pendingChecks,
    isLoading,
    error,
    fetchProfile,
    fetchReviews,
    fetchPhotos,
    fetchPendingChecks,
    loadProfileData,
    filterReviews,
    filterPhotos
  }
}
