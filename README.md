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

念岸岸 frontend/ # Proyecto Vue 3 念岸岸 backend/ # Proyecto NestJS 念岸岸 docker/ # (opcional) Archivos para despliegue 念岸岸 README.md # Este archivo

---

## ?? Instalaci車n

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
?? Obtenci車n de acceptance_token

?? Generaci車n del token de tarjeta

?? Firma de integridad con SHA256

?? Creaci車n de transacci車n con token

?? Redirecci車n autom芍tica seg迆n estado

?? Recepci車n y manejo de webhook

?? Consulta de transacci車n por referencia

Autor

Francisco Galindo

?? Notas
Este proyecto fue desarrollado como parte de una prueba t谷cnica para evaluar conocimientos Fullstack, integraci車n de APIs de terceros, manejo de seguridad (firmas), validaci車n de datos, testing y dise?o modular.


? Estado del Proyecto
Criterio	Estado
Flujo completo de pago con Wompi	? Hecho
Pruebas unitarias con cobertura > 80%	? Hecho
Integraci車n base de datos PostgreSQL	? Hecho
Webhook y validaci車n de eventos	? Hecho
Documentaci車n general del proyecto	? Hecho
Deploy en entorno cloud (ej. AWS)	?? Pendiente