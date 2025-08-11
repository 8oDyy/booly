<template>
  <div class="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-2xl p-8 text-white">
    <!-- Background pattern -->
    <div class="absolute inset-0 bg-black/10 rounded-2xl"></div>
    
    <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
      <!-- Avatar section -->
      <div class="relative">
        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl">
          <img 
            :src="user?.user_metadata?.avatar_url || profile?.avatar_url || 'https://i.pravatar.cc/300'" 
            alt="Photo de profil"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
        <button
          @click="$emit('edit-avatar')"
          class="absolute bottom-0 right-0 w-8 h-8 bg-white text-blue-600 rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <!-- User info -->
      <div class="text-center md:text-left flex-1">
        <div class="flex items-center gap-3 justify-center md:justify-start mb-2">
          <h1 class="text-3xl font-bold">
            {{ displayName }}
          </h1>
          <button
            @click="$emit('edit-profile')"
            class="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        <p class="text-blue-100 mb-4">
          {{ user?.email }}
        </p>

        <div class="flex items-center gap-4 justify-center md:justify-start text-sm">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
            </svg>
            <span>Membre depuis {{ formatJoinDate }}</span>
          </div>
          <div v-if="profile?.bio" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ profile.bio }}</span>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="flex flex-col gap-2">
        <button
          @click="$emit('open-settings')"
          class="flex items-center gap-2 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Paramètres</span>
        </button>
        <button
          @click="$emit('share-profile')"
          class="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Partager</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

interface Props {
  user: any
  profile: Database['public']['Tables']['profiles']['Row'] | null
}

interface Emits {
  (e: 'edit-avatar'): void
  (e: 'edit-profile'): void
  (e: 'open-settings'): void
  (e: 'share-profile'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Computed properties
const displayName = computed(() => {
  return props.profile?.full_name || 
         props.user?.user_metadata?.name || 
         props.user?.user_metadata?.full_name ||
         'Utilisateur'
})

const formatJoinDate = computed(() => {
  if (!props.user?.created_at) return ''
  const date = new Date(props.user.created_at)
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric'
  }).format(date)
})

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://i.pravatar.cc/300'
}
</script>
