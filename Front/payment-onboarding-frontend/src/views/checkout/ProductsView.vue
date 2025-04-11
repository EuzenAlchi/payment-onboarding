<template>
    <div class="products-container">
        <h2>Catálogo de Productos</h2>

        <!-- Tabla de productos -->
        <table class="product-table">
        <thead>
            <tr>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>${{ product.price.toLocaleString() }}</td>
            <td>{{ product.stock }}</td>
            <td>
                <input
                    type="number"
                    min="1"
                    :max="product.stock"
                    v-model.number="quantities[product.id]"
                    placeholder="Cantidad"
                    :disabled="getCurrentQuantity(product) >= product.stock"
                />

                <button
                :disabled="!product.available || quantities[product.id] < 1"
                @click="addToCart(product)"
                >
                Añadir al carrito
                </button>
            </td>
            </tr>
        </tbody>
        </table>

        <!-- Carrito -->
        <div class="cart" v-if="cart.length">
        <h2>Carrito</h2>
        <ul>
            <li v-for="item in cart" :key="item.product.id">
            {{ item.product.name }} - {{ item.quantity }} unidad(es) - Total: ${{ (item.product.price * item.quantity).toLocaleString() }}
            <button @click="removeFromCart(item.product.id)">❌</button>
            </li>
        </ul>
        <p><strong>Total a pagar:</strong> ${{ total.toLocaleString() }}</p>
        <router-link :to="{ name: 'payment', query: { amount: total * 100 } }">
            <button>Pagar</button>
        </router-link>
        </div>
    </div>
</template>
  
  
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'

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

onMounted(async () => {
    const res = await axios.get<Product[]>('http://localhost:3000/products')
    products.value = res.data
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
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.product-table th,
.product-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.product-table th {
  background-color: var(--vt-c-indigo);
  color: var(--vt-c-white);
}

.product-table td {
  background-color: var(--color-background-soft);
}

.product-table tr:nth-child(even) td {
  background-color: var(--color-background-mute);
}

.product-table input {
  width: 60px;
  margin: 0.5rem 0;
}

.product-table button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.product-table button:hover {
  background-color: #2c9a58;
}

.product-table button:disabled {
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

.cart button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.router-link {
  margin-top: 1rem;
}

</style>
  