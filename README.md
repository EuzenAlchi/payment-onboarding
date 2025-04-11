# ?? Payment Onboarding - Fullstack Test

Prueba t谷cnica Fullstack integrando pasarela de pagos **Wompi** en entorno Sandbox.  
Incluye frontend en **Vue 3 + Vuex** y backend en **NestJS + PostgreSQL**, bajo arquitectura **Hexagonal**.

---

## ?? Tecnolog赤as

| Frontend     | Backend      | Otros                    |
|--------------|--------------|---------------------------|
| Vue 3 + Vite | NestJS       | PostgreSQL, Docker        |
| Vuex         | TypeORM      | Jest + Vitest (tests)     |
| Axios        | Axios        | Wompi Sandbox API         |

---

## ?? Estructura del proyecto

--- frontend/ # Proyecto Vue 3 --- backend/ # Proyecto NestJS --- docker/ # (opcional) Archivos para despliegue --- README.md # Este archivo

---

## ?? Instalacion

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev

Frontend (Vue 3)

cd frontend
npm install
npm run dev


?? Testing
Backend
bash
Copiar

# Ejecutar pruebas unitarias
npm run test

# Cobertura
npm run test:cov

npm run test:unit

?? Flujo de Pago con Wompi
?? Obtencion de acceptance_token

?? Generacion del token de tarjeta

?? Firma de integridad con SHA256

?? Creacion de transaccion con token

?? Redireccion automotica segun estado

?? Recepcion y manejo de webhook

?? Consulta de transaccion por referencia

Autor

Francisco Galindo

?? Notas
Este proyecto fue desarrollado como parte de una prueba tecnica para evaluar conocimientos Fullstack, integracion de APIs de terceros, manejo de seguridad (firmas), validacion de datos, testing y diseño modular.


? Estado del Proyecto
Criterio	Estado
Flujo completo de pago con Wompi	? Hecho
Pruebas unitarias con cobertura > 80%	? Hecho
Integracion base de datos PostgreSQL	? Hecho
Webhook y validacion de eventos	? Hecho
Documentacion general del proyecto	? Hecho
Deploy en entorno cloud (ej. AWS)	?? Pendiente
