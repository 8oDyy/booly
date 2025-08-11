import type { Database } from "~/types/supabase"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Business = Database["public"]["Tables"]["businesses"]["Row"]
type BusinessInsert = Database["public"]["Tables"]["businesses"]["Insert"]
type BusinessUpdate = Database["public"]["Tables"]["businesses"]["Update"]
type Category = Database["public"]["Tables"]["categories"]["Row"]

export interface BusinessFormData {
  name: string
  category_id: string | null
  description: string | null
  phone: string | null
  website: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  price: Database["public"]["Enums"]["price_level"] | null
}

/* -------------------------------------------------------------------------- */
/*                                Composable                                  */
/* -------------------------------------------------------------------------- */

export const useBusinessCrud = () => {
  const supabase = useSupabaseClient<Database>()

  /**
   * Récupère les établissements de l'utilisateur connecté
   */
  const getUserBusinesses = async (): Promise<Business[]> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Utilisateur non connecté:', authError)
        return []
      }

      const { data, error } = await supabase
        .from("businesses")
        .select(`
          *,
          category:categories (
            id, name, slug, description
          )
        `)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erreur lors de la récupération des établissements:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Erreur dans getUserBusinesses:", error)
      return []
    }
  }

  /**
   * Récupère un établissement par son ID
   */
  const getBusinessById = async (id: string): Promise<Business | null> => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select(`
          *,
          category:categories (
            id, name, slug, description
          )
        `)
        .eq("id", id)
        .single()

      if (error) {
        console.error("Erreur lors de la récupération de l'établissement:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Erreur dans getBusinessById:", error)
      return null
    }
  }

  /**
   * Crée un nouvel établissement
   */
  const createBusiness = async (businessData: BusinessFormData): Promise<Business | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Utilisateur non connecté:', authError)
        throw new Error('Utilisateur non connecté')
      }

      // Préparer les données pour l'insertion
      const insertData: BusinessInsert = {
        ...businessData,
        owner_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("businesses")
        .insert(insertData)
        .select(`
          *,
          category:categories (
            id, name, slug, description
          )
        `)
        .single()

      if (error) {
        console.error("Erreur lors de la création de l'établissement:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Erreur dans createBusiness:", error)
      throw error
    }
  }

  /**
   * Met à jour un établissement existant
   */
  const updateBusiness = async (id: string, businessData: Partial<BusinessFormData>): Promise<Business | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Utilisateur non connecté:', authError)
        throw new Error('Utilisateur non connecté')
      }

      // Préparer les données pour la mise à jour
      const updateData: BusinessUpdate = {
        ...businessData,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("businesses")
        .update(updateData)
        .eq("id", id)
        .eq("owner_id", user.id) // S'assurer que l'utilisateur est propriétaire
        .select(`
          *,
          category:categories (
            id, name, slug, description
          )
        `)
        .single()

      if (error) {
        console.error("Erreur lors de la mise à jour de l'établissement:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Erreur dans updateBusiness:", error)
      throw error
    }
  }

  /**
   * Supprime un établissement
   */
  const deleteBusiness = async (id: string): Promise<boolean> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Utilisateur non connecté:', authError)
        throw new Error('Utilisateur non connecté')
      }

      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id) // S'assurer que l'utilisateur est propriétaire

      if (error) {
        console.error("Erreur lors de la suppression de l'établissement:", error)
        throw error
      }

      return true
    } catch (error) {
      console.error("Erreur dans deleteBusiness:", error)
      return false
    }
  }

  /**
   * Récupère toutes les catégories disponibles
   */
  const getCategories = async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name")

      if (error) {
        console.error("Erreur lors de la récupération des catégories:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Erreur dans getCategories:", error)
      return []
    }
  }

  /**
   * Valide les données d'un établissement
   */
  const validateBusinessData = (data: BusinessFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Champs obligatoires
    if (!data.name || data.name.trim().length === 0) {
      errors.push("Le nom de l'établissement est obligatoire")
    }

    if (!data.address || data.address.trim().length === 0) {
      errors.push("L'adresse est obligatoire")
    }

    if (!data.city || data.city.trim().length === 0) {
      errors.push("La ville est obligatoire")
    }

    if (!data.postal_code || data.postal_code.trim().length === 0) {
      errors.push("Le code postal est obligatoire")
    }

    // Validation du téléphone (format français basique)
    if (data.phone && data.phone.trim().length > 0) {
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
      if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        errors.push("Le format du téléphone n'est pas valide")
      }
    }

    // Validation du site web
    if (data.website && data.website.trim().length > 0) {
      try {
        new URL(data.website)
      } catch {
        errors.push("L'URL du site web n'est pas valide")
      }
    }

    // Validation des coordonnées GPS
    if (data.latitude !== null && (data.latitude < -90 || data.latitude > 90)) {
      errors.push("La latitude doit être comprise entre -90 et 90")
    }

    if (data.longitude !== null && (data.longitude < -180 || data.longitude > 180)) {
      errors.push("La longitude doit être comprise entre -180 et 180")
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Crée un objet BusinessFormData vide avec les valeurs par défaut
   */
  const createEmptyBusinessForm = (): BusinessFormData => ({
    name: '',
    category_id: null,
    description: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    latitude: null,
    longitude: null,
    price: null
  })

  /**
   * Convertit un Business en BusinessFormData pour l'édition
   */
  const businessToFormData = (business: Business): BusinessFormData => ({
    name: business.name || '',
    category_id: business.category_id,
    description: business.description,
    phone: business.phone,
    website: business.website,
    address: business.address,
    city: business.city,
    postal_code: business.postal_code,
    country: business.country,
    latitude: business.latitude,
    longitude: business.longitude,
    price: business.price
  })

  return {
    // CRUD Operations
    getUserBusinesses,
    getBusinessById,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    
    // Utilities
    getCategories,
    validateBusinessData,
    createEmptyBusinessForm,
    businessToFormData
  }
}
