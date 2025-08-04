<template>
    <div class="map-container-full">
      <!-- Loader pendant le chargement -->
      <div v-if="!mapLoaded" class="map-loader">
        <div class="loader-spinner"></div>
        <p>Chargement de Google Maps...</p>
      </div>
  
      <!-- Google Map (rendu côté client uniquement) -->
      <ClientOnly>
        <div 
          v-show="mapLoaded"
          ref="mapContainer" 
          class="google-map"
        ></div>
      
        <template #fallback>
          <div class="map-fallback">
            <p>Initialisation de la carte...</p>
          </div>
        </template>
      </ClientOnly>
  
      <!-- Contrôles personnalisés -->
      <div v-if="mapLoaded" class="map-controls">
        <button @click="centerOnBusinesses" class="control-btn" title="Centrer sur les restaurants">
          <MapPinIcon class="w-4 h-4" />
          <span>Centrer</span>
        </button>
      
        <button @click="getCurrentLocation" class="control-btn" title="Ma position">
          <LocateIcon class="w-4 h-4" />
          <span>Position</span>
        </button>
      </div>
  
      <!-- Composant de preview au survol -->
      <BusinessPreview
        v-if="hoveredBusiness && mapLoaded"
        :business="hoveredBusiness"
        :position="previewPosition"
        @click="selectBusiness(hoveredBusiness)"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, watch } from 'vue'
  import { MapPinIcon, LocateIcon } from 'lucide-vue-next'
  import BusinessPreview from './BusinessPreview.vue'
  import { useRuntimeConfig } from '#app'
  
  const { public: { googleMapsApiKey } } = useRuntimeConfig()
  
  // Props
  const props = defineProps({
    businesses: {
      type: Array,
      default: () => []
    }
  })
  
  // Emits
  const emit = defineEmits(['business-selected'])
  
  // État local
  const mapContainer = ref(null)
  const mapLoaded = ref(false)
  const map = ref(null)
  const markers = ref([])
  const hoveredBusiness = ref(null)
  const previewPosition = ref({ x: 0, y: 0 })
  const googleMapsLoaded = ref(false)
  
  // État des données cartographiques
  const mapData = ref({
    styles: [],
    defaultCenter: { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
    defaultZoom: 13,
    mapOptions: {
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'cooperative'
    }
  })
  
  // Récupérer les données cartographiques depuis le cache serveur
  const fetchMapData = async () => {
    try {
      console.log('🔍 Récupération des données cartographiques depuis le cache serveur')
      const response = await fetch('/api/maps')
      const result = await response.json()
      
      if (result.success && result.data) {
        console.log('✅ Données cartographiques récupérées avec succès')
        mapData.value = result.data
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données cartographiques:', error)
    }
  }
  
  // Configuration Google Maps avec les données en cache
  const getMapOptions = () => ({
    zoom: mapData.value.defaultZoom,
    center: mapData.value.defaultCenter,
    disableDefaultUI: mapData.value.mapOptions?.disableDefaultUI ?? true,
    zoomControl: mapData.value.mapOptions?.zoomControl ?? true,
    zoomControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_RIGHT || 2
    },
    gestureHandling: mapData.value.mapOptions?.gestureHandling ?? 'cooperative',
    styles: mapData.value.styles || []
  })
  
  // Chargement de Google Maps
  const loadGoogleMaps = () => {
    if (!process.client) return
  
    console.log('Tentative de chargement de Google Maps...')
  
    // Vérifier si Google Maps est déjà chargé
    if (window.google && window.google.maps) {
      console.log('Google Maps déjà chargé')
      googleMapsLoaded.value = true
      initializeMap()
      return
    }
  
    // Créer le script Google Maps
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      console.log('Script Google Maps chargé avec succès')
      googleMapsLoaded.value = true
      nextTick(() => {
        initializeMap()
      })
    }
    
    script.onerror = (error) => {
      console.error('Erreur lors du chargement de Google Maps:', error)
    }
    
    document.head.appendChild(script)
  }
  
  // Initialisation de la carte
  const initializeMap = () => {
    console.log('Tentative d\'initialisation de la carte...')
  
    if (!mapContainer.value || !window.google || !window.google.maps) {
      console.log('Conditions non remplies pour initialiser la carte')
      return
    }
  
    try {
      console.log('Création de la carte Google Maps...')
      map.value = new window.google.maps.Map(mapContainer.value, getMapOptions())
      mapLoaded.value = true
      console.log('Carte créée avec succès')
      
      nextTick(() => {
        addBusinessMarkers()
        if (props.businesses.length > 0) {
          setTimeout(() => {
            centerOnBusinesses()
          }, 1000)
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error)
    }
  }
  
  // Ajouter les marqueurs des businesses
  const addBusinessMarkers = () => {
    if (!map.value || !window.google || !window.google.maps) return
  
    console.log('Ajout des marqueurs pour', props.businesses.length, 'businesses')
  
    // Nettoyer les anciens marqueurs
    markers.value.forEach(marker => marker.setMap(null))
    markers.value = []
  
    props.businesses.forEach(business => {
      if (!business.latitude || !business.longitude) {
        console.log('Business sans coordonnées:', business.name)
        return
      }
  
      try {
        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(business.latitude),
            lng: parseFloat(business.longitude)
          },
          map: map.value,
          title: business.name,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="3"/>
                <circle cx="16" cy="16" r="4" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16)
          }
        })
  
        // Événements de survol
        marker.addListener('mouseover', (event) => {
          hoveredBusiness.value = business
          previewPosition.value = {
            x: event.domEvent?.clientX || 0,
            y: event.domEvent?.clientY || 0
          }
        })
  
        marker.addListener('mouseout', () => {
          hoveredBusiness.value = null
        })
  
        marker.addListener('click', () => {
          selectBusiness(business)
        })
  
        markers.value.push(marker)
      } catch (error) {
        console.error('Erreur lors de la création du marqueur:', error)
      }
    })
  }
  
  // Méthodes
  const selectBusiness = (business) => {
    hoveredBusiness.value = null
    emit('business-selected', business)
  }
  
  const centerOnBusinesses = () => {
    if (!map.value || !window.google || props.businesses.length === 0) return
  
    try {
      const bounds = new window.google.maps.LatLngBounds()
      
      props.businesses.forEach(business => {
        if (business.latitude && business.longitude) {
          bounds.extend({
            lat: parseFloat(business.latitude),
            lng: parseFloat(business.longitude)
          })
        }
      })
  
      map.value.fitBounds(bounds)
      
      // Ajuster le zoom si nécessaire
      const listener = window.google.maps.event.addListener(map.value, 'idle', () => {
        if (map.value.getZoom() > 16) map.value.setZoom(16)
        window.google.maps.event.removeListener(listener)
      })
    } catch (error) {
      console.error('Erreur lors du centrage:', error)
    }
  }
  
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas disponible')
      return
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!map.value || !window.google) return
  
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
  
        map.value.setCenter(pos)
        map.value.setZoom(15)
  
        // Ajouter un marqueur pour la position utilisateur
        try {
          new window.google.maps.Marker({
            position: pos,
            map: map.value,
            title: 'Votre position',
            icon: {
              url: 'data:image/svg+xml;base64=' + btoa(`
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#22c55e" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            }
          })
        } catch (error) {
          console.error('Erreur lors de la création du marqueur utilisateur:', error)
        }
      },
      () => {
        alert('Impossible d\'obtenir votre position')
      }
    )
  }
  
  // Watchers
  watch(() => props.businesses, () => {
    console.log('Businesses mis à jour:', props.businesses.length)
    if (mapLoaded.value) {
      addBusinessMarkers()
      if (props.businesses.length > 0) {
        setTimeout(() => {
          centerOnBusinesses()
        }, 500)
      }
    }
  }, { deep: true })
  
  // Lifecycle
  onMounted(async () => {
    console.log('InteractiveMap monté')
    // Récupérer d'abord les données cartographiques depuis le cache
    await fetchMapData()
    // Puis charger Google Maps avec ces données
    loadGoogleMaps()
  })
  </script>
  
  <style scoped>
  .map-container-full {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  .google-map {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  .map-loader,
  .map-fallback {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    color: #64748b;
    margin: 0;
    padding: 0;
  }
  
  .loader-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .map-controls {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 1000;
  }
  
  .control-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .control-btn:hover {
    background: #f9fafb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  </style>
  