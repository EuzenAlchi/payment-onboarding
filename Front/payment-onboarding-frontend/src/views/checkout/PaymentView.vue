<template>
    <div class="payment-form">
      <h2>Formulario de Pago</h2>
      <form @submit.prevent="submitForm">
        <input v-model="form.customer_email" type="email" placeholder="Correo electrónico (ej: cliente@correo.com)" required />
  
        <input v-model="form.phone_number" type="text" placeholder="Teléfono (ej: 573001234567)" required />
  
        <input v-model="form.full_name" type="text" placeholder="Nombre completo" required />
  
        <select v-model="form.legal_id_type" required>
          <option disabled value="">Tipo de documento</option>
          <option>CC</option>
          <option>CE</option>
          <option>Pasaporte</option>
        </select>
  
        <input v-model="form.legal_id" type="text" placeholder="Número de documento" required />
  
        <input v-model="form.card_number" type="text" placeholder="Número de tarjeta (4242...)" required />
        <input v-model="form.exp_month" type="text" placeholder="Mes de expiración (ej: 12)" required />
        <input v-model="form.exp_year" type="text" placeholder="Año de expiración (ej: 29)" required />
        <input v-model="form.cvc" type="text" placeholder="CVC (ej: 123)" required />
        <input v-model="form.card_holder" type="text" placeholder="Nombre del titular" required />
  
        <input v-model.number="form.amount_in_cents" type="number" placeholder="Monto en centavos (ej: 300000)" required />
  
        <input v-model="form.redirect_url" type="text" placeholder="URL de redirección (ej: https://mitienda.com.co/pago/resultado)" required />
  
        <!-- reference se genera automáticamente -->
        <input type="hidden" v-model="form.reference" />
  
        <button type="submit" :disabled="loading">
          {{ loading ? 'Procesando...' : 'Pagar' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'
  
  const loading = ref(false)
  
  const form = ref({
    customer_email: '',
    phone_number: '',
    full_name: '',
    legal_id: '',
    legal_id_type: '',
    card_number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    card_holder: '',
    amount_in_cents: 300000,
    currency: 'COP',
    payment_method_type: 'CARD',
    redirect_url: '',
    reference: '', // Se genera automáticamente
  })
  
  // Función para generar una referencia aleatoria
  function generateReference() {
    return 'REF_' + Math.random().toString(36).substring(2, 12).toUpperCase()
  }
  
  async function submitForm() {
    try {
      loading.value = true
      form.value.reference = generateReference()
      console.log('📦 Payload a enviar:', form.value)
  
      const payload = {
        amount_in_cents: form.value.amount_in_cents,
        currency: form.value.currency,
        customer_email: form.value.customer_email,
        reference: form.value.reference,
        redirect_url: form.value.redirect_url,
        payment_method_type: form.value.payment_method_type,
        card_data: {
          number: form.value.card_number,
          exp_month: form.value.exp_month,
          exp_year: form.value.exp_year,
          cvc: form.value.cvc,
          card_holder: form.value.card_holder,
        },
        customer_data: {
          phone_number: form.value.phone_number,
          full_name: form.value.full_name,
          legal_id: form.value.legal_id,
          legal_id_type: form.value.legal_id_type,
        },
      }
  
      const res = await axios.post('http://localhost:3000/wompi/transaction', payload)
      console.log('✅ Transacción creada:', res.data)
  
      // Redirigir al checkout de Wompi si existe
      if (res.data && res.data.data && res.data.data.checkout_url) {
        window.location.href = res.data.data.checkout_url
      } else {
        alert('La transacción fue creada, pero no se recibió la URL de redirección.')
      }
    } catch (error: any) {
      console.error('❌ Error al crear transacción:', error)
      alert('Ocurrió un error al procesar el pago. Revisa la consola para más detalles.')
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .payment-form {
    max-width: 500px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  input,
  select {
    padding: 0.5rem;
    font-size: 1rem;
  }
  
  button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button[disabled] {
    background-color: #ccc;
  }
  </style>
  