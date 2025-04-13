<template>
  <div class="products-container">
    <div class="table-container">
    <h2>Catálogo de Productos</h2>

    <div v-if="loading" class="loading-message">🔄 Cargando productos, por favor espera...</div>

    <div v-else>
      <!-- Productos en formato tabla para escritorio y lista para móvil -->
      <div class="product-card" v-for="product in products" :key="product.id">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p><strong>Precio:</strong> ${{ product.price.toLocaleString() }}</p>
          <p><strong>Stock:</strong> {{ product.stock }}</p>
        </div>
        <div class="product-actions">
          <input class="input"
            type="number"
            min="1"
            :max="product.stock"
            v-model.number="quantities[product.id]"
            placeholder="Cantidad"
            :disabled="getCurrentQuantity(product) >= product.stock"
          />
          <button class="button"
            :disabled="!product.available || quantities[product.id] < 1"
            @click="addToCart(product)"
          >
            Añadir al carrito
          </button>
        </div>
      </div>

      <!-- Carrito -->
      <div class="cart" v-if="cart.length">
        <h2>Carrito</h2>
        <ul>
          <li v-for="item in cart" :key="item.product.id">
            {{ item.product.name }} - {{ item.quantity }} unidad(es) - Total: ${{ (item.product.price * item.quantity).toLocaleString() }}
            <button class="button" @click="removeFromCart(item.product.id)">❌</button>
          </li>
        </ul>
        <p><strong>Total a pagar:</strong> ${{ total.toLocaleString() }}</p>
        <router-link :to="{ name: 'payment', query: { amount: total * 100 } }">
          <button class="button">Pagar</button>
        </router-link>
      </div>
    </div>
  </div>
</div> <!-- cierre de .products-container -->
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import api from '@/services/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  available: boolean
}

const products = ref<Product[]>([])
const cart = ref<{ product: Product; quantity: number }[]>([])
const quantities = ref<Record<number, number>>({})
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  let intentos = 0
  const maxIntentos = 10
  const esperaEntreIntentos = 6000

  while (intentos < maxIntentos) {
    try {
      const res = await api.get<Product[]>('/products')
      products.value = res.data
      break
    } catch (error) {
      intentos++
      console.warn(`🔁 Intento ${intentos} fallido para cargar productos`)
      if (intentos === maxIntentos) {
        alert('❌ No se pudo conectar con el servidor. Intenta más tarde.')
      } else {
        await new Promise(resolve => setTimeout(resolve, esperaEntreIntentos))
      }
    } finally {
      loading.value = false
    }
  }
})

function addToCart(product: Product) {
  const quantityToAdd = quantities.value[product.id] || 0
  const existing = cart.value.find(item => item.product.id === product.id)
  const currentQuantityInCart = existing ? existing.quantity : 0
  const newTotalQuantity = currentQuantityInCart + quantityToAdd

  if (quantityToAdd > 0 && newTotalQuantity <= product.stock) {
    if (existing) {
      existing.quantity = newTotalQuantity
    } else {
      cart.value.push({ product, quantity: quantityToAdd })
    }
    quantities.value[product.id] = 1
  } else {
    alert(`⚠️ Solo hay ${product.stock} unidad(es) disponibles en stock.`)
  }
}

function removeFromCart(productId: number) {
  cart.value = cart.value.filter(item => item.product.id !== productId)
}

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
)

function getCurrentQuantity(product: Product): number {
  const item = cart.value.find(i => i.product.id === product.id)
  return item ? item.quantity : 0
}
</script>

<style scoped>
.products-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #42b983;
  margin-bottom: 1rem;
}

.product-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  background-color: #f9f9f9;
  flex-wrap: wrap;
}

.product-info {
  flex: 2;
}

.product-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: flex-start;
}

.product-actions input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.product-actions button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.product-actions button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cart {
  margin-top: 2rem;
  border-top: 2px solid #42b983;
  padding-top: 1rem;
}

.cart ul {
  list-style-type: none;
  padding: 0;
}

.cart ul li {
  margin: 0.5rem 0;
}

.cart button {
  background-color: red;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  margin-left: 1rem;
  border-radius: 5px;
}

.cart button:hover {
  background-color: #e74c3c;
}

.cart p {
  font-size: 1.2rem;
  font-weight: bold;
}

.router-link {
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .product-card {
    flex-direction: column;
  }

  .product-actions input {
    width: 100%;
  }

  .product-actions {
    align-items: stretch;
  }
}
</style>