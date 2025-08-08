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

interface BusinessWithReviews extends Business {
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
  computed_review_count?: number
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
  sortBy?: "name" | "rating" | "distance" | "created_at" | "random"
  sortOrder?: "asc" | "desc"
  priceRange?: ("1" | "2" | "3" | "4" | null)[]
  price_range?: number[] // compat
  services?: string[]
  openNow?: boolean
  tags?: string[]
}

/* -------------------------------------------------------------------------- */

export const useBusinesses = () => {
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.public.supabaseKey) {
    console.error("Configuration Supabase manquante!")
    throw new Error("Configuration Supabase manquante")
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
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(a))
  }

  const searchBusinesses = async (filters: SearchFilters = {}, page = 1, limit = 10) => {
    try {
      let query = supabase
        .from("businesses")
        .select(
          `
            *,
            category:categories (
              id, name, slug
            ),
            reviews (
              rating, content, user_id, created_at,
              profiles ( full_name, avatar_url )
            ),
            photos ( url, description ),
            opening_hours ( day_of_week, opening_times ),
            last_reviews!left(
              content, created_at,
              profiles!last_reviews_user_id_fkey ( full_name )
            ),
            business_tags ( tag_id, tag:tags!business_tags_tag_id_fkey ( id, name ) )
          `,
          { count: "exact", head: false }
        )

      // Recherche texte
      if (filters.query && filters.query.trim() !== "") {
        const q = filters.query.trim()
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      }

      // Localisation simple (ville / adresse)
      if (filters.location && filters.location.trim() !== "") {
        const l = filters.location.trim()
        query = query.or(`city.ilike.%${l}%,address.ilike.%${l}%`)
      }

      // Catégorie
      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId)
      }

      // Prix (compat 2 formats)
      if ((filters.priceRange && filters.priceRange.length) || (filters.price_range && filters.price_range.length)) {
        // On fusionne les deux formats possibles et on les normalise en number|null
        const rawPrice = filters.priceRange ?? filters.price_range ?? []
        const normalized = rawPrice.map((v: any) =>
          v === null ? null : Number(v)
        ) as Array<number | null>
      
        // Cast en `any` pour ne pas bloquer TypeScript à cause de l'union de types
        query = query.in("price", normalized as any)
      }

      // Note minimale (côté serveur via average_rating)
      if (typeof filters.minRating === "number" && filters.minRating > 0) {
        query = query.gte("average_rating", filters.minRating)
      }

      // Tags (filtre sur la relation)
      if (filters.tags && filters.tags.length > 0) {
        query = query.in("business_tags.tag_id", filters.tags)
      }

      // Tri
      const sortBy = filters.sortBy ?? "created_at"
      const sortOrder = filters.sortOrder ?? "desc"

      if (sortBy === "rating") {
        query = query.order("average_rating", { ascending: sortOrder === "asc", nullsFirst: false })
      } else if (sortBy === "name") {
        query = query.order("name", { ascending: sortOrder === "asc" })
      } else if (sortBy === "created_at") {
        query = query.order("created_at", { ascending: sortOrder === "asc" })
      } else if (sortBy === "distance") {
        // Pas de tri distance côté SQL (nécessite une position de référence) — on gardera le tri côté client si besoin
        // On laisse un tri secondaire pour stabilité
        query = query.order("created_at", { ascending: false })
      } else if (sortBy === "random") {
        // PostgREST n'a pas d’order random() standard; fallback: tri par average_rating desc
        query = query.order("average_rating", { ascending: false })
      }

      // Pagination
      const from = Math.max(0, (page - 1) * limit)
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) {
        console.error("Erreur Supabase lors de la recherche:", error)
        throw error
      }

      const list: BusinessWithReviews[] = (data ?? []).map((b: any) => {
        const reviews = (b.reviews ?? []) as BusinessWithReviews["reviews"]
        const avg =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + (r?.rating ?? 0), 0) / reviews.length
            : 0

        return {
          ...b,
          reviews,
          photos: (b.photos ?? []) as BusinessWithReviews["photos"],
          category: b.category ?? undefined,
          avg_rating: Math.round(avg * 10) / 10,
          computed_review_count: reviews.length,
          last_review_content: b.last_reviews?.content ?? null,
          last_review_date: b.last_reviews?.created_at ?? null,
          last_review_author: b.last_reviews?.profiles?.full_name ?? "Anonyme",
          business_tags: b.business_tags ?? [],
        }
      })

      return {
        data: list,
        count: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
      }
    } catch (error) {
      console.error("Erreur dans searchBusinesses:", error)
      return { data: [], count: 0, page, limit, totalPages: 0 }
    }
  }

  const getBusinessById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select(
          `
            *,
            category:categories ( id, name, slug, description ),
            reviews ( *, profiles ( full_name, avatar_url ) ),
            photos ( * ),
            last_reviews!left(
              content, created_at,
              profiles!last_reviews_user_id_fkey ( full_name )
            ),
            opening_hours ( day_of_week, opening_times ),
            business_tags ( tag_id, tag:tags!business_tags_tag_id_fkey ( id, name ) )
          `
        )
        .eq("id", id)
        .single()

      if (error) {
        console.error("Erreur lors de la récupération du business:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Erreur dans getBusinessById:", error)
      return null
    }
  }

  // Commerces similaires (même catégorie, bien notés, proches)
  const getSimilarBusinesses = async (
    base: Pick<Business, "id" | "category_id" | "latitude" | "longitude" | "city">,
    opts: { limit?: number; maxDistanceKm?: number; minRating?: number } = {}
  ) => {
    const limit = opts.limit ?? 3
    const maxDistanceKm = opts.maxDistanceKm ?? 25
    const minRating = opts.minRating ?? 0

    let query = supabase
      .from("businesses")
      .select(
        `
          id, name, category_id, city, latitude, longitude, average_rating,
          photos ( url, description )
        `
      )
      .neq("id", base.id)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .not("average_rating", "is", null)

    if (base.category_id) query = query.eq("category_id", base.category_id)
    if (minRating > 0) query = query.gte("average_rating", minRating)

    // Préfiltrage serveur par note
    query = query.order("average_rating", { ascending: false }).limit(50)

    const { data, error } = await query
    if (error) {
      console.error("Erreur lors de la récupération des similaires:", error)
      return { data: [], error }
    }

    const items = (data ?? []).filter(
      (b: any) => typeof b.latitude === "number" && typeof b.longitude === "number"
    )

    const withDistance = items.map((b: any) => {
      const dist =
        typeof base.latitude === "number" &&
        typeof base.longitude === "number" &&
        typeof b.latitude === "number" &&
        typeof b.longitude === "number"
          ? calculateDistance(base.latitude as number, base.longitude as number, b.latitude, b.longitude)
          : Number.POSITIVE_INFINITY
      return { ...b, _distanceKm: dist as number }
    })

    const nearby = withDistance
      .filter((b: any) => (isFinite(b._distanceKm) ? b._distanceKm <= maxDistanceKm : true))
      .sort((a: any, b: any) => {
        const ra = a.average_rating ?? 0
        const rb = b.average_rating ?? 0
        if (rb !== ra) return rb - ra
        return (a._distanceKm ?? Infinity) - (b._distanceKm ?? Infinity)
      })
      .slice(0, limit)

    return { data: nearby }
  }

  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name")

      if (error) {
        console.error("Erreur lors de la récupération des catégories:", error)
        return []
      }

      return data ?? []
    } catch (error) {
      console.error("Erreur dans getCategories:", error)
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
        console.error("Erreur lors de la récupération des villes:", error)
        return []
      }

      const cities = [...new Set((data ?? []).map((d) => d.city).filter(Boolean))].sort()
      return cities as string[]
    } catch (error) {
      console.error("Erreur dans getCities:", error)
      return []
    }
  }

  return {
    searchBusinesses,
    getBusinessById,
    getSimilarBusinesses,
    getCategories,
    getCities,
    calculateDistance,
  }
}
