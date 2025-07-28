import { defineStore } from 'pinia'

export interface Location {
  id: string
  name: string
  postalCode: string
  department: string
  region: string
}

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [
      { id: '1', name: 'Paris', postalCode: '75000', department: 'Paris', region: 'Île-de-France' },
      { id: '2', name: 'Lyon', postalCode: '69000', department: 'Rhône', region: 'Auvergne-Rhône-Alpes' },
      { id: '3', name: 'Marseille', postalCode: '13000', department: 'Bouches-du-Rhône', region: 'Provence-Alpes-Côte d\'Azur' },
      { id: '4', name: 'Bordeaux', postalCode: '33000', department: 'Gironde', region: 'Nouvelle-Aquitaine' },
      { id: '5', name: 'Lille', postalCode: '59000', department: 'Nord', region: 'Hauts-de-France' },
      { id: '6', name: 'Nantes', postalCode: '44000', department: 'Loire-Atlantique', region: 'Pays de la Loire' },
      { id: '7', name: 'Strasbourg', postalCode: '67000', department: 'Bas-Rhin', region: 'Grand Est' },
      { id: '8', name: 'Toulouse', postalCode: '31000', department: 'Haute-Garonne', region: 'Occitanie' },
      { id: '9', name: 'Nice', postalCode: '06000', department: 'Alpes-Maritimes', region: 'Provence-Alpes-Côte d\'Azur' },
      { id: '10', name: 'Rennes', postalCode: '35000', department: 'Ille-et-Vilaine', region: 'Bretagne' },
    ] as Location[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getAllLocations: (state) => state.locations,
    
    getLocationById: (state) => (id: string) => {
      return state.locations.find(location => location.id === id)
    },
    
    searchLocations: (state) => (query: string) => {
      if (!query || query.length < 2) return []
      
      const lowerQuery = query.toLowerCase()
      
      return state.locations.filter(location => 
        location.name.toLowerCase().includes(lowerQuery) || 
        location.postalCode.includes(query) ||
        location.department.toLowerCase().includes(lowerQuery) ||
        location.region.toLowerCase().includes(lowerQuery)
      )
    }
  },

  actions: {
    async fetchLocations() {
      // Dans une application réelle, cette fonction ferait un appel API à Supabase
      this.loading = true
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 300))
        // Les emplacements sont déjà chargés dans l'état initial
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Erreur lors du chargement des emplacements'
        this.loading = false
      }
    }
  }
})
