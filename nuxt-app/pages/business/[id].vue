<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="pending" class="text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-red-600">Une erreur est survenue. Veuillez réessayer.</div>
    <div v-else-if="!business" class="text-gray-500">Commerce introuvable.</div>

        <BusinessHeader v-if="business" :business="business" />
        <BusinessInfo v-if="business" :business="business" />

        <main class="max-w-6xl mx-auto px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    <UTabs :items="tabs" v-model="activeTab">
                        <template #overview>
                            <section v-show="activeTab === 'overview'" class="space-y-8">
                                <BusinessOverview v-if="business" :business="business" />
                            </section>
                        </template>
                        <template #reviews>
                            <section v-show="activeTab === 'reviews'" class="space-y-6">
                                <BusinessReviews v-if="business" :reviews="business.reviews || []" />
                            </section>
                        </template>
                        <template #photos>
                            <section v-show="activeTab === 'photos'" class="space-y-6">
                                <BusinessPhotos v-if="business" :photos="business.photos || []" />
                            </section>
                        </template>
                    </UTabs>
                </div>
                <div v-if="business" class="space-y-6 top-24">
                    <BusinessSideBar :business="business" />
                </div>
            </div>
            <BusinessSimilar :base="{
                id: business?.id,
                category_id: business?.category_id,
                latitude: business?.latitude,
                longitude: business?.longitude,
                city: business?.city
            }" />
        </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => String(route.params.id || ''))

const activeTab = ref<'overview' | 'reviews' | 'photos'>('overview')

const { data, pending, error } = await useAsyncData(
  'business',
  () => useBusinesses().getBusinessById(id.value),
  { watch: [id] }
)

const business = computed(() => data.value)


const tabs = [
  {
    slot: 'overview',
    label: 'Aperçu',
    icon: 'i-heroicons-chat-bubble-left-right',
    value: 'overview'
  },
  {
    slot: 'reviews',
    label: 'Avis',
    icon: 'i-heroicons-chat-bubble-left-right',
    value: 'reviews'
  },
  {
    slot: 'photos',
    label: 'Photos',
    icon: 'i-heroicons-chat-bubble-left-right',
    value: 'photos'
  }
]

</script>
