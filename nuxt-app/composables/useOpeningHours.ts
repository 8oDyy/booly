import type { Database } from '~/types/supabase'

type OpeningHoursRow = Database['public']['Tables']['opening_hours']['Row']
type OpeningHoursInsert = Database['public']['Tables']['opening_hours']['Insert']
type OpeningHoursUpdate = Database['public']['Tables']['opening_hours']['Update']

// Structure pour les horaires d'ouverture
// Format simple : tableau de créneaux horaires ["10:00-13:00", "14:00-17:00"]
// Un tableau vide [] signifie fermé
export interface DayOpeningHours {
  isOpen: boolean
  openTime: string
  closeTime: string
  timeSlots: string[] // Format: ["10:00-13:00", "14:00-17:00"]
}

export interface WeeklyOpeningHours {
  monday: DayOpeningHours
  tuesday: DayOpeningHours
  wednesday: DayOpeningHours
  thursday: DayOpeningHours
  friday: DayOpeningHours
  saturday: DayOpeningHours
  sunday: DayOpeningHours
}

// Mapping des jours de la semaine
const DAY_MAPPING = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6
} as const

const REVERSE_DAY_MAPPING = {
  6: 'sunday',
  0: 'monday',
  1: 'tuesday',
  2: 'wednesday',
  3: 'thursday',
  4: 'friday',
  5: 'saturday'
} as const

