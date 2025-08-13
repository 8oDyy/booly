export async function calculateGPSCoordinates({ address, city, postalCode, country }: {
  address: string
  city: string
  postalCode: string
  country: string
}) {
    try {
      // Simulation d'un appel à une API de géocodage
      // En production, vous pourriez utiliser Google Maps API, OpenStreetMap, etc.
  
      const fullAddress = `${address}, ${postalCode} ${city}, ${country}`
  
      // Simulation avec des coordonnées aléatoires pour la démo
      // En réalité, vous feriez un appel API ici
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      // Coordonnées simulées pour Paris (vous remplaceriez par un vrai appel API)
      const mockCoordinates = {
        lat: (48.8566 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (2.3522 + (Math.random() - 0.5) * 0.1).toFixed(6),
      }
  
      return mockCoordinates
  
      /* Exemple d'implémentation réelle avec une API :
      const response = await fetch(`https://api.geocoding.service.com/geocode?address=${encodeURIComponent(fullAddress)}`)
      const data = await response.json()
      
      return {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
      }
      */
    } catch (error) {
      console.error("Erreur lors du calcul des coordonnées GPS:", error)
      throw new Error("Impossible de calculer les coordonnées GPS")
    }
  }
  
  // Fonction utilitaire pour valider des coordonnées GPS
  export function validateGPSCoordinates(lat: number | string, lng: number | string) {
    const latitude = Number.parseFloat(lat.toString())
    const longitude = Number.parseFloat(lng.toString())
  
    return (
      !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    )
  }
  
  // Fonction pour calculer la distance entre deux points GPS
  export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371 // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance en km
  }
  