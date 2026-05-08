const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
const IS_DEV = process.env.NODE_ENV === 'development' || !app.isPackaged;
const API_PORT = 5000;
const DEV_URL = 'http://localhost:5173';
const API_URL = `http://localhost:${API_PORT}`;

let mainWindow = null;
let apiProcess = null;

// ─── VENTANA PRINCIPAL ────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: 'Nova Salud POS',
    icon: path.join(__dirname, '..', 'web-pos', 'src', 'assets', 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    // Aspecto profesional: sin marco por defecto del OS
    autoHideMenuBar: true,
    backgroundColor: '#020617', // mismo dark bg que la app
  });

  if (IS_DEV) {
    // Modo desarrollo: cargar el Vite dev server
    mainWindow.loadURL(DEV_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Modo producción: cargar los archivos estáticos del build
    const indexPath = path.join(
      process.resourcesPath,
      'web-pos-dist',
      'index.html'
    );
    mainWindow.loadFile(indexPath);
  }

  // Abrir links externos en el navegador del sistema, no en la app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── ARRANCAR API BACKEND ─────────────────────────────────────────────────────
function startApiServer() {
  return new Promise((resolve, reject) => {
    const apiPath = IS_DEV
      ? path.join(__dirname, '..', 'api')
      : path.join(process.resourcesPath, 'api');

    console.log('🚀 Iniciando servidor API en:', apiPath);

    apiProcess = spawn('node', ['src/index.js'], {
      cwd: apiPath,
      env: { ...process.env, NODE_ENV: 'production' },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    apiProcess.stdout.on('data', (data) => {
      console.log('[API]', data.toString().trim());
    });

    apiProcess.stderr.on('data', (data) => {
      console.error('[API ERR]', data.toString().trim());
    });

    apiProcess.on('error', (err) => {
      console.error('Error al iniciar API:', err);
      reject(err);
    });

    // Esperar a que la API responda en el puerto 5000
    waitForApi(resolve, reject);
  });
}

// ─── ESPERAR A QUE LA API ESTÉ LISTA ─────────────────────────────────────────
function waitForApi(resolve, reject, attempts = 0) {
  if (attempts > 30) {
    reject(new Error('API no respondió después de 30 intentos'));
    return;
  }

  http.get(API_URL, (res) => {
    console.log(`✅ API lista en ${API_URL}`);
    resolve();
  }).on('error', () => {
    // Reintentar cada 1 segundo
    setTimeout(() => waitForApi(resolve, reject, attempts + 1), 1000);
  });
}

// ─── CICLO DE VIDA DE ELECTRON ────────────────────────────────────────────────
app.whenReady().then(async () => {
  if (IS_DEV) {
    // En desarrollo, la API ya está corriendo con nodemon
    console.log('🔧 Modo desarrollo - conectando a Vite dev server');
    createWindow();
  } else {
    // En producción, arrancar la API primero
    try {
      console.log('📦 Modo producción - iniciando API...');
      await startApiServer();
      createWindow();
    } catch (error) {
      console.error('❌ Error al iniciar:', error);
      // Abrir ventana de todas formas y mostrar error
      createWindow();
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ─── CERRAR LA APP ────────────────────────────────────────────────────────────
app.on('window-all-closed', () => {
  // Terminar el proceso de la API al cerrar la ventana
  if (apiProcess) {
    apiProcess.kill();
    apiProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (apiProcess) {
    apiProcess.kill();
  }
});
