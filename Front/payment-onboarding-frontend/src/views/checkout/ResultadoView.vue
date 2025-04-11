<template>
    <div class="resultado-container">
      <h2>Resultado del Pago</h2>
  
      <div v-if="loading">Consultando estado de tu transacción...</div>
  
      <div v-else-if="status">
        <p><strong>Estado:</strong> <span :class="statusClass">{{ status }}</span></p>
        <p><strong>Referencia:</strong> {{ reference }}</p>
        <p><strong>Email:</strong> {{ customerEmail }}</p>
        <p><strong>Monto:</strong> ${{ amountInPesos }}</p>
        <p><strong>Fecha:</strong> {{ createdAt }}</p>
      </div>
  
      <div v-else>
        <p>❌ No se pudo obtener el estado de la transacción.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/services/api' 
  
  const route = useRoute()
  const reference = ref<string | null>(null)
  const status = ref<string | null>(null)
  const customerEmail = ref<string | null>(null)
  const amountInPesos = ref<number | null>(null)
  const createdAt = ref<string | null>(null)
  const loading = ref(true)
  
  const statusClass = computed(() => {
    if (status.value === 'APPROVED') return 'aprobado'
    if (status.value === 'DECLINED') return 'rechazado'
    if (status.value === 'PENDING') return 'pendiente'
    return ''
  })
  
  onMounted(async () => {
    reference.value = route.query.reference as string
    console.log('🟡 Referencia recibida desde la URL:', reference.value)
  
    if (!reference.value) {
      loading.value = false
      return
    }
  
    try {
      const res = await api.get(`/wompi/transaction-by-reference/${reference.value}`)
      console.log('✅ Respuesta recibida:', res.data)
  
      const data = res.data
      if (data) {
        status.value = data.status
        customerEmail.value = data.customer_email
        amountInPesos.value = data.amount_in_cents / 100
        createdAt.value = new Date(data.created_at).toLocaleString()
      } else {
        console.warn('⚠️ No se recibió data en la respuesta:', res.data)
      }
    } catch (err) {
      console.error('❌ Error al consultar estado:', err)
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .resultado-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1rem;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .aprobado {
    color: green;
  }
  
  .rechazado {
    color: red;
  }
  
  .pendiente {
    color: orange;
  }
  </style>
  