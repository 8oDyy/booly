import type { Database } from '~/types/supabase'

type Photo = Database['public']['Tables']['photos']['Row']
type PhotoInsert = Database['public']['Tables']['photos']['Insert']
type PhotoUpdate = Database['public']['Tables']['photos']['Update']
type PhotoType = Database['public']['Enums']['photo_type']

export interface PhotoUploadOptions {
  businessId: string
  photoType: PhotoType
  reviewId?: string
  description?: string
  file: File
}

export interface PhotoFilters {
  businessId?: string
  photoType?: PhotoType
  reviewId?: string
  userId?: string
  limit?: number
}

// État global partagé
const globalPhotos = ref<Photo[]>([])
const globalLoading = ref(false)
const globalUploading = ref(false)
const globalError = ref<string | null>(null)

export const usePhotos = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // États réactifs partagés
  const photos = globalPhotos
  const loading = globalLoading
  const uploading = globalUploading
  const error = globalError

  // Validation des fichiers
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' }
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Fichier trop volumineux. Maximum 5MB.' }
    }

    return { valid: true }
  }

  // Upload d'une photo vers Supabase Storage
  const uploadPhotoFile = async (file: File, businessId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${businessId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    console.log('📸 usePhotos - Upload fichier:', fileName)

    const { data, error: uploadError } = await supabase.storage
      .from('business-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ usePhotos - Erreur upload storage:', uploadError)
      throw new Error(`Erreur upload: ${uploadError.message}`)
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('business-photos')
      .getPublicUrl(data.path)

    console.log('✅ usePhotos - Fichier uploadé:', publicUrl)
    console.log('🔗 usePhotos - URL complète générée:', publicUrl)
    
    // Vérifier que l'URL est accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' })
      console.log('🌐 usePhotos - Test accessibilité URL:', response.status, response.statusText)
    } catch (err) {
      console.warn('⚠️ usePhotos - URL peut-être inaccessible:', err)
    }
    
    return publicUrl
  }

  // Créer une photo en base de données
  const createPhoto = async (options: PhotoUploadOptions): Promise<Photo> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      uploading.value = true
      error.value = null

      // Validation du fichier
      const validation = validateFile(options.file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      console.log('📝 usePhotos - Création photo:', options.photoType)

      // Upload du fichier
      const photoUrl = await uploadPhotoFile(options.file, options.businessId)

      // Validation des contraintes métier
      if (options.photoType === 'review_photo' && !options.reviewId) {
        throw new Error('review_id requis pour les photos d\'avis')
      }

      // Insertion en base
      const photoData: PhotoInsert = {
        business_id: options.businessId,
        user_id: user.value.id,
        url: photoUrl,
        photo_type: options.photoType,
        description: options.description || null,
        review_id: options.reviewId || null,
        created_at: new Date().toISOString()
      }

      const { data, error: dbError } = await supabase
        .from('photos')
        .insert(photoData)
        .select()
        .single()

      if (dbError) {
        console.error('❌ usePhotos - Erreur base de données:', dbError)
        throw new Error(`Erreur sauvegarde: ${dbError.message}`)
      }

      console.log('✅ usePhotos - Photo créée:', data.id)
      return data

    } catch (err) {
      console.error('❌ usePhotos - Erreur création photo:', err)
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
      throw err
    } finally {
      uploading.value = false
    }
  }

  // Récupérer les photos avec filtres
  const getPhotos = async (filters: PhotoFilters = {}): Promise<Photo[]> => {
    try {
      loading.value = true
      error.value = null

      console.log('🔍 usePhotos - Récupération photos:', filters)

      let query = supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters.businessId) {
        query = query.eq('business_id', filters.businessId)
      }

      if (filters.photoType) {
        query = query.eq('photo_type', filters.photoType)
      }

      if (filters.reviewId) {
        query = query.eq('review_id', filters.reviewId)
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        console.error('❌ usePhotos - Erreur requête:', queryError)
        throw queryError
      }

      console.log(`✅ usePhotos - ${data?.length || 0} photos récupérées`)
      
      // Toujours ajouter/mettre à jour les photos sans les perdre
      if (data && data.length > 0) {
        // Supprimer les doublons existants
        const existingIds = photos.value.map(p => p.id)
        const newPhotos = data.filter(p => !existingIds.includes(p.id))
        
        // Si on a des filtres spécifiques, remplacer seulement les photos correspondantes
        if (filters.businessId || filters.photoType || filters.reviewId) {
          // Supprimer les photos existantes qui correspondent aux filtres
          photos.value = photos.value.filter(existingPhoto => {
            let shouldKeep = true
            if (filters.businessId && existingPhoto.business_id === filters.businessId) shouldKeep = false
            if (filters.photoType && existingPhoto.photo_type === filters.photoType && !filters.businessId) shouldKeep = false
            if (filters.reviewId && existingPhoto.review_id === filters.reviewId) shouldKeep = false
            return shouldKeep
          })
          
          // Ajouter toutes les photos de la requête (nouvelles + existantes mises à jour)
          photos.value = [...photos.value, ...data]
        } else {
          // Si pas de filtres, ajouter seulement les nouvelles
          photos.value = [...photos.value, ...newPhotos]
        }
      }
      
      console.log(`📸 usePhotos - Total photos après mise à jour: ${photos.value.length}`)
      return data || []

    } catch (err) {
      console.error('❌ usePhotos - Erreur récupération:', err)
      error.value = err instanceof Error ? err.message : 'Erreur de récupération'
      return []
    } finally {
      loading.value = false
    }
  }

  // Récupérer les photos de galerie d'un établissement
  const getBusinessGallery = async (businessId: string): Promise<Photo[]> => {
    return getPhotos({
      businessId,
      photoType: 'business_gallery'
    })
  }

  // Récupérer les photos d'un avis
  const getReviewPhotos = async (reviewId: string): Promise<Photo[]> => {
    return getPhotos({
      reviewId,
      photoType: 'review_photo'
    })
  }

  // Supprimer une photo
  const deletePhoto = async (photoId: string): Promise<boolean> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      loading.value = true
      error.value = null

      console.log('🗑️ usePhotos - Suppression photo:', photoId)

      // Récupérer les infos de la photo pour supprimer le fichier
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('id', photoId)
        .eq('user_id', user.value.id) // Sécurité : seul le propriétaire peut supprimer
        .single()

      if (fetchError) {
        console.error('❌ usePhotos - Photo non trouvée:', fetchError)
        throw new Error('Photo non trouvée ou accès refusé')
      }

      // Supprimer le fichier du storage
      const urlParts = photo.url.split('/')
      const filePath = urlParts.slice(-2).join('/') // business_id/filename

      const { error: storageError } = await supabase.storage
        .from('business-photos')
        .remove([filePath])

      if (storageError) {
        console.warn('⚠️ usePhotos - Erreur suppression fichier:', storageError)
        // On continue même si la suppression du fichier échoue
      }

      // Supprimer l'entrée en base
      const { error: deleteError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', user.value.id)

      if (deleteError) {
        console.error('❌ usePhotos - Erreur suppression base:', deleteError)
        throw new Error(`Erreur suppression: ${deleteError.message}`)
      }

      console.log('✅ usePhotos - Photo supprimée')
      
      // Mettre à jour la liste locale
      photos.value = photos.value.filter(p => p.id !== photoId)
      
      return true

    } catch (err) {
      console.error('❌ usePhotos - Erreur suppression:', err)
      error.value = err instanceof Error ? err.message : 'Erreur de suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour la description d'une photo
  const updatePhotoDescription = async (photoId: string, description: string): Promise<Photo> => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      loading.value = true
      error.value = null

      console.log('💾 usePhotos - Mise à jour description:', photoId)

      const { data, error: updateError } = await supabase
        .from('photos')
        .update({ description })
        .eq('id', photoId)
        .eq('user_id', user.value.id) // Sécurité
        .select()
        .single()

      if (updateError) {
        console.error('❌ usePhotos - Erreur mise à jour:', updateError)
        throw new Error(`Erreur mise à jour: ${updateError.message}`)
      }

      console.log('✅ usePhotos - Description mise à jour')
      
      // Mettre à jour la liste locale
      const index = photos.value.findIndex(p => p.id === photoId)
      if (index !== -1) {
        photos.value[index] = data
      }

      return data

    } catch (err) {
      console.error('❌ usePhotos - Erreur mise à jour:', err)
      error.value = err instanceof Error ? err.message : 'Erreur de mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // États
    photos: readonly(photos),
    loading: readonly(loading),
    uploading: readonly(uploading),
    error: readonly(error),

    // Méthodes
    createPhoto,
    getPhotos,
    getBusinessGallery,
    getReviewPhotos,
    deletePhoto,
    updatePhotoDescription,
    validateFile
  }
}
