export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  // Vérifier d'abord si l'utilisateur est connecté
  if (!user.value) {
    return navigateTo('/?login=true')
  }

  try {
    // Vérifier si l'utilisateur possède au moins un établissement
    const { data: businesses, error } = await client
      .from('businesses')
      .select('id')
      .eq('owner_id', user.value.id)
      .limit(1)

    if (error) {
      console.error('Erreur lors de la vérification du statut pro:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la vérification des permissions'
      })
    }

    // Si l'utilisateur n'a pas d'établissement, il n'est pas pro
    if (!businesses || businesses.length === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès réservé aux professionnels. Vous devez posséder au moins un établissement pour accéder à cette page.'
      })
    }

    // L'utilisateur est bien un professionnel, continuer
  } catch (err: any) {
    // Si c'est déjà une erreur HTTP, la relancer
    if (err.statusCode) {
      throw err
    }
    
    // Sinon, créer une erreur générique
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la vérification des permissions'
    })
  }
})
