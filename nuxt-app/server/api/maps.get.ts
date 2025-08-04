import { defineEventHandler } from 'h3'
import { getMapsData } from '../utils/maps'

/**
 * Endpoint API pour récupérer les données cartographiques mises en cache
 */
export default defineEventHandler(async (event) => {
  try {
    const mapsData = await getMapsData()
    return {
      success: true,
      data: mapsData
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données cartographiques:', error)
    return {
      success: false,
      error: 'Erreur lors de la récupération des données cartographiques'
    }
  }
})
