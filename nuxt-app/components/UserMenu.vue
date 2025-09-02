<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const toast = useToast()
const supabaseUser = useSupabaseUser()
const supabase = useSupabaseClient()

defineProps<{
  collapsed?: boolean
}>()

const colorMode = useColorMode()
const appConfig = useAppConfig()

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const { hasActiveSubscription } = useSubscription()
const { profile } = useUserProfile()

// Types pour l'entreprise
interface UserBusiness {
  id: string
  name: string
  address: string | null
}

// État réactif pour les données utilisateur et entreprise
const userBusiness = ref<UserBusiness | null>(null)
const loading = ref(false)

// Données utilisateur dynamiques basées sur Supabase
const user = computed(() => {
  const displayName = profile.value?.full_name || supabaseUser.value?.email?.split('@')[0] || 'Utilisateur'
  const avatarUrl = profile.value?.avatar_url || supabaseUser.value?.user_metadata?.avatar_url
  
  return {
    name: displayName,
    avatar: {
      src: avatarUrl || undefined,
      alt: displayName
    }
  }
})

// Charger l'entreprise de l'utilisateur
const loadUserBusiness = async () => {
  if (!supabaseUser.value?.id) return

  try {
    loading.value = true
    console.log('🏢 UserMenu - Chargement entreprise utilisateur')

    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, address')
      .eq('owner_id', supabaseUser.value.id)
      .limit(1)
      .single() as { data: UserBusiness | null, error: any }

    if (error && error.code !== 'PGRST116') {
      console.error('❌ UserMenu - Erreur chargement entreprise:', error)
      return
    }

    if (data) {
      console.log('✅ UserMenu - Entreprise trouvée:', data.name)
      userBusiness.value = data
    } else {
      console.log('ℹ️ UserMenu - Aucune entreprise trouvée pour cet utilisateur')
    }

  } catch (err) {
    console.error('❌ UserMenu - Erreur:', err)
  } finally {
    loading.value = false
  }
}

// Charger l'entreprise quand l'utilisateur change
watch(supabaseUser, (newUser) => {
  if (newUser?.id) {
    loadUserBusiness()
  } else {
    userBusiness.value = null
  }
}, { immediate: true })

// Fonction de déconnexion
const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      toast.add({
        title: 'Erreur',
        description: 'Impossible de se déconnecter.',
        icon: 'i-lucide-alert-circle',
        color: 'error'
      })
      return
    }

    toast.add({
      title: 'Déconnecté',
      description: 'Vous avez été déconnecté avec succès.',
      icon: 'i-lucide-check',
      color: 'success'
    })

    // Redirection vers la page d'accueil
    await navigateTo('/')
  } catch (err) {
    console.error('Erreur lors de la déconnexion:', err)
    toast.add({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la déconnexion.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

const items = computed<DropdownMenuItem[][]>(() => {
  const menuItems: DropdownMenuItem[][] = [
    // Section utilisateur (label avec nom et avatar)
    [{
      type: 'label',
      label: user.value.name,
      avatar: user.value.avatar
    }],
    
    // Section liens principaux
    [{
      label: 'Profil',
      icon: 'i-lucide-user',
      to: '/dashboard/settings' // Lien vers la page de réglages
    }],
    
    // Section entreprise (conditionnelle)
    ...(userBusiness.value ? [[{
      label: userBusiness.value.name || 'Mon entreprise',
      icon: 'i-lucide-building',
      to: `/business/${userBusiness.value.id}` // Lien dynamique vers l'entreprise
    }]] : []),
    
    // Section navigation
    [{
      label: 'Menu Principal',
      icon: 'i-lucide-home',
      to: '/'
    }],
    
    // Section déconnexion
    [{
      label: 'Se déconnecter',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: handleLogout
    }]
  ]
  
  return menuItems
})

</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />

    <template #chip-leading="{ item }">
      <span
        :style="{
          '--chip-light': `var(--color-${(item as any).chip}-500)`,
          '--chip-dark': `var(--color-${(item as any).chip}-400)`
        }"
        class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
      />
    </template>
  </UDropdownMenu>
</template>
