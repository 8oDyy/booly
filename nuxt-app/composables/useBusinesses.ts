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
  business_tags?: Array<{
    tag_id: string | null
    tags: {
      id: string
      name: string
    } | null
  }>
  avg_rating?: number
  review_count?: number
  last_review_content?: string | null
  last_review_date?: string | null
  last_review_author?: string | null
}

interface SearchFilters {
  query?: string
  location?: string
  categoryId?: string
  minRating?: number
  maxDistance?: number
  sortBy?: "name" | "rating" | "distance" | "created_at"
  sortOrder?: "asc" | "desc"
  priceRange?: ("1" | "2" | "3" | "4" | null)[]
  services?: string[]
  openNow?: boolean
  price_range?: number[]
}

/* -------------------------------------------------------------------------- */

export const useBusinesses = () => {
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.public.supabaseKey) {
    console.error('Configuration Supabase manquante!')
    throw new Error('Configuration Supabase manquante')
  }

  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

    return 2 * R * Math.asin(Math.sqrt(a))
  }

  const searchBusinesses = async (filters: SearchFilters = {}, page = 1, limit = 10) => {
    try {
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
          ),
          opening_hours (
            day_of_week,
            opening_times
          ),
          last_reviews!left(
            content,
            created_at,
            profiles!last_reviews_user_id_fkey (
              full_name
            )
          ),
          business_tags (
            tag_id,
            tag:tags!business_tags_tag_id_fkey ( id, name )
          )
        `,
        { count: "exact" }
      )

      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      if (filters.location) {
        query = query.or(`city.ilike.%${filters.location}%,address.ilike.%${filters.location}%`)
      }

      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId)
      }

      if (filters.priceRange) {
        query = query.in("price", filters.priceRange)
      }
      
      // Appliquer le filtre de note minimale côté serveur avec la colonne average_rating
      if (filters.minRating && filters.minRating > 0) {
        query = query.gte('average_rating', filters.minRating)
      }

      const sortBy = filters.sortBy ?? "created_at"
      const sortOrder = filters.sortOrder ?? "desc"
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        console.error('Erreur Supabase lors de la recherche:', error)
        throw error
      }

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
          last_review_content: (b as any).last_reviews?.content ?? null,
          last_review_date: (b as any).last_reviews?.created_at ?? null,
          last_review_author: (b as any).last_reviews?.profiles?.full_name ?? 'Anonyme',
          business_tags: (b as any).business_tags ?? [],
        }
      })

      // Le filtrage par note minimale est maintenant appliqué côté serveur via average_rating
      // Pas besoin de filtrage supplémentaire côté client
      
      return {
        data: list,
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
        photos ( * ),
        last_reviews!left(
          content,
          created_at,
          profiles!last_reviews_user_id_fkey (
            full_name
          )
        ),
        opening_hours (
          day_of_week,
          opening_times
        ),
        business_tags (
          tag_id,
          tag:tags!business_tags_tag_id_fkey ( id, name )
        )
      `
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

  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name")

      if (error) {
        console.error('Erreur lors de la récupération des catégories:', error)
        return []
      }

      return data ?? []
    } catch (error) {
      console.error('Erreur dans getCategories:', error)
      return []
    }
  }

  const getCities = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("city")
        .not("city", "is", null)

      if (error) {
        console.error('Erreur lors de la récupération des villes:', error)
        return []
      }

      const cities = [...new Set(data?.map((d) => d.city).filter(Boolean))].sort()
      return cities
    } catch (error) {
      console.error('Erreur dans getCities:', error)
      return []
    }
  }

  return {
    searchBusinesses,
    getBusinessById,
    getCategories,
    getCities,
    calculateDistance,
  }
}