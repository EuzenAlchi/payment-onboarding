<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header class="header">
      <h1>Payment Onboarding</h1>
      <nav>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/checkout">Products</RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.header {
  background-color: #35495e;
  color: white;
  padding: 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border-radius: 5px;
  white-space: nowrap;
  text-align: center;
  flex: 1 1 auto;
}

nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
  padding: 2rem;
}

/* En pantallas grandes, organizar header horizontalmente */
@media (min-width: 768px) {
  .header {
    flex-direction: row;
    justify-content: space-between;
  }

  .header h1 {
    margin-bottom: 0;
  }

  nav {
    width: auto;
    justify-content: flex-end;
  }

  nav a {
    flex: unset;
  }
}
</style>