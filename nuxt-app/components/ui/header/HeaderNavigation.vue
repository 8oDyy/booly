<template>
  <nav class="header-nav">
    <NuxtLink 
      to="/search" 
      class="nav-link" 
      :class="{ 'nav-link-active': $route.path.startsWith('/search') }"
    >
      Rechercher
    </NuxtLink>
    <NuxtLink 
      to="/pro" 
      class="nav-link nav-link-pro" 
      :class="{ 'nav-link-active': $route.path.startsWith('/pro') }"
    >
      Booly Pro
    </NuxtLink>
  </nav>
</template>

<style scoped>
.header-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link-active {
  color: #2563eb;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563eb;
  border-radius: 1px;
}

.nav-link-pro {
  color: #d97706;
  font-weight: 600;
}

.nav-link-pro:hover {
  color: #b45309;
}

.nav-link-pro.nav-link-active {
  color: #d97706;
}

.nav-link-pro.nav-link-active::after {
  background: #d97706;
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
}
</style>
