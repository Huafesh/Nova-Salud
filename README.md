# 🏥 Nova Salud POS - Sistema de Gestión Farmacéutica Integral

¡Bienvenido a **Nova Salud POS**! Una solución de software robusta, moderna y eficiente diseñada específicamente para la gestión de farmacias y puntos de venta. Este sistema combina la potencia de una aplicación de escritorio nativa con la flexibilidad de una plataforma web.

---

## 📌 ¿Qué es Nova Salud POS?
Nova Salud POS es un sistema de gestión integral que permite a las farmacias controlar su inventario, procesar ventas de manera rápida y segura, y gestionar su base de datos de productos de forma centralizada. Su objetivo es optimizar la atención al cliente y reducir los errores operativos mediante una interfaz intuitiva y un backend de alto rendimiento.

## ✨ Características Principales
*   **🛒 Punto de Venta (POS):** Interfaz fluida para realizar ventas, calcular totales y gestionar el flujo de caja.
*   **📦 Gestión de Inventario:** Control total sobre el stock, precios, categorías y descripciones de medicamentos y productos.
*   **🔐 Sistema de Autenticación:** Acceso protegido para asegurar que solo personal autorizado gestione la información.
*   **🖥️ Multiplataforma:** Disponible como aplicación de escritorio (.exe) para máxima estabilidad y versión web para acceso remoto.
*   **💾 Persistencia de Datos:** Integración con MongoDB para asegurar que la información nunca se pierda.

---

## 🛠️ Stack Tecnológico (MERN Stack)
El proyecto ha sido construido utilizando las tecnologías más modernas de la industria:
*   **Frontend:** React.js con Vite para una interfaz de usuario rápida y reactiva.
*   **Backend:** Node.js y Express.js encargados de la lógica de negocio y la API REST.
*   **Base de Datos:** MongoDB (Dockerizada) para un almacenamiento de datos flexible y escalable.
*   **Desktop:** Electron.js para empaquetar la aplicación como un software de escritorio nativo.
*   **Infraestructura:** Docker Compose para una gestión de entorno sencilla y portable.

---

## 🚀 Guía de Instalación y Uso

### Requisito Indispensable
Para que el sistema funcione (tanto en web como en desktop), es necesario tener **Docker Desktop** instalado y en ejecución para levantar el contenedor de la base de datos.

### 💻 Opción A: Ejecución Desktop (Recomendado)
Es la versión final para el usuario final.
1.  **Levantar Base de Datos:** Abre una terminal en la raíz y ejecuta:
    ```bash
    docker compose -f docker/docker-compose.yml up -d
    ```
2.  **Iniciar App:** Extrae el archivo `Nova-Salud-ENTREGABLE.zip` y ejecuta `Nova Salud.exe`.

### 🌐 Opción B: Ejecución Web (Desarrollo)
Ideal para inspección de código o uso en navegador.
1.  **Levantar Base de Datos:**
    ```bash
    docker compose -f docker/docker-compose.yml up -d
    ```
2.  **Iniciar Servidor:** Entra en `apps/web-pos` y ejecuta:
    ```bash
    npm run dev
    ```
3.  **Acceso:** Visita [http://localhost:5173](http://localhost:5173).

---

## 🔑 Credenciales de Acceso
Para entrar al sistema, utiliza las siguientes credenciales de administrador:
*   **Usuario:** `admin`
*   **Contraseña:** `admin123`

---

## 📊 Monitoreo de Datos
Si deseas visualizar los datos en tiempo real, puedes conectar MongoDB Compass usando:
*   **URI:** `mongodb://127.0.0.1:27017/nova-salud`

---

## 🛑 Notas de Compatibilidad
Para evitar conflictos de puertos, asegúrese de cerrar la versión Desktop antes de iniciar la versión Web, ya que ambas utilizan el puerto **5000** para comunicarse con la API del servidor.

---
**Desarrollado con ❤️ por:** [Huafesh 🥷](https://github.com/Huafesh)
