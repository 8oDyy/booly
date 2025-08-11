export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
  if (!user.value) {
    return navigateTo('/?login=true')
  }
})