export const useOpeningHours = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const openingHours = ref<WeeklyOpeningHours>({
    monday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
    friday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
    saturday: { isOpen: true, openTime: '10:00', closeTime: '17:00', timeSlots: ['10:00-17:00'] },
    sunday: { isOpen: false, openTime: '10:00', closeTime: '17:00', timeSlots: [] }
  })

  // Charger les horaires d'ouverture pour une entreprise
  const loadOpeningHours = async (businessId: string) => {
    if (!businessId) {
      console.warn('⚠️ useOpeningHours - ID entreprise manquant')
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('🔄 useOpeningHours - Chargement des horaires pour:', businessId)

      const { data, error: supabaseError } = await supabase
        .from('opening_hours')
        .select('*')
        .eq('business_id', businessId)

      if (supabaseError) {
        console.error('❌ useOpeningHours - Erreur Supabase:', supabaseError)
        throw supabaseError
      }

      console.log('📊 useOpeningHours - Données brutes récupérées:', data)
      console.log('📊 useOpeningHours - Nombre de lignes:', data?.length || 0)

      if (data && data.length > 0) {
        const weeklyHours: WeeklyOpeningHours = {
          monday: { isOpen: false, openTime: '09:00', closeTime: '18:00', timeSlots: [] },
          tuesday: { isOpen: false, openTime: '09:00', closeTime: '18:00', timeSlots: [] },
          wednesday: { isOpen: false, openTime: '09:00', closeTime: '18:00', timeSlots: [] },
          thursday: { isOpen: false, openTime: '09:00', closeTime: '18:00', timeSlots: [] },
          friday: { isOpen: false, openTime: '09:00', closeTime: '18:00', timeSlots: [] },
          saturday: { isOpen: false, openTime: '09:00', closeTime: '18:00', timeSlots: [] },
          sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00', timeSlots: [] }
        }

        data.forEach((row: OpeningHoursRow) => {
          console.log('🔍 useOpeningHours - Traitement ligne:', row)
          console.log('🔍 useOpeningHours - day_of_week:', row.day_of_week)
          console.log('🔍 useOpeningHours - opening_times:', row.opening_times)
          console.log('🔍 useOpeningHours - Type opening_times:', typeof row.opening_times)
          
          const dayKey = REVERSE_DAY_MAPPING[row.day_of_week as keyof typeof REVERSE_DAY_MAPPING]
          console.log('🔍 useOpeningHours - dayKey mappé:', dayKey)
          
          if (dayKey && row.opening_times) {
            const timeSlots = row.opening_times as string[]
            console.log('🔍 useOpeningHours - timeSlots parsés:', timeSlots)
            
            const isOpen = timeSlots.length > 0
            const firstSlot = timeSlots[0] || '09:00-18:00'
            const [openTime, closeTime] = firstSlot.split('-')
            
            console.log('🔍 useOpeningHours - isOpen:', isOpen)
            console.log('🔍 useOpeningHours - firstSlot:', firstSlot)
            console.log('🔍 useOpeningHours - openTime:', openTime, 'closeTime:', closeTime)
            
            weeklyHours[dayKey as keyof WeeklyOpeningHours] = {
              isOpen,
              openTime: openTime || '09:00',
              closeTime: closeTime || '18:00',
              timeSlots: timeSlots
            }
          }
        })

        console.log('✅ useOpeningHours - Horaires finaux construits:', weeklyHours)
        openingHours.value = weeklyHours
      } else {
        console.log('ℹ️ useOpeningHours - Aucune donnée trouvée, utilisation des valeurs par défaut')
      }

    } catch (err) {
      console.error('❌ useOpeningHours - Erreur lors du chargement:', err)
      error.value = 'Erreur lors du chargement des horaires'
    } finally {
      loading.value = false
    }
  }

  // Sauvegarder les horaires d'ouverture
  const saveOpeningHours = async (businessId: string, hours: WeeklyOpeningHours) => {
    if (!businessId) {
      console.warn('⚠️ useOpeningHours - Business ID manquant')
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('💾 useOpeningHours - Sauvegarde des horaires pour:', businessId)
      console.log('💾 useOpeningHours - Données à sauvegarder:', hours)

      // Supprimer les anciens horaires
      console.log('🗑️ useOpeningHours - Suppression des anciens horaires...')
      const { error: deleteError } = await supabase
        .from('opening_hours')
        .delete()
        .eq('business_id', businessId)

      if (deleteError) {
        console.error('❌ useOpeningHours - Erreur suppression:', deleteError)
        throw deleteError
      }
      console.log('✅ useOpeningHours - Anciens horaires supprimés')

      // Préparer les nouvelles données
      const hoursToInsert: OpeningHoursInsert[] = Object.entries(hours).map(([dayKey, dayHours]) => {
        const insertData = {
          business_id: businessId,
          day_of_week: DAY_MAPPING[dayKey as keyof typeof DAY_MAPPING],
          opening_times: dayHours.timeSlots
        }
        console.log(`📝 useOpeningHours - Préparation ${dayKey}:`, insertData)
        return insertData
      })

      console.log('📋 useOpeningHours - Données finales à insérer:', hoursToInsert)

      // Insérer les nouveaux horaires
      console.log('💾 useOpeningHours - Insertion des nouveaux horaires...')
      const { data: insertData, error: insertError } = await supabase
        .from('opening_hours')
        .insert(hoursToInsert)
        .select()

      if (insertError) {
        console.error('❌ useOpeningHours - Erreur insertion:', insertError)
        throw insertError
      }

      console.log('✅ useOpeningHours - Horaires insérés:', insertData)
      console.log('✅ useOpeningHours - Sauvegarde terminée avec succès')

    } catch (err) {
      console.error('❌ useOpeningHours - Erreur lors de la sauvegarde:', err)
      error.value = 'Erreur lors de la sauvegarde des horaires'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Utilitaires pour les presets
  const applyBusinessHoursPreset = () => {
    const preset: WeeklyOpeningHours = {
      monday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
      friday: { isOpen: true, openTime: '09:00', closeTime: '18:00', timeSlots: ['09:00-18:00'] },
      saturday: { isOpen: false, openTime: '10:00', closeTime: '17:00', timeSlots: [] },
      sunday: { isOpen: false, openTime: '10:00', closeTime: '17:00', timeSlots: [] }
    }
    openingHours.value = preset
  }

  const applyRetailHoursPreset = () => {
    const preset: WeeklyOpeningHours = {
      monday: { isOpen: true, openTime: '10:00', closeTime: '19:00', timeSlots: ['10:00-19:00'] },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '19:00', timeSlots: ['10:00-19:00'] },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '19:00', timeSlots: ['10:00-19:00'] },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '19:00', timeSlots: ['10:00-19:00'] },
      friday: { isOpen: true, openTime: '10:00', closeTime: '19:00', timeSlots: ['10:00-19:00'] },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '19:00', timeSlots: ['10:00-19:00'] },
      sunday: { isOpen: true, openTime: '14:00', closeTime: '18:00', timeSlots: ['14:00-18:00'] }
    }
    openingHours.value = preset
  }

  const applyRestaurantHoursPreset = () => {
    const preset: WeeklyOpeningHours = {
      monday: { isOpen: false, openTime: '12:00', closeTime: '22:00', timeSlots: [] },
      tuesday: { isOpen: true, openTime: '12:00', closeTime: '22:00', timeSlots: ['12:00-22:00'] },
      wednesday: { isOpen: true, openTime: '12:00', closeTime: '22:00', timeSlots: ['12:00-22:00'] },
      thursday: { isOpen: true, openTime: '12:00', closeTime: '22:00', timeSlots: ['12:00-22:00'] },
      friday: { isOpen: true, openTime: '12:00', closeTime: '22:00', timeSlots: ['12:00-22:00'] },
      saturday: { isOpen: true, openTime: '12:00', closeTime: '22:00', timeSlots: ['12:00-22:00'] },
      sunday: { isOpen: true, openTime: '12:00', closeTime: '22:00', timeSlots: ['12:00-22:00'] }
    }
    openingHours.value = preset
  }

  // Synchroniser les timeSlots avec openTime/closeTime
  const syncTimeSlots = (dayKey: keyof WeeklyOpeningHours) => {
    const day = openingHours.value[dayKey]
    if (day.isOpen && day.openTime && day.closeTime) {
      day.timeSlots = [`${day.openTime}-${day.closeTime}`]
    } else {
      day.timeSlots = []
    }
  }

  // Copier les horaires d'un jour à tous les autres
  const copyDayToAll = (sourceDay: keyof WeeklyOpeningHours) => {
    const sourceHours = openingHours.value[sourceDay]
    const newHours = { ...openingHours.value }
    
    Object.keys(newHours).forEach(day => {
      if (day !== sourceDay) {
        newHours[day as keyof WeeklyOpeningHours] = { ...sourceHours }
      }
    })
    
    openingHours.value = newHours
  }

  // Vérifier si l'entreprise est ouverte maintenant
  const isOpenNow = () => {
    const now = new Date()
    const currentDay = now.getDay() // 0 = dimanche, 1 = lundi, etc.
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM
    
    const dayKey = REVERSE_DAY_MAPPING[currentDay as keyof typeof REVERSE_DAY_MAPPING]
    if (!dayKey) return false
    
    const dayHours = openingHours.value[dayKey as keyof WeeklyOpeningHours]
    if (!dayHours.isOpen) return false
    
    return currentTime >= dayHours.openTime && currentTime <= dayHours.closeTime
  }

  // Obtenir le prochain créneau d'ouverture
  const getNextOpeningTime = () => {
    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.toTimeString().slice(0, 5)
    
    // Vérifier les 7 prochains jours
    for (let i = 0; i < 7; i++) {
      const checkDay = (currentDay + i) % 7
      const dayKey = REVERSE_DAY_MAPPING[checkDay as keyof typeof REVERSE_DAY_MAPPING]
      
      if (dayKey) {
        const dayHours = openingHours.value[dayKey as keyof WeeklyOpeningHours]
        
        if (dayHours.isOpen) {
          // Si c'est aujourd'hui, vérifier si on n'est pas encore fermé
          if (i === 0 && currentTime <= dayHours.closeTime) {
            return {
              day: dayKey,
              time: dayHours.openTime,
              isToday: currentTime <= dayHours.openTime
            }
          } else if (i > 0) {
            return {
              day: dayKey,
              time: dayHours.openTime,
              isToday: false
            }
          }
        }
      }
    }
    
    return null
  }

  return {
    openingHours,
    loading: readonly(loading),
    error: readonly(error),
    loadOpeningHours,
    saveOpeningHours,
    applyBusinessHoursPreset,
    applyRetailHoursPreset,
    applyRestaurantHoursPreset,
    syncTimeSlots,
    copyDayToAll,
    isOpenNow,
    getNextOpeningTime
  }
}
