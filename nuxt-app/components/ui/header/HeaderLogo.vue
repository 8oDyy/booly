<template>
  <div class="header-logo">
    <NuxtLink to="/" class="logo-link">
      <img src="~/assets/logos/logo-checkly.svg" alt="Booly" class="logo-image" />
    </NuxtLink>
  </div>
</template>

<style scoped>
.header-logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

.logo-image {
  height: 2rem;
  width: auto;
}
</style>
