import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Business = Database['public']['Tables']['businesses']['Row']

type BusinessWithReviews = Business & {
  reviews: Array<{
    rating: number
    content: string | null
    user_id: string
  }>
  photos: Array<{
    url: string
    description: string | null
  }>
  category?: { id: string; name: string; slug: string }       // null → undefined
  avg_rating?: number
  review_count?: number
}

interface SearchFilters {
  query?: string
  location?: string
  categoryId?: string
  minRating?: number
  maxDistance?: number
  sortBy?: 'name' | 'rating' | 'distance' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

/* -------------------------------------------------------------------------- */

export const useBusinesses = () => {
  /* --------------------------- Supabase client --------------------------- */
  const {
    public: { supabaseUrl, supabaseKey },
  } = useRuntimeConfig()

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  /* -------------------------------- Helpers ----------------------------- */

  /** Formule de Haversine (km) */
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

    return 2 * R * Math.asin(Math.sqrt(a))
  }

  /* ---------------------------------------------------------------------- */
  /*                              Core methods                              */
  /* ---------------------------------------------------------------------- */

  /** Recherche paginée avec filtres */
  const searchBusinesses = async (
    filters: SearchFilters = {},
    page = 1,
    limit = 10,
  ) => {
    let query = supabase
      .from('businesses')
      .select(
        `
        *,
        category:categories (
          id,
          name,
          slug
        ),
        reviews (
          rating,
          content,
          user_id
        ),
        photos (
          url,
          description
        )
      `,
        { count: 'exact' }, // compte total pour la pagination
      )

    /* --- filtres textuels --- */
    if (filters.query) {
      query = query.or(
        `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`,
      )
    }

    if (filters.location) {
      query = query.or(
        `city.ilike.%${filters.location}%,address.ilike.%${filters.location}%`,
      )
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    /* --- tri --- */
    const sortBy = filters.sortBy ?? 'created_at'
    const sortOrder = filters.sortOrder ?? 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    /* --- pagination --- */
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    /* --- exécution --- */
    const { data, error, count } = await query
    if (error) throw error

    /* --- post-traitement --- */
    const list: BusinessWithReviews[] = (data ?? []).map((b) => {
      const reviews = b.reviews ?? []
      const avg =
        reviews.length > 0
          ? reviews.reduce(
              (sum: number, r: { rating: number }) => sum + r.rating,
              0,
            ) / reviews.length
          : 0

      const { categories: _discard, ...rest } = b as any // on jette l’ancien champ

      return {
        ...rest,
        reviews,
        photos: b.photos ?? [],
        category: (b as any).category ?? undefined, // null -> undefined
        avg_rating: Math.round(avg * 10) / 10,
        review_count: reviews.length,
      }
    })

    /* --- filtre minRating côté client --- */
    const filtered = filters.minRating
      ? list.filter((b) => (b.avg_rating ?? 0) >= filters.minRating!)
      : list

    return {
      data: filtered,
      count: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    }
  }

  /** Détails d’un business */
  const getBusinessById = async (id: string) => {
    const { data, error } = await supabase
      .from('businesses')
      .select(
        `
        *,
        category:categories (
          id,
          name,
          slug,
          description
        ),
        reviews (
          *,
          profiles (
            full_name,
            avatar_url
          )
        ),
        photos ( * )
      `,
      )
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  /** Liste des catégories */
  const getCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name')
    if (error) throw error
    return data ?? []
  }

  /** Villes distinctes présentes en base */
  const getCities = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('city')
      .not('city', 'is', null)

    if (error) throw error

    return [...new Set(data?.map((d) => d.city).filter(Boolean))].sort()
  }

  /* ---------------------------------------------------------------------- */

  return {
    searchBusinesses,
    getBusinessById,
    getCategories,
    getCities,
    calculateDistance,
  }
}
