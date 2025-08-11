<template>
  <div class="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Tableau de bord</h2>
      
      <nav class="space-y-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          :class="[
            'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            activeTab === tab.id
              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]"
        >
          <svg 
            class="w-5 h-5 mr-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="tab.icon" 
            />
          </svg>
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'

const { activeTab, setActiveTab, tabs } = useDashboard()
</script>
