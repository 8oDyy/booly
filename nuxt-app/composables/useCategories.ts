import { ref, onMounted } from 'vue'
import type { DropdownMenuItem } from '#ui/types'

// Utiliser des données statiques en attendant de résoudre le problème de connexion à Supabase
export const useCategories = () => {
  const categories = ref<DropdownMenuItem[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Utiliser des données statiques pour le moment
      // Ces données simulent celles qui devraient venir de Supabase
      console.log('Utilisation de données statiques pour les catégories')
      
      // Données statiques pour les catégories et sous-catégories
      const staticCategories = [
        {
          label: 'Restauration',
          icon: 'i-heroicons-cake',
          children: [
            { label: 'Restaurants', to: '/categories/restauration/restaurants' },
            { label: 'Cafés', to: '/categories/restauration/cafes' },
            { label: 'Fast-food', to: '/categories/restauration/fast-food' },
            { label: 'Boulangeries', to: '/categories/restauration/boulangeries' }
          ]
        },
        {
          label: 'Santé & Beauté',
          icon: 'i-heroicons-heart',
          children: [
            { label: 'Salons de coiffure', to: '/categories/sante-beaute/salons-coiffure' },
            { label: 'Spas', to: '/categories/sante-beaute/spas' },
            { label: 'Fitness', to: '/categories/sante-beaute/fitness' },
            { label: 'Pharmacies', to: '/categories/sante-beaute/pharmacies' }
          ]
        },
        {
          label: 'Shopping',
          icon: 'i-heroicons-shopping-bag',
          children: [
            { label: 'Vêtements', to: '/categories/shopping/vetements' },
            { label: 'Électronique', to: '/categories/shopping/electronique' },
            { label: 'Librairies', to: '/categories/shopping/librairies' },
            { label: 'Supermarchés', to: '/categories/shopping/supermarches' }
          ]
        },
        {
          label: 'Services',
          icon: 'i-heroicons-wrench-screwdriver',
          children: [
            { label: 'Banques', to: '/categories/services/banques' },
            { label: 'Assurances', to: '/categories/services/assurances' },
            { label: 'Immobilier', to: '/categories/services/immobilier' },
            { label: 'Automobile', to: '/categories/services/automobile' }
          ]
        }
      ];
      
      categories.value = staticCategories;
      console.log('Catégories statiques chargées:', staticCategories);
      
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories statiques:', err)
      error.value = err.message || 'Une erreur est survenue lors du chargement des catégories'
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchCategories()
  })
  
  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}
