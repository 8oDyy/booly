<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard'
})

const fileRef = ref<HTMLInputElement>()
const user = useSupabaseUser()
const { profile: userProfile, loading, error, updateProfile, uploadAvatar } = useUserProfile()

const profileSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  username: z.string().min(2, 'Nom d\'utilisateur trop court'),
  avatar: z.string().optional(),
  bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

// État réactif du formulaire basé sur les données Supabase
const profile = reactive<Partial<ProfileSchema>>({
  name: '',
  email: '',
  username: '',
  avatar: undefined,
  bio: undefined
})

const toast = useToast()
const pending = ref(false)

// Synchroniser les données du profil Supabase avec le formulaire
watch(userProfile, (newProfile) => {
  if (newProfile) {
    profile.name = newProfile.full_name || ''
    profile.email = user.value?.email || ''
    profile.username = newProfile.username || ''
    profile.avatar = newProfile.avatar_url || undefined
    profile.bio = newProfile.bio || undefined
  }
}, { immediate: true })

// Synchroniser l'email depuis l'utilisateur Supabase
watch(user, (newUser) => {
  if (newUser?.email) {
    profile.email = newUser.email
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  if (!user.value?.id) {
    toast.add({
      title: 'Erreur',
      description: 'Vous devez être connecté pour modifier votre profil.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  try {
    pending.value = true

    // Mettre à jour le profil dans Supabase
    await updateProfile({
      full_name: event.data.name,
      username: event.data.username,
      bio: event.data.bio || null,
      avatar_url: event.data.avatar || null
    })

    toast.add({
      title: 'Succès',
      description: 'Votre profil a été mis à jour avec succès.',
      icon: 'i-lucide-check',
      color: 'success'
    })

  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de sauvegarder les modifications.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  const file = input.files[0]!
  
  // Validation du fichier
  if (file.size > 1024 * 1024) { // 1MB max
    toast.add({
      title: 'Erreur',
      description: 'Le fichier est trop volumineux (1MB maximum).',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  try {
    // Prévisualisation immédiate
    profile.avatar = URL.createObjectURL(file)
    
    // Upload vers Supabase (si disponible)
    if (uploadAvatar) {
      await uploadAvatar(file)
      toast.add({
        title: 'Succès',
        description: 'Avatar mis à jour avec succès.',
        icon: 'i-lucide-check',
        color: 'success'
      })
    }
  } catch (err) {
    console.error('Erreur upload avatar:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de mettre à jour l\'avatar.',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <UForm
    id="profile-settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Paramètres du profil"
      description="Gérez vos informations personnelles et votre avatar."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="profile-settings"
        label="Sauvegarder"
        color="neutral"
        type="submit"
        :loading="pending || loading"
        :disabled="loading"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <!-- Affichage des erreurs -->
    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      variant="soft"
      :title="error"
      class="mb-4"
    />

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Nom complet"
        description="Votre nom complet tel qu'il apparaîtra sur votre profil."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.name"
          autocomplete="off"
          :disabled="loading"
          placeholder="Votre nom complet"
        />
      </UFormField>
      
      <USeparator />
      
      <UFormField
        name="email"
        label="Email"
        description="Utilisé pour la connexion et les notifications. Non modifiable."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.email"
          type="email"
          autocomplete="off"
          disabled
          placeholder="votre@email.com"
        />
      </UFormField>
      
      <USeparator />
      
      <UFormField
        name="username"
        label="Nom d'utilisateur"
        description="Votre nom d'utilisateur unique pour votre profil public."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.username"
          autocomplete="off"
          :disabled="loading"
          placeholder="nom_utilisateur"
        />
      </UFormField>
      
      <USeparator />
      
      <UFormField
        name="avatar"
        label="Avatar"
        description="JPG, GIF ou PNG. 1MB maximum."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar
            :src="profile.avatar"
            :alt="profile.name"
            size="lg"
          />
          <UButton
            label="Choisir"
            color="neutral"
            :disabled="loading"
            @click="onFileClick"
          />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          >
        </div>
      </UFormField>
      
      <USeparator />
      
      <UFormField
        name="bio"
        label="Biographie"
        description="Description courte pour votre profil. Les URLs sont automatiquement liées."
        class="flex max-sm:flex-col justify-between items-start gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UTextarea
          v-model="profile.bio"
          :rows="5"
          autoresize
          :disabled="loading"
          placeholder="Parlez-nous de vous..."
          class="w-full"
        />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
