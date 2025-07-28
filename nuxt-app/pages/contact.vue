<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold text-blue-700 font-roboto">Contactez-nous</h1>
      </template>
      <div class="space-y-6">
        <p class="text-gray-700">Vous avez une question ou une suggestion ? N'hésitez pas à nous contacter en utilisant le formulaire ci-dessous.</p>
        
        <UForm :state="formState" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Nom" name="name">
            <UInput v-model="formState.name" placeholder="Votre nom" />
          </UFormGroup>
          
          <UFormGroup label="Email" name="email">
            <UInput v-model="formState.email" type="email" placeholder="Votre adresse email" />
          </UFormGroup>
          
          <UFormGroup label="Sujet" name="subject">
            <USelect v-model="formState.subject" :options="subjectOptions" placeholder="Sélectionnez un sujet" />
          </UFormGroup>
          
          <UFormGroup label="Message" name="message">
            <UTextarea v-model="formState.message" placeholder="Votre message" rows="5" />
          </UFormGroup>
          
          <div class="flex justify-end">
            <UButton type="submit" color="primary">
              Envoyer
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
const toast = useToast()

const formState = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const subjectOptions = [
  { label: 'Question générale', value: 'general' },
  { label: 'Support technique', value: 'technical' },
  { label: 'Partenariat', value: 'partnership' },
  { label: 'Signaler un problème', value: 'issue' },
  { label: 'Autre', value: 'other' }
]

const onSubmit = () => {
  // Simulate form submission
  toast.add({
    title: 'Message envoyé',
    description: 'Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.',
    color: 'success'
  })
  
  // Reset form
  formState.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>
