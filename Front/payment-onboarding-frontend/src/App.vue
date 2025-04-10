<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header class="header">
      <h1>Payment Onboarding</h1>
      <nav>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/checkout">Checkout</RouterLink>
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
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav a {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.main-content {
  padding: 2rem;
}
</style>
