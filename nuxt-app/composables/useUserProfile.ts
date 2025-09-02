import type { Database } from '~/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const useUserProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  // État réactif du profil
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Charger le profil utilisateur
  const loadProfile = async () => {
    if (!user.value?.id) {
      console.warn('🔐 useUserProfile - Aucun utilisateur connecté')
      return null
    }

    try {
      loading.value = true
      error.value = null

      console.log('👤 useUserProfile - Chargement du profil pour:', user.value.id)

      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (supabaseError) {
        console.error('❌ useUserProfile - Erreur Supabase:', supabaseError)
        
        // Si le profil n'existe pas, on le crée
        if (supabaseError.code === 'PGRST116') {
          console.log('📝 useUserProfile - Création du profil manquant')
          return await createProfile()
        }
        
        throw supabaseError
      }

      console.log('✅ useUserProfile - Profil chargé:', data)
      profile.value = data
      return data

    } catch (err) {
      console.error('❌ useUserProfile - Erreur lors du chargement:', err)
      error.value = 'Erreur lors du chargement du profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Créer un profil par défaut
  const createProfile = async () => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      console.log('📝 useUserProfile - Création du profil par défaut')

      const defaultProfile: Database['public']['Tables']['profiles']['Insert'] = {
        id: user.value.id,
        full_name: user.value.user_metadata?.full_name || user.value.email?.split('@')[0] || '',
        username: user.value.email?.split('@')[0] || '',
        avatar_url: user.value.user_metadata?.avatar_url || null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .insert(defaultProfile)
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ useUserProfile - Erreur création profil:', supabaseError)
        throw supabaseError
      }

      console.log('✅ useUserProfile - Profil créé:', data)
      profile.value = data
      return data

    } catch (err) {
      console.error('❌ useUserProfile - Erreur lors de la création:', err)
      throw err
    }
  }

  // Mettre à jour le profil
  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      loading.value = true
      error.value = null

      console.log('💾 useUserProfile - Mise à jour du profil:', updates)

      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.value.id)
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ useUserProfile - Erreur mise à jour:', supabaseError)
        throw supabaseError
      }

      console.log('✅ useUserProfile - Profil mis à jour:', data)
      profile.value = data
      return data

    } catch (err) {
      console.error('❌ useUserProfile - Erreur lors de la mise à jour:', err)
      error.value = 'Erreur lors de la sauvegarde'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Upload d'avatar (optionnel, pour plus tard)
  const uploadAvatar = async (file: File) => {
    if (!user.value?.id) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      loading.value = true
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      console.log('📤 useUserProfile - Upload avatar:', filePath)

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Mettre à jour le profil avec la nouvelle URL
      await updateProfile({ avatar_url: data.publicUrl })

      return data.publicUrl

    } catch (err) {
      console.error('❌ useUserProfile - Erreur upload avatar:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Charger automatiquement le profil quand l'utilisateur change
  watch(user, async (newUser) => {
    if (newUser?.id) {
      await loadProfile()
    } else {
      profile.value = null
    }
  }, { immediate: true })

  return {
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    loadProfile,
    updateProfile,
    uploadAvatar
  }
}
