<template>
    <UPageCard class="restaurant-card-skeleton">
      <div class="flex gap-4 p-4">
        <!-- Photo skeleton -->
        <div class="flex-shrink-0">
          <USkeleton class="w-30 h-30 rounded-lg" />
        </div>
        
        <!-- Contenu skeleton -->
        <div class="flex-1 min-w-0 space-y-3">
          <!-- Nom du restaurant -->
          <USkeleton class="h-6 w-3/4" />
          
          <!-- Note avec étoiles -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1">
              <USkeleton class="w-4 h-4 rounded" />
              <USkeleton class="w-4 h-4 rounded" />
              <USkeleton class="w-4 h-4 rounded" />
              <USkeleton class="w-4 h-4 rounded" />
              <USkeleton class="w-4 h-4 rounded" />
            </div>
            <USkeleton class="h-4 w-20" />
          </div>
          
          <!-- Localisation et badges -->
          <div class="flex items-center gap-3 flex-wrap">
            <USkeleton class="h-4 w-24" />
            <USkeleton class="h-5 w-16 rounded-full" />
            <USkeleton class="h-4 w-20" />
          </div>
          
          <!-- Description -->
          <div class="space-y-2">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-3 w-32" />
          </div>
          
          <!-- Tags -->
          <div class="flex flex-wrap gap-1">
            <USkeleton class="h-5 w-16 rounded-full" />
            <USkeleton class="h-5 w-20 rounded-full" />
            <USkeleton class="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </UPageCard>
  </template>
  
  <style scoped>
  .restaurant-card-skeleton {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  </style>
  