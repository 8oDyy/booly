import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useSupabaseClient, useSupabaseUser } from '#imports'

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis')
})

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

// Types pour les schémas de validation
export type LoginSchema = z.output<typeof loginSchema>
export type RegisterSchema = z.output<typeof registerSchema>

export const useAuth = () => {
  const toast = useToast()
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // État de chargement des formulaires
  const loginLoading = ref(false)
  const registerLoading = ref(false)

  // Champs du formulaire de connexion
  const loginFields = [
    {
      name: 'email',
      type: 'text' as const,
      label: 'Email',
      placeholder: 'votre@email.com',
      required: true
    },
    {
      name: 'password',
      type: 'password' as const,
      label: 'Mot de passe',
      placeholder: '••••••••',
      required: true
    },
    {
      name: 'remember',
      type: 'checkbox' as const,
      label: 'Se souvenir de moi'
    }
  ]

  // Champs du formulaire d'inscription
  const registerFields = [
    {
      name: 'email',
      type: 'text' as const,
      label: 'Email',
      placeholder: 'votre@email.com',
      required: true
    },
    {
      name: 'password',
      type: 'password' as const,
      label: 'Mot de passe',
      placeholder: '••••••••',
      required: true
    },
    {
      name: 'confirmPassword',
      type: 'password' as const,
      label: 'Confirmer le mot de passe',
      placeholder: '••••••••',
      required: true
    }
  ]

  // Fonction pour se connecter avec email/mot de passe
  const loginWithEmail = async (payload: FormSubmitEvent<LoginSchema>) => {
    try {
      loginLoading.value = true
      
      console.log('Tentative de connexion avec:', payload.data.email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.data.email,
        password: payload.data.password
      })
      
      if (error) throw error
      
      console.log('Connexion réussie:', data)
      
      toast.add({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
        color: 'success'
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('Erreur de connexion:', error.message)
      toast.add({
        title: 'Erreur de connexion',
        description: error.message,
        color: 'error'
      })
      return { success: false, error }
    } finally {
      loginLoading.value = false
    }
  }

  // Fonction pour s'inscrire avec email/mot de passe
  const registerWithEmail = async (payload: FormSubmitEvent<RegisterSchema>) => {
    try {
      registerLoading.value = true
      
      console.log('Tentative d\'inscription avec:', payload.data.email)
      
      const { data, error } = await supabase.auth.signUp({
        email: payload.data.email,
        password: payload.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      console.log('Inscription réussie:', data)
      
      toast.add({
        title: 'Inscription réussie',
        description: 'Vérifiez votre email pour confirmer votre compte',
        color: 'success'
      })
      
      return { success: true, data }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error.message)
      toast.add({
        title: 'Erreur d\'inscription',
        description: error.message,
        color: 'error'
      })
      return { success: false, error }
    } finally {
      registerLoading.value = false
    }
  }

  // Fonctions pour l'authentification avec les réseaux sociaux
  const loginWithGoogle = async () => {
    try {
      console.log('Tentative de connexion avec Google')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      console.log('Redirection OAuth initiée:', data)
      return { success: true }
    } catch (error: any) {
      console.error('Erreur d\'authentification Google:', error.message)
      toast.add({
        title: 'Erreur d\'authentification',
        description: error.message,
        color: 'error'
      })
      return { success: false, error }
    }
  }

  const loginWithGithub = async () => {
    try {
      console.log('Tentative de connexion avec GitHub')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      console.log('Redirection OAuth initiée:', data)
      return { success: true }
    } catch (error: any) {
      console.error('Erreur d\'authentification GitHub:', error.message)
      toast.add({
        title: 'Erreur d\'authentification',
        description: error.message,
        color: 'error'
      })
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.add({
        title: 'Déconnexion réussie',
        color: 'success'
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error.message)
      toast.add({
        title: 'Erreur de déconnexion',
        description: error.message,
        color: 'error'
      })
      return { success: false, error }
    }
  }

  return {
    user,
    loginLoading,
    registerLoading,
    loginSchema,
    registerSchema,
    loginFields,
    registerFields,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithGithub,
    logout
  }
}
