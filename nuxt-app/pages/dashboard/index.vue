<template>
  <UPage>
    <UPageHeader
      title="Tableau de bord"
      class="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white"
      :ui="{
        container: 'relative py-4 flex flex-col items-center justify-center text-center',
        title: 'text-white text-2xl font-bold mb-0',
        wrapper: 'w-full max-w-6xl'
      }"
    />
    
    <UPageBody>
      <UContainer class="py-8">
        <div v-if="loading" class="flex justify-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-blue-500" />
        </div>
        
        <template v-else>
          <!-- Informations utilisateur -->
          <UCard class="mb-8">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Informations personnelles</h2>
                <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" to="/profile/edit" />
              </div>
            </template>
            
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-shrink-0">
                <UAvatar
                  :src="profile?.avatar_url || ''"
                  :alt="profile?.full_name || 'Utilisateur'"
                  size="xl"
                  :ui="{ rounded: 'rounded-full' }"
                />
              </div>
              <div class="space-y-2">
                <h3 class="text-xl font-bold">{{ profile?.full_name || 'Utilisateur' }}</h3>
                <p class="text-gray-500">{{ profile?.email }}</p>
                <p class="text-sm text-gray-500">Membre depuis {{ formatDate(profile?.created_at) }}</p>
              </div>
            </div>
          </UCard>
          
          <!-- Abonnement actuel -->
          <UCard class="mb-8">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Votre abonnement</h2>
              </div>
            </template>
            
            <div v-if="subscription">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-xl font-bold">Plan {{ getPlanName(subscription.plan_type) }}</h3>
                    <UBadge v-if="subscription.status === 'active'" color="green">Actif</UBadge>
                    <UBadge v-else-if="subscription.status === 'canceled'" color="yellow">Annulé</UBadge>
                    <UBadge v-else-if="subscription.status === 'past_due'" color="red">Paiement en retard</UBadge>
                    <UBadge v-else color="gray">{{ subscription.status }}</UBadge>
                  </div>
                  <p class="text-gray-500">
                    {{ subscription.status === 'active' ? 'Votre abonnement est actif' : 'Votre abonnement n\'est pas actif' }}
                  </p>
                </div>
                
                <div v-if="subscription.plan_type !== 'free'" class="mt-4 md:mt-0">
                  <UButton 
                    v-if="subscription.status === 'active'" 
                    color="red" 
                    variant="outline" 
                    @click="confirmCancelSubscription = true"
                  >
                    Annuler l'abonnement
                  </UButton>
                  <UButton 
                    v-else-if="subscription.status === 'canceled'" 
                    color="primary" 
                    to="/business"
                  >
                    Réactiver l'abonnement
                  </UButton>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <UCard class="bg-gray-50">
                  <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">Prix</div>
                    <div class="text-lg font-bold">
                      {{ getPlanPrice(subscription.plan_type) }}
                    </div>
                  </div>
                </UCard>
                
                <UCard class="bg-gray-50">
                  <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">Début de période</div>
                    <div class="text-lg font-bold">
                      {{ formatDate(subscription.current_period_start) }}
                    </div>
                  </div>
                </UCard>
                
                <UCard class="bg-gray-50">
                  <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">Fin de période</div>
                    <div class="text-lg font-bold">
                      {{ formatDate(subscription.current_period_end) }}
                    </div>
                  </div>
                </UCard>
              </div>
              
              <div v-if="subscription.status === 'active' && subscription.plan_type !== 'free'" class="border-t pt-4">
                <p class="text-sm text-gray-500">
                  Votre abonnement se renouvellera automatiquement le {{ formatDate(subscription.current_period_end) }}.
                  {{ subscription.cancel_at ? `L'abonnement prendra fin le ${formatDate(subscription.cancel_at)}.` : '' }}
                </p>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-credit-card" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun abonnement actif</h3>
              <p class="text-gray-500 mb-4">Vous n'avez pas encore d'abonnement actif.</p>
              <UButton to="/business" color="primary">Voir les plans disponibles</UButton>
            </div>
          </UCard>
          
          <!-- Historique des paiements -->
          <UCard v-if="subscription && subscription.plan_type !== 'free'">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Historique des paiements</h2>
              </div>
            </template>
            
            <div class="overflow-x-auto">
              <UTable :columns="paymentColumns" :rows="paymentHistory" :loading="loadingPayments">
                <template #empty-state>
                  <div class="text-center py-4">
                    <p class="text-gray-500">Aucun paiement trouvé</p>
                  </div>
                </template>
              </UTable>
            </div>
          </UCard>
        </template>
      </UContainer>
    </UPageBody>
    
    <!-- Modal de confirmation d'annulation -->
    <UModal v-model="confirmCancelSubscription">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Confirmer l'annulation</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="confirmCancelSubscription = false" />
          </div>
        </template>
        
        <div class="py-4">
          <p class="mb-4">Êtes-vous sûr de vouloir annuler votre abonnement ?</p>
          <p class="text-sm text-gray-500 mb-4">
            Votre abonnement restera actif jusqu'à la fin de la période en cours, puis ne sera pas renouvelé.
            Vous perdrez l'accès aux fonctionnalités premium à ce moment-là.
          </p>
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" @click="confirmCancelSubscription = false">Annuler</UButton>
            <UButton color="red" :loading="cancellingSubscription" @click="cancelSubscription">
              Confirmer l'annulation
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UPage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@nuxt/ui'
import { useSupabaseClient } from '#imports'

