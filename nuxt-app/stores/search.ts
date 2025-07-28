import { defineStore } from 'pinia'

export interface SearchState {
  serviceQuery: string
  locationQuery: string
  selectedCategoryId: string | null
  selectedSubcategoryId: string | null
  selectedLocationId: string | null
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    serviceQuery: '',
    locationQuery: '',
    selectedCategoryId: null,
    selectedSubcategoryId: null,
    selectedLocationId: null,
    recentSearches: [] as {service: string, location: string}[]
  }),

  actions: {
    updateServiceQuery(query: string) {
      this.serviceQuery = query
    },
    
    updateLocationQuery(query: string) {
      this.locationQuery = query
    },
    
    selectCategory(categoryId: string | null) {
      this.selectedCategoryId = categoryId as any
      // Réinitialiser la sous-catégorie si on change de catégorie
      if (categoryId === null) {
        this.selectedSubcategoryId = null
      }
    },
    
    selectSubcategory(subcategoryId: string | null) {
      this.selectedSubcategoryId = subcategoryId as any
    },
    
    selectLocation(locationId: string | null) {
      this.selectedLocationId = locationId as any
    },
    
    resetSearch() {
      this.serviceQuery = ''
      this.locationQuery = ''
      this.selectedCategoryId = null
      this.selectedSubcategoryId = null
      this.selectedLocationId = null
    },
    
    saveSearch() {
      // Sauvegarder la recherche actuelle dans l'historique
      if (this.serviceQuery || this.locationQuery) {
        this.recentSearches.unshift({
          service: this.serviceQuery,
          location: this.locationQuery
        })
        
        // Limiter à 5 recherches récentes
        if (this.recentSearches.length > 5) {
          this.recentSearches.pop()
        }
      }
    },
    
    search() {
      // Sauvegarder la recherche
      this.saveSearch()
      
      // Construire les paramètres de recherche
      const query: Record<string, string> = {}
      
      if (this.serviceQuery) {
        query.service = this.serviceQuery
      }
      
      if (this.locationQuery) {
        query.location = this.locationQuery
      }
      
      if (this.selectedCategoryId) {
        query.category = this.selectedCategoryId
      }
      
      if (this.selectedSubcategoryId) {
        query.subcategory = this.selectedSubcategoryId
      }
      
      // Rediriger vers la page de recherche avec les paramètres
      return navigateTo({
        path: '/search',
        query
      })
    }
  }
})
