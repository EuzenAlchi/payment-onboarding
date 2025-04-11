# ?? Payment Onboarding - Fullstack Test

Prueba t��cnica Fullstack integrando pasarela de pagos **Wompi** en entorno Sandbox.  
Incluye frontend en **Vue 3 + Vuex** y backend en **NestJS + PostgreSQL**, bajo arquitectura **Hexagonal**.

---

## ?? Tecnolog��as

| Frontend     | Backend      | Otros                    |
|--------------|--------------|---------------------------|
| Vue 3 + Vite | NestJS       | PostgreSQL, Docker        |
| Vuex         | TypeORM      | Jest + Vitest (tests)     |
| Axios        | Axios        | Wompi Sandbox API         |

---

## ?? Estructura del proyecto

������ frontend/ # Proyecto Vue 3 ������ backend/ # Proyecto NestJS ������ docker/ # (opcional) Archivos para despliegue ������ README.md # Este archivo

---

## ?? Instalaci��n

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
?? Obtenci��n de acceptance_token

?? Generaci��n del token de tarjeta

?? Firma de integridad con SHA256

?? Creaci��n de transacci��n con token

?? Redirecci��n autom��tica seg��n estado

?? Recepci��n y manejo de webhook

?? Consulta de transacci��n por referencia

Autor

Francisco Galindo

?? Notas
Este proyecto fue desarrollado como parte de una prueba t��cnica para evaluar conocimientos Fullstack, integraci��n de APIs de terceros, manejo de seguridad (firmas), validaci��n de datos, testing y dise?o modular.


? Estado del Proyecto
Criterio	Estado
Flujo completo de pago con Wompi	? Hecho
Pruebas unitarias con cobertura > 80%	? Hecho
Integraci��n base de datos PostgreSQL	? Hecho
Webhook y validaci��n de eventos	? Hecho
Documentaci��n general del proyecto	? Hecho
Deploy en entorno cloud (ej. AWS)	?? Pendiente