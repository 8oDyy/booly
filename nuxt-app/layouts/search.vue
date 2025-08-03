<template>
  <div>
    <AppHeader />
    
    <UDashboardPage>
      <UDashboardPanel grow>
        <UDashboardNavbar title="Recherche de restaurants">
          <template #right>
            <UDashboardSearchButton />
          </template>
        </UDashboardNavbar>
        
        <slot />
      </UDashboardPanel>
    </UDashboardPage>
    
    <AppFooter />
  </div>
</template>

<script setup>
// Layout pour les pages de recherche
</script>