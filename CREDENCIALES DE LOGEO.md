# 🩺 Nova Salud POS - Guía de Inicio Rápido

Este proyecto es un sistema de Punto de Venta (POS) diseñado para ser robusto y fácil de usar, con soporte para versiones de escritorio y web.

---

## 🚀 Formas de Ejecución

### 💻 Opción A: Versión Desktop (Ejecutable)
Es la forma más rápida de probar el sistema completo.

1.  **Requisito:** Asegúrate de tener **Docker Desktop** abierto.
2.  **Base de Datos:** Abre una terminal en la carpeta raíz y ejecuta:
    ```bash
    docker compose -f docker/docker-compose.yml up -d
    ```
3.  **Abrir App:** Extrae el archivo `Nova-Salud-ENTREGABLE.zip` y abre el archivo `Nova Salud.exe`.

---

### 🌐 Opción B: Versión Web (Desarrollo)
Ideal para inspeccionar el código o usar en el navegador.

1.  **Requisito:** Asegúrate de tener **Docker Desktop** abierto.
2.  **Base de Datos:** (Si no la iniciaste antes)
    ```bash
    docker compose -f docker/docker-compose.yml up -d
    ```
3.  **Ejecutar:** Abre una terminal en `apps/web-pos` y ejecuta:
    ```bash
    npm run dev
    ```
4.  **Acceso:** Entra en tu navegador a [http://localhost:5173](http://localhost:5173).

---

## 🔑 Credenciales de Acceso
*Válidas para ambas versiones:*

*   **Usuario:** `admin`
*   **Contraseña:** `admin123`

---

## 🗄️ Conexión a MongoDB Compass
Si deseas ver los datos en tiempo real:
*   **URI:** `mongodb://127.0.0.1:27017/nova-salud`
*   *(No requiere usuario ni contraseña para la conexión local)*

---
> **Desarrollado por:** [Huafesh 🥷](https://github.com/Huafesh)
