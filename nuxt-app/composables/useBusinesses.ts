import { createClient } from "@supabase/supabase-js"
import type { Database } from "~/types/supabase"
import { useRuntimeConfig } from "#app"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Business = Database["public"]["Tables"]["businesses"]["Row"]
type Review = Database["public"]["Tables"]["reviews"]["Row"]
type Photo = Database["public"]["Tables"]["photos"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

type BusinessWithReviews = Business & {
  reviews: Array<{
    rating: number
    content: string | null
    user_id: string
    created_at: string | null
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    }
  }>
  photos: Array<{
    url: string
    description: string | null
  }>
  category?: { id: string; name: string; slug: string }
  avg_rating?: number
  review_count?: number
}

interface SearchFilters {
  query?: string
  location?: string
  categoryId?: string
  minRating?: number
  maxDistance?: number
  sortBy?: "name" | "rating" | "distance" | "created_at"
  sortOrder?: "asc" | "desc"
  // TODO: Ajouter ces champs à la table businesses
  priceRange?: number[]
  services?: string[]
  openNow?: boolean
}

/* -------------------------------------------------------------------------- */

export const useBusinesses = () => {
  /* --------------------------- Supabase client --------------------------- */
  const config = useRuntimeConfig()
  
  if (!config.public.supabaseUrl || !config.public.supabaseKey) {
    console.error('Configuration Supabase manquante!')
    throw new Error('Configuration Supabase manquante')
  }

  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  /* -------------------------------- Helpers ----------------------------- */

  /** Formule de Haversine (km) */
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

    return 2 * R * Math.asin(Math.sqrt(a))
  }

  /* ---------------------------------------------------------------------- */
  /*                              Core methods                              */
  /* ---------------------------------------------------------------------- */

  /** Recherche paginée avec filtres */
  const searchBusinesses = async (filters: SearchFilters = {}, page = 1, limit = 10) => {
    try {
      console.log('Début de la recherche avec filtres:', filters)
      
      let query = supabase.from("businesses").select(
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
            user_id,
            created_at,
            profiles (
              full_name,
              avatar_url
            )
          ),
          photos (
            url,
            description
          )
        `,
        { count: "exact" },
      )

      /* --- filtres textuels --- */
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      if (filters.location) {
        query = query.or(`city.ilike.%${filters.location}%,address.ilike.%${filters.location}%`)
      }

      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId)
      }

      /* --- tri --- */
      const sortBy = filters.sortBy ?? "created_at"
      const sortOrder = filters.sortOrder ?? "desc"
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      /* --- pagination --- */
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      /* --- exécution --- */
      const { data, error, count } = await query
      
      if (error) {
        console.error('Erreur Supabase lors de la recherche:', error)
        throw error
      }

      console.log('Données brutes de Supabase:', data)
      
      /* --- post-traitement --- */
      const list: BusinessWithReviews[] = (data ?? []).map((b) => {
        const reviews = b.reviews ?? []
        const avg =
          reviews.length > 0
            ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
            : 0

        return {
          ...b,
          reviews,
          photos: b.photos ?? [],
          category: (b as any).category ?? undefined,
          avg_rating: Math.round(avg * 10) / 10,
          review_count: reviews.length,
        }
      })

      /* --- filtre minRating côté client --- */
      const filtered = filters.minRating ? list.filter((b) => (b.avg_rating ?? 0) >= filters.minRating!) : list

      console.log('Données formatées:', filtered)
      
      return {
        data: filtered,
        count: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
      }
    } catch (error) {
      console.error('Erreur dans searchBusinesses:', error)
      return {
        data: [],
        count: 0,
        page,
        limit,
        totalPages: 0,
      }
    }
  }

  /** Détails d'un business */
  const getBusinessById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("businesses")
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
        .eq("id", id)
        .single()

      if (error) {
        console.error('Erreur lors de la récupération du business:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Erreur dans getBusinessById:', error)
      return null
    }
  }

  /** Liste des catégories */
  const getCategories = async () => {
    try {
      console.log('Récupération des catégories...')
      
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name")
      
      if (error) {
        console.error('Erreur lors de la récupération des catégories:', error)
        return []
      }
      
      console.log('Catégories récupérées:', data)
      return data ?? []
    } catch (error) {
      console.error('Erreur dans getCategories:', error)
      return []
    }
  }

  /** Villes distinctes présentes en base */
  const getCities = async () => {
    try {
      console.log('Récupération des villes...')
      
      const { data, error } = await supabase
        .from("businesses")
        .select("city")
        .not("city", "is", null)

      if (error) {
        console.error('Erreur lors de la récupération des villes:', error)
        return []
      }

      const cities = [...new Set(data?.map((d) => d.city).filter(Boolean))].sort()
      console.log('Villes récupérées:', cities)
      return cities
    } catch (error) {
      console.error('Erreur dans getCities:', error)
      return []
    }
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
