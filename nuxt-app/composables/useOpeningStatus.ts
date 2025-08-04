export const getOpeningStatus = (openingHours: {
    day_of_week: number
    opening_times: string[]
  }[]) => {
    const now = new Date()
    const currentDay = (now.getDay() + 6) % 7 // JS: 0 = dimanche, donc on décale pour Lundi=0
    const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"
  
    const todayHours = openingHours.find(h => h.day_of_week === currentDay)
    const allHours = Object.fromEntries(openingHours.map(h => [h.day_of_week, h.opening_times]))
  
    const isOpenNow = todayHours?.opening_times?.some((range) => {
      const [start, end] = range.split('-')
      return currentTime >= start && currentTime <= end
    })
  
    if (isOpenNow) {
      const nextClosing = todayHours?.opening_times
        .map(r => r.split('-')[1])
        .find(end => currentTime < end)
      
      return {
        open: true,
        message: nextClosing ? `Ferme à ${nextClosing}` : ''
      }
    } else {
      // Cherche le prochain créneau d'ouverture
      for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDay + i) % 7
        const slots = allHours[dayIndex]
        if (slots?.length) {
          const firstSlot = slots[0].split('-')[0]
          const label = i === 0 ? `Ouvre à ${firstSlot}` : `Ouvre ${['demain', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche', 'lundi'][(currentDay + i) % 7]} à ${firstSlot}`
          return { open: false, message: label }
        }
      }
    }
  
    return { open: false, message: "Fermé toute la semaine" }
  }
  