import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ResultadoView from '../views/checkout/ResultadoView.vue'
import ProductsView from '../views/checkout/ProductsView.vue'
import PaymentView from '../views/checkout/PaymentView.vue'

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
      component: ProductsView,
    },
    {
      path: '/resultado',
      name: 'resultado',
      component: ResultadoView,
    },
    {
      path: '/payment',
      name: 'payment',
      component: PaymentView
    }
    
  ],
});

export default router;