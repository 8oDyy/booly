import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Initialiser Supabase avec les clés serveur
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createTestData() {
  try {
    console.log('🏗️  Création des données de test...')

    // 1. Créer un établissement de test
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        name: 'Restaurant Test',
        description: 'Un restaurant de test pour valider le système d\'avis',
        address: '123 Rue de Test',
        city: 'Paris',
        average_rating: 4.2,
        review_count: 15
      })
      .select()
      .single()

    if (businessError) {
      console.error('❌ Erreur lors de la création de l\'établissement:', businessError)
      return
    }

    console.log('✅ Établissement créé:', business.name, '(ID:', business.id, ')')

    // 2. Créer un scan_tag de test
    const testScanTagId = 'aa2692ad-bba5-467f-8644-911192fcd091'
    
    const { data: scanTag, error: scanTagError } = await supabase
      .from('scan_tags')
      .insert({
        id: testScanTagId,
        business_id: business.id,
        type: 'QR',
        code: `qr_${testScanTagId}`,
        status: 'active',
        label: 'QR Code Test - Caisse principale'
      })
      .select()
      .single()

    if (scanTagError) {
      console.error('❌ Erreur lors de la création du scan_tag:', scanTagError)
      return
    }

    console.log('✅ Scan tag créé:', scanTag.label, '(ID:', scanTag.id, ')')

    console.log('\n🎯 Données de test créées avec succès !')
    console.log(`📱 URL de test: http://localhost:3000/scan/${testScanTagId}`)
    console.log(`🏪 Établissement: ${business.name}`)
    console.log(`🔗 Scan tag: ${scanTag.label}`)

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Exécuter le script
createTestData()
