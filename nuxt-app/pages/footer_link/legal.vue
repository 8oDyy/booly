<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold text-blue-700 font-roboto">Mentions légales</h1>
      </template>
      <div class="prose max-w-none">
        <p class="text-gray-500 mb-6">Dernière mise à jour : {{ new Date().toLocaleDateString() }}</p>
        
        <h2>Éditeur du site</h2>
        <p>
          <strong>Booly SAS</strong><br>
          Société par actions simplifiée au capital de 10 000 €<br>
          Siège social : 123 Avenue de la République, 75011 Paris<br>
          RCS Paris B 123 456 789<br>
          N° TVA : FR 12 345 678 901<br>
          Directeur de la publication : Jean Dupont
        </p>
        
        <h2>Hébergement</h2>
        <p>
          <strong>Hébergeur SAS</strong><br>
          Société par actions simplifiée au capital de 100 000 €<br>
          Siège social : 456 Rue du Web, 69000 Lyon<br>
          Téléphone : +33 4 56 78 90 12
        </p>
        
        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
        
        <h2>Données personnelles</h2>
        <p>Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données vous concernant. Pour exercer ce droit, veuillez nous contacter via notre <NuxtLink to="/contact" class="text-blue-600 hover:underline">formulaire de contact</NuxtLink>.</p>
        
        <h2>Cookies</h2>
        <p>Notre site utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur ce site, vous acceptez l'utilisation de cookies conformément à notre <NuxtLink to="/privacy" class="text-blue-600 hover:underline">politique de confidentialité</NuxtLink>.</p>
        
        <h2>Loi applicable et juridiction</h2>
        <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
      </div>
    </UCard>
  </UContainer>
</template>
