# Guide de test de l'intégration Stripe

## 1. Installation et configuration Stripe CLI

```bash
# Installer Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Se connecter à votre compte Stripe
stripe login

# Vérifier la connexion
stripe config --list
```

## 2. Créer les produits et prix dans Stripe Dashboard

### Plan Basic (19,99€/mois)
1. Aller dans Products → Create product
2. Nom: "Plan Basic Booly"
3. Prix: 19,99€ récurrent mensuel
4. Copier le price_id généré (ex: price_1ABC...)

### Plan Premium (29,99€/mois)
1. Créer un nouveau produit
2. Nom: "Plan Premium Booly"
3. Prix: 29,99€ récurrent mensuel
4. Copier le price_id généré

## 3. Mettre à jour les variables d'environnement

```bash
# Dans votre fichier .env
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
STRIPE_PRICE_BASIC=price_votre_price_id_basic
STRIPE_PRICE_PREMIUM=price_votre_price_id_premium
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Tester localement avec Stripe CLI

### Terminal 1: Démarrer votre app Nuxt
```bash
cd /Users/boulicaut/booly/nuxt-app
npm run dev
```

### Terminal 2: Écouter les webhooks
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copier le webhook secret affiché (whsec_...)
```

### Terminal 3: Tester les événements
```bash
# Simuler un paiement réussi
stripe trigger checkout.session.completed

# Simuler une mise à jour d'abonnement
stripe trigger customer.subscription.updated

# Simuler une annulation d'abonnement
stripe trigger customer.subscription.deleted
```

## 5. Test du parcours complet

1. **Aller sur** http://localhost:3000 
2. **Se connecter** avec un compte utilisateur
3. **Aller sur la page pricing** (ou composant ProPricingSection)
4. **Cliquer sur "Choisir Basic" ou "Choisir Premium"**
5. **Compléter le paiement** sur Stripe Checkout (utiliser 4242 4242 4242 4242)
6. **Vérifier la redirection** vers `/pro/dashboard?success=true`
7. **Vérifier dans Supabase** que l'abonnement est créé dans la table `subscriptions`

## 6. Vérifications à faire

### Dans Supabase
- [ ] Table `subscriptions` contient le nouvel abonnement
- [ ] `user_id` correspond à l'utilisateur connecté
- [ ] `status` = 'active'
- [ ] `plan_type` = 'basic' ou 'premium'
- [ ] `current_period_end` est correctement défini

### Dans l'application
- [ ] Redirection vers `/pro/dashboard` après paiement
- [ ] Middleware `subscription` protège les routes pro
- [ ] `useSubscription().hasActiveSubscription` retourne `true`
- [ ] Page de succès affiche les bonnes informations

## 7. Débuggage

### Logs à surveiller
```bash
# Logs du webhook
tail -f logs/webhook.log

# Logs Nuxt
npm run dev -- --verbose

# Logs Stripe CLI
stripe logs tail
```

### Erreurs communes
- **Webhook secret incorrect** : Vérifier la variable `STRIPE_WEBHOOK_SECRET`
- **Price ID incorrect** : Vérifier les variables `STRIPE_PRICE_BASIC/PREMIUM`
- **RLS Supabase** : Vérifier que les règles RLS sont correctes
- **Middleware** : Vérifier que l'utilisateur a un abonnement actif

## 8. Test en production

1. **Remplacer les clés test par les clés live**
2. **Configurer le webhook en production** dans Stripe Dashboard
3. **Tester avec de vrais paiements** (petits montants)
4. **Surveiller les logs** pour détecter les erreurs
