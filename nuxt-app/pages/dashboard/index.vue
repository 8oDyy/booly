<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Menu latéral -->
    <DashboardSidebar />
    
    <!-- Contenu principal -->
    <div class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Contenu dynamique selon l'onglet actif -->
        <BusinessManagement v-if="activeTab === 'business'" />
        <ReviewsManagement v-else-if="activeTab === 'reviews'" />
        <StatsOverview v-else-if="activeTab === 'stats'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'
import DashboardSidebar from '~/components/dashboard/DashboardSidebar.vue'
import BusinessManagement from '~/components/dashboard/BusinessManagement.vue'
import ReviewsManagement from '~/components/dashboard/ReviewsManagement.vue'
import StatsOverview from '~/components/dashboard/StatsOverview.vue'

definePageMeta({
  middleware: 'subscription',
  title: 'Tableau de bord Pro - Booly',
  description: 'Gérez vos établissements et suivez vos performances'
})

const { activeTab } = useDashboard()
</script>
