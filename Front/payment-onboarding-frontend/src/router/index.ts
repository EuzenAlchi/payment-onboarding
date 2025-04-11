import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ResultadoView from '../views/checkout/ResultadoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/checkout/PaymentView.vue'), // 👈 Aquí conectamos tu vista
    },
    {
      path: '/resultado',
      name: 'resultado',
      component: ResultadoView,
    }
  ],
});

export default router;