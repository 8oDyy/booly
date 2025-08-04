<template>
    <div 
      class="business-preview"
      :style="{ 
        left: position.x + 'px', 
        top: position.y + 'px' 
      }"
      @click="$emit('click')"
    >
      <div class="preview-content">
        <!-- Photo de couverture -->
        <div class="preview-image">
          <img 
            :src="coverPhoto || 'https://via.placeholder.com/300x200'"
            :alt="business.name"
            class="w-full h-20 object-cover"
          />
        </div>
        
        <!-- Contenu -->
        <div class="preview-info">
          <h4 class="preview-title">{{ business.name }}</h4>
          
          <!-- Étoiles de notation -->
          <div class="preview-rating">
            <div class="flex items-center">
              <UIcon 
                v-for="star in 5" 
                :key="star"
                :name="star <= Math.floor(avgRating) ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                :class="star <= Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-300'"
                class="w-3 h-3"
              />
            </div>
            <span class="rating-text">{{ avgRating.toFixed(1) }}</span>
          </div>
          
          <!-- Ville -->
          <p class="preview-location">{{ business.city }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    business: {
      type: Object,
      required: true
    },
    position: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['click'])
  
  // Photo de couverture (première photo ou placeholder)
  const coverPhoto = computed(() => {
    // TODO: Implémenter la logique pour récupérer la photo de couverture
    // Pour l'instant, on utilise un placeholder
    return props.business.photos?.[0]?.url || null
  })
  
  // Note moyenne
  const avgRating = computed(() => {
    return props.business.avg_rating || 0
  })
  </script>
  
  <style scoped>
  .business-preview {
    position: fixed;
    z-index: 2000;
    pointer-events: auto;
    transform: translate(-50%, -100%);
    margin-top: -10px;
  }
  
  .preview-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    width: 200px;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .preview-content:hover {
    transform: translateY(-2px);
  }
  
  .preview-image {
    width: 100%;
    height: 80px;
    overflow: hidden;
  }
  
  .preview-info {
    padding: 12px;
  }
  
  .preview-title {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 6px;
    line-height: 1.2;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .preview-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
  
  .rating-text {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
  }
  
  .preview-location {
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
  }
  
</style>