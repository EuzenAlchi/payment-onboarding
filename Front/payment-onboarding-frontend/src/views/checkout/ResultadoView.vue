<template>
  <div class="resultado-container">
    <h2>Resultado del Pago</h2>

    <div v-if="loading" class="estado estado-cargando">
      🔄 Consultando estado de tu transacción...
    </div>

    <div v-else-if="status" class="estado">
      <p><strong>Estado:</strong> <span :class="statusClass">{{ status }}</span></p>
      <p><strong>Referencia:</strong> {{ reference }}</p>
      <p><strong>Email:</strong> {{ customerEmail }}</p>
      <p><strong>Monto:</strong> ${{ amountInPesos }}</p>
      <p><strong>Fecha:</strong> {{ createdAt }}</p>
    </div>

    <div v-else class="estado estado-error">
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
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  background-color: #1a1a1a;
  color: #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.estado {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #f0f0f0;
}

.estado-cargando {
  color: #42b983;
}

.estado-error {
  color: #d9534f;
}

.aprobado {
  color: #4fc08d;
  font-weight: bold;
}

.rechazado {
  color: #ff4c4c;
  font-weight: bold;
}

.pendiente {
  color: #ffa500;
  font-weight: bold;
}

@media (max-width: 600px) {
  .resultado-container {
    padding: 1rem;
    margin: 1rem;
  }

  .estado {
    font-size: 1rem;
    line-height: 1.5;
  }

  h2 {
    font-size: 1.4rem;
  }
}
</style>