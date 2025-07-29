import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { getHeader, readRawBody } from 'h3'

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
    const rawBody = await readRawBody(event)
    const signature = getHeader(event, 'stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
    if (!signature || !webhookSecret) {
      console.error('❌ Signature ou secret manquant')
      return { statusCode: 400, body: 'Bad request' }
    }
  
    let stripeEvent: Stripe.Event
  
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody!.toString(),
        signature,
        webhookSecret
      )
      console.log(`✅ Webhook reçu : ${stripeEvent.type}`)
    } catch (err: any) {
      console.error('❌ Erreur signature Stripe :', err.message)
      return { statusCode: 400, body: `Webhook Error: ${err.message}` }
    }
  
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔐 Important
      )
  
    try {
      if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string
        const userId = session.client_reference_id
  
        console.log('🧾 checkout.session.completed')
        console.log('🔗 Subscription ID:', subscriptionId)
        console.log('👤 Customer ID:', customerId)
        console.log('🙋‍♂️ User ID (client_reference_id):', userId)
  
        if (!userId) throw new Error('client_reference_id manquant.')
  
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single()
  
        if (profileError || !profile) {
          console.error('❌ Utilisateur non trouvé dans Supabase:', profileError)
          throw new Error('Utilisateur non trouvé.')
        }
  
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
        console.log('📦 Subscription récupérée depuis Stripe:', {
          status: subscription.status,
          current_period_end: subscription.items.data[0].current_period_end,
        })
  
        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: profile.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            plan_type: 'premium',
            status: subscription.status,
            current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
          })
  
        if (upsertError) {
          console.error('❌ Erreur upsert Supabase:', upsertError)
          throw new Error('Erreur upsert Supabase')
        }
  
        console.log('✅ Subscription enregistrée avec succès')
      }
  
      else if (stripeEvent.type === 'customer.subscription.updated') {
        const subscription = stripeEvent.data.object as Stripe.Subscription
  
        console.log('🔄 customer.subscription.updated:', {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.items.data[0].current_period_end
        })
  
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
  
        if (updateError) {
          console.error('❌ Erreur update abonnement Supabase:', updateError)
          throw new Error('Erreur update abonnement Supabase')
        }
  
        console.log('✅ Abonnement mis à jour avec succès')
      }
  
      else if (stripeEvent.type === 'customer.subscription.deleted') {
        const subscription = stripeEvent.data.object as Stripe.Subscription
  
        console.log('🗑️ customer.subscription.deleted:', {
          id: subscription.id,
          current_period_end: subscription.items.data[0].current_period_end
        })
  
        const { data, error: fetchError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
  
        if (fetchError || !data) {
          console.error('❌ Abonnement non trouvé dans Supabase:', fetchError)
          throw new Error('Abonnement non trouvé')
        }
  
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
  
        if (updateError) {
          console.error('❌ Erreur update statut abonnement:', updateError)
          throw new Error('Erreur update statut abonnement')
        }
  
        console.log('✅ Abonnement annulé avec succès')
      }
  
      return { statusCode: 200, body: 'Webhook traité avec succès' }
    } catch (e: any) {
      console.error('💥 Erreur traitement Stripe Webhook:', e.message)
      return { statusCode: 500, body: e.message }
    }
  })