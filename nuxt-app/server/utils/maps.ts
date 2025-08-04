import { defineEventHandler } from 'h3'
import { useStorage } from '#imports'

// Cache pour les données cartographiques
const MAPS_CACHE_KEY = 'google-maps-cache'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 heures en millisecondes

interface MapsCache {
  lastFetchTime: number;
  styleData: any;
}

/**
 * Récupère les données cartographiques avec mise en cache
 * Cette fonction permet de stocker les styles et configurations de la carte
 * pour éviter de recharger ces données à chaque requête
 */
export async function getMapsData() {
  // Utiliser le stockage Nitro pour la persistance
  const storage = useStorage('maps')
  
  try {
    // Vérifier si le cache existe
    const cachedData = await storage.getItem<MapsCache>(MAPS_CACHE_KEY)
    const now = Date.now()
    
    // Si le cache est valide, le retourner
    if (cachedData && (now - cachedData.lastFetchTime) < CACHE_TTL) {
      console.log('🗺️ Utilisation du cache pour les données cartographiques')
      return cachedData.styleData
    }
    
    // Si pas de cache ou cache expiré, générer de nouvelles données
    console.log('🗺️ Génération de nouvelles données cartographiques')
    
    // Ici, nous définissons les styles et configurations de la carte
    // qui seraient normalement chargés depuis l'API Google Maps
    const mapStyleData = {
      styles: [
        // Style minimaliste
        {
          featureType: 'administrative',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ visibility: 'on' }, { color: '#c8e6c9' }]
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels',
          stylers: [{ visibility: 'simplified' }]
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#bbdefb' }]
        }
      ],
      defaultCenter: { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
      defaultZoom: 13,
      mapOptions: {
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      }
    }
    
    // Mettre à jour le cache
    await storage.setItem(MAPS_CACHE_KEY, {
      lastFetchTime: now,
      styleData: mapStyleData
    })
    
    return mapStyleData
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données cartographiques:', error)
    return {
      styles: [],
      defaultCenter: { lat: 48.8566, lng: 2.3522 },
      defaultZoom: 13,
      mapOptions: {}
    }
  }
}

/**
 * Endpoint pour récupérer les données cartographiques
 */
export default defineEventHandler(async (event) => {
  return await getMapsData()
})
