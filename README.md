# 🏥 Nova Salud POS - Sistema de Gestión Farmacéutica

¡Bienvenido al sistema de Punto de Venta de Nova Salud! Este proyecto es una solución integral para la gestión de inventarios y ventas, disponible tanto en versión de escritorio como web.

---

## 🚀 Guía de Inicio Rápido

Este proyecto cuenta con dos formas de ejecución según su preferencia:

### 💻 Opción A: Versión Desktop (Ejecutable .exe)
Es la forma más rápida y sencilla de probar el sistema completo como una aplicación nativa.

**Requisitos:**
* Tener **Docker Desktop** instalado y abierto.

**Pasos:**
1. **Iniciar Base de Datos:** Abra una terminal en la carpeta raíz y ejecute:
   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```
2. **Ejecutar App:** Extraiga el archivo `Nova-Salud-ENTREGABLE.zip` y abra el archivo `Nova Salud.exe`.

---

### 🌐 Opción B: Versión Web (Desarrollo)
Ideal para visualizar el proyecto en el navegador.

**Requisitos:**
* Tener **Docker Desktop** abierto.

**Pasos:**
1. **Iniciar Base de Datos:**
   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```
2. **Iniciar Servidor Web:** Abra una terminal en `apps/web-pos` y ejecute:
   ```bash
   npm run dev
   ```
3. **Acceso:** Abra su navegador en [http://localhost:5173](http://localhost:5173).

---

## 🔑 Credenciales de Acceso
*Válidas para ambas versiones (Desktop y Web)*

*   **Usuario:** `admin`
*   **Contraseña:** `admin123`

---

## 📊 Conexión a Base de Datos (MongoDB Compass)
Si desea visualizar los datos crudos directamente en la base de datos:

*   **URI:** `mongodb://127.0.0.1:27017/nova-salud`
*   *(No requiere usuario ni contraseña en la conexión local)*

---

> **Nota:** Para evitar conflictos de puerto, asegúrese de cerrar la versión Desktop antes de iniciar la versión Web, ya que ambas utilizan el puerto 5000 para la API.

---
**Desarrollado por:** Huafesh 🥷
