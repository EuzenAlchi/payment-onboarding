<template>
    <div class="payment-form">
        <h2>Formulario de Pago</h2>
        <form @submit.prevent="submitForm">
        <div class="form-group">
            <label>Correo electrónico</label>
            <input v-model="form.customer_email" type="email" placeholder="cliente@correo.com" required />
        </div>

        <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.phone_number" type="text" placeholder="3001234567" required />
        </div>

        <div class="form-group">
            <label>Nombre completo</label>
            <input v-model="form.full_name" type="text" placeholder="Nombre completo" required />
        </div>

        <div class="form-row">
            <div class="form-group half">
            <label>Tipo de documento</label>
            <select v-model="form.legal_id_type" required>
                <option disabled value="">Selecciona</option>
                <option>CC</option>
                <option>CE</option>
                <option>Pasaporte</option>
            </select>
            </div>

            <div class="form-group half">
            <label>Número de documento</label>
            <input v-model="form.legal_id" type="text" required />
            </div>
        </div>

        <hr />

        <div class="form-row">
            <div class="form-group">
            <label>Número de tarjeta</label>
            <input v-model="form.card_number" type="text" placeholder="4242 4242 4242 4242" required />
            </div>
        </div>

        <div class="form-row">
            <div class="form-group third">
            <label>Mes expiración</label>
            <input v-model="form.exp_month" type="text" placeholder="MM" required />
            </div>

            <div class="form-group third">
            <label>Año expiración</label>
            <input v-model="form.exp_year" type="text" placeholder="YY" required />
            </div>

            <div class="form-group third">
            <label>CVC</label>
            <input v-model="form.cvc" type="text" placeholder="123" required />
            </div>
        </div>

        <div class="form-group">
            <label>Nombre del titular</label>
            <input v-model="form.card_holder" type="text" required />
        </div>

        <div class="form-group">
            <label>Monto a pagar</label>
            <p class="amount"><strong>${{ form.amount_in_cents / 100 }}</strong> COP</p>
        </div>

        <input type="hidden" v-model="form.reference" />

        <button type="submit" :disabled="loading">
            {{ loading ? 'Procesando...' : 'Pagar' }}
        </button>
        </form>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import api from '@/services/api' 

const loading = ref(false)
const route = useRoute()

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
    amount_in_cents: 0, // Se recibe automáticamente desde query
    currency: 'COP',
    payment_method_type: 'CARD',
    redirect_url: `${window.location.origin}/resultado`,
    reference: '',
})

onMounted(() => {
    const queryAmount = parseInt(route.query.amount as string)
    if (!isNaN(queryAmount) && queryAmount > 0) {
        form.value.amount_in_cents = queryAmount
    }
})

function generateReference() {
    return 'REF_' + Math.random().toString(36).substring(2, 12).toUpperCase()
}

function validarCampos() {
    const errores: string[] = []

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.customer_email)) {
        errores.push('El correo electrónico no tiene un formato válido.')
    }

    const telefono = form.value.phone_number.replace(/\D/g, '')
    if (!/^3\d{9}$/.test(telefono)) {
        errores.push('El número de teléfono debe tener 10 dígitos y comenzar con 3 (ej: 3001234567).')
    }

    if (!form.value.full_name || form.value.full_name.length < 3) {
        errores.push('El nombre completo debe tener al menos 3 caracteres.')
    }

    const tiposPermitidos = ['CC', 'CE', 'Pasaporte']
    if (!tiposPermitidos.includes(form.value.legal_id_type)) {
        errores.push('Debes seleccionar un tipo de documento válido.')
    }

    if (!/^\d{6,}$/.test(form.value.legal_id)) {
        errores.push('El número de documento debe tener al menos 6 dígitos numéricos.')
    }

    const tarjeta = form.value.card_number.replace(/\s+/g, '')
    if (!/^\d{16}$/.test(tarjeta)) {
        errores.push('El número de tarjeta debe tener exactamente 16 dígitos.')
    }

    const mes = parseInt(form.value.exp_month)
    if (isNaN(mes) || mes < 1 || mes > 12) {
        errores.push('El mes de expiración debe estar entre 1 y 12.')
    }

    const añoActual = new Date().getFullYear() % 100
    const año = parseInt(form.value.exp_year)
    if (isNaN(año) || año < añoActual) {
        errores.push('El año de expiración debe ser igual o mayor al actual.')
    }

    if (!/^\d{3}$/.test(form.value.cvc)) {
        errores.push('El CVC debe tener exactamente 3 dígitos.')
    }

    if (!form.value.card_holder || form.value.card_holder.length < 2) {
        errores.push('El nombre del titular debe tener al menos 2 caracteres.')
    }

    if (!form.value.amount_in_cents || form.value.amount_in_cents <= 0) {
        errores.push('El monto debe ser mayor a 0.')
    }

    try {
        new URL(form.value.redirect_url)
    } catch (_) {
        errores.push('La URL de redirección no es válida.')
    }

    return errores
}

async function submitForm() {
    const errores = validarCampos()
    if (errores.length > 0) {
        alert('❌ Corrige los siguientes errores:\n\n' + errores.join('\n'))
        return
    }

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

        const res = await api.post('/wompi/transaction', payload)
        console.log('✅ Transacción creada:', res.data)

        if (res.data?.data?.id) {
        window.location.href = `${window.location.origin}/resultado?reference=${form.value.reference}`
        } else {
        alert('La transacción fue creada, pero no se recibió información válida de Wompi.')
        }
    } catch (error: any) {
        console.error('❌ Error al crear transacción:', error)
        alert('Ocurrió un error al procesar el pago. Revisa la consola para más detalles.')
    } finally {
        loading.value = false
    }
}
</script>
  
.payment-form {
    max-width: 600px;
    margin: 2rem auto;
    background-color: #1a1a1a;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
    color: #fff;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    font-weight: bold;
    margin-bottom: 0.25rem;
    color: #fff;
  }
  
  .form-group input,
  .form-group select {
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 5px;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    width: 100%;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .form-row .form-group.half {
    flex: 1 1 48%;
  }
  
  .form-row .form-group.third {
    flex: 1 1 30%;
  }
  
  .form-group input::placeholder {
    color: #bbb;
  }
  
  button {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 0.75rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
    width: 100%;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  
  .amount {
    background-color: #333;
    padding: 0.75rem;
    border-radius: 5px;
    color: #fff;
    text-align: center;
  }
  
  /* Responsive para móviles */
  @media (max-width: 600px) {
    .payment-form {
      padding: 1rem;
    }
  
    .form-row {
      flex-direction: column;
      gap: 0.75rem;
    }
  
    .form-row .form-group.half,
    .form-row .form-group.third {
      flex: 1 1 100%;
    }
  
    button {
      font-size: 1rem;
      padding: 0.75rem;
    }
  }  


<style scoped>
.payment-form {
  max-width: 600px;
  margin: 2rem auto;
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  color: #fff;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #fff;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-row .form-group.half {
  flex: 1 1 48%;
}

.form-row .form-group.third {
  flex: 1 1 30%;
}

.form-group input::placeholder {
  color: #bbb;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 1rem;
  width: 100%;
}

button:disabled {
  background-color: #ccc;
}

.amount {
  background-color: #333;
  padding: 0.75rem;
  border-radius: 5px;
  color: #fff;
  text-align: center;
}

/* Responsive para móviles */
@media (max-width: 600px) {
  .payment-form {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-row .form-group.half,
  .form-row .form-group.third {
    flex: 1 1 100%;
  }

  button {
    font-size: 1rem;
    padding: 0.75rem;
  }
}
</style>