import { defineStore } from 'pinia'

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [
      {
        id: '1',
        name: 'Restaurants',
        icon: 'i-heroicons-utensils',
        slug: 'restaurants',
        subcategories: [
          { id: '1-1', name: 'Français', slug: 'francais', categoryId: '1' },
          { id: '1-2', name: 'Italien', slug: 'italien', categoryId: '1' },
          { id: '1-3', name: 'Japonais', slug: 'japonais', categoryId: '1' },
          { id: '1-4', name: 'Indien', slug: 'indien', categoryId: '1' },
          { id: '1-5', name: 'Fast-food', slug: 'fast-food', categoryId: '1' }
        ]
      },
      {
        id: '2',
        name: 'Hôtels',
        icon: 'i-heroicons-home',
        slug: 'hotels',
        subcategories: [
          { id: '2-1', name: 'Hôtels 5 étoiles', slug: 'hotels-5-etoiles', categoryId: '2' },
          { id: '2-2', name: 'Hôtels 4 étoiles', slug: 'hotels-4-etoiles', categoryId: '2' },
          { id: '2-3', name: 'Hôtels 3 étoiles', slug: 'hotels-3-etoiles', categoryId: '2' },
          { id: '2-4', name: 'Auberges', slug: 'auberges', categoryId: '2' }
        ]
      },
      {
        id: '3',
        name: 'Shopping',
        icon: 'i-heroicons-shopping-bag',
        slug: 'shopping',
        subcategories: [
          { id: '3-1', name: 'Mode', slug: 'mode', categoryId: '3' },
          { id: '3-2', name: 'Électronique', slug: 'electronique', categoryId: '3' },
          { id: '3-3', name: 'Librairies', slug: 'librairies', categoryId: '3' },
          { id: '3-4', name: 'Sports', slug: 'sports', categoryId: '3' }
        ]
      },
      {
        id: '4',
        name: 'Services',
        icon: 'i-heroicons-wrench-screwdriver',
        slug: 'services',
        subcategories: [
          { id: '4-1', name: 'Plomberie', slug: 'plomberie', categoryId: '4' },
          { id: '4-2', name: 'Électricité', slug: 'electricite', categoryId: '4' },
          { id: '4-3', name: 'Ménage', slug: 'menage', categoryId: '4' },
          { id: '4-4', name: 'Jardinage', slug: 'jardinage', categoryId: '4' }
        ]
      },
      {
        id: '5',
        name: 'Beauté & Bien-être',
        icon: 'i-heroicons-sparkles',
        slug: 'beauty-wellness',
        subcategories: [
          { id: '5-1', name: 'Salons de coiffure', slug: 'salons-coiffure', categoryId: '5' },
          { id: '5-2', name: 'Spas', slug: 'spas', categoryId: '5' },
          { id: '5-3', name: 'Manucure', slug: 'manucure', categoryId: '5' },
          { id: '5-4', name: 'Massage', slug: 'massage', categoryId: '5' }
        ]
      },
      {
        id: '6',
        name: 'Santé',
        icon: 'i-heroicons-heart',
        slug: 'health',
        subcategories: [
          { id: '6-1', name: 'Médecins', slug: 'medecins', categoryId: '6' },
          { id: '6-2', name: 'Dentistes', slug: 'dentistes', categoryId: '6' },
          { id: '6-3', name: 'Pharmacies', slug: 'pharmacies', categoryId: '6' },
          { id: '6-4', name: 'Kinésithérapeutes', slug: 'kinesitherapeutes', categoryId: '6' }
        ]
      }
    ] as Category[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getAllCategories: (state) => state.categories,
    
    getCategoryById: (state) => (id: string) => {
      return state.categories.find(category => category.id === id)
    },
    
    getSubcategoriesByCategoryId: (state) => (categoryId: string) => {
      const category = state.categories.find(cat => cat.id === categoryId)
      return category?.subcategories || []
    },
    
    searchCategories: (state) => (query: string) => {
      if (!query) return []
      
      const lowerQuery = query.toLowerCase()
      
      // Recherche dans les catégories
      const matchingCategories = state.categories.filter(category => 
        category.name.toLowerCase().includes(lowerQuery)
      )
      
      // Recherche dans les sous-catégories
      const matchingSubcategories = state.categories.flatMap(category => 
        (category.subcategories || [])
          .filter(subcat => subcat.name.toLowerCase().includes(lowerQuery))
          .map(subcat => ({
            id: subcat.id,
            name: `${subcat.name} (${category.name})`,
            slug: subcat.slug,
            categoryId: category.id,
            isSubcategory: true
          }))
      )
      
      return [...matchingCategories, ...matchingSubcategories]
    }
  },

  actions: {
    async fetchCategories() {
      // Dans une application réelle, cette fonction ferait un appel API à Supabase
      // Pour l'instant, nous utilisons les données statiques
      this.loading = true
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 300))
        // Les catégories sont déjà chargées dans l'état initial
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Erreur lors du chargement des catégories'
        this.loading = false
      }
    }
  }
})