definePageMeta({
  title: 'Tableau de bord - Booly',
  description: 'Gérez votre compte et vos abonnements'
})

const toast = useToast()
const supabase = useSupabaseClient()
const loading = ref(true)
const profile = ref(null)
const subscription = ref(null)
const paymentHistory = ref([])
const loadingPayments = ref(false)
const confirmCancelSubscription = ref(false)
const cancellingSubscription = ref(false)

const paymentColumns = [
  {
    key: 'date',
    label: 'Date',
  },
  {
    key: 'amount',
    label: 'Montant',
  },
  {
    key: 'status',
    label: 'Statut',
  },
  {
    key: 'invoice',
    label: 'Facture',
  }
]

onMounted(async () => {
  await fetchUserData()
})

async function fetchUserData() {
  try {
    loading.value = true
    
    // Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      navigateTo('/auth/login')
      return
    }
    
    // Récupérer le profil utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      
    if (profileError) throw profileError
    profile.value = profileData
    
    // Récupérer l'abonnement actif
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      
    if (!subscriptionError) {
      subscription.value = subscriptionData
      
      // Si l'utilisateur a un abonnement premium, récupérer l'historique des paiements
      if (subscription.value && subscription.value.plan_type !== 'free') {
        await fetchPaymentHistory()
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger vos informations',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

async function fetchPaymentHistory() {
  try {
    loadingPayments.value = true
    
    // Simuler la récupération de l'historique des paiements
    // Dans une application réelle, vous feriez un appel à votre API pour récupérer les paiements depuis Stripe
    await new Promise(resolve => setTimeout(resolve, 500))
    
    paymentHistory.value = [
      {
        id: 1,
        date: new Date().toISOString(),
        amount: '29,00 €',
        status: 'Payé',
        invoice: 'https://example.com/invoice/1'
      },
      {
        id: 2,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: '29,00 €',
        status: 'Payé',
        invoice: 'https://example.com/invoice/2'
      }
    ]
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des paiements:', error)
  } finally {
    loadingPayments.value = false
  }
}

async function cancelSubscription() {
  try {
    cancellingSubscription.value = true
    
    // Appeler l'API pour annuler l'abonnement dans Stripe
    const response = await $fetch('/api/cancel-subscription', {
      method: 'POST',
      body: {
        subscriptionId: subscription.value.id
      }
    })
    
    if (!response.success) throw new Error('Échec de l\'annulation')
    
    // Mettre à jour l'interface utilisateur sans appel supplémentaire à Supabase
    // car l'API a déjà mis à jour la base de données
    
    // Mettre à jour l'interface utilisateur
    subscription.value.status = 'canceled'
    subscription.value.canceled_at = new Date().toISOString()
    
    confirmCancelSubscription.value = false
    toast.add({
      title: 'Abonnement annulé',
      description: 'Votre abonnement sera actif jusqu\'à la fin de la période en cours',
      color: 'green'
    })
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible d\'annuler votre abonnement',
      color: 'red'
    })
  } finally {
    cancellingSubscription.value = false
  }
}

function getPlanName(planType) {
  switch (planType) {
    case 'free':
      return 'Gratuit'
    case 'premium':
      return 'Premium'
    case 'business':
      return 'Business'
    default:
      return planType
  }
}

function getPlanPrice(planType) {
  switch (planType) {
    case 'free':
      return '0 €/mois'
    case 'premium':
      return '29 €/mois'
    case 'business':
      return '79 €/mois'
    default:
      return '? €/mois'
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
</script>
