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
  const iconPath = app.isPackaged
    ? path.join(__dirname, 'dist', 'favicon.png')
    : path.join(__dirname, 'public', 'favicon.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: 'Nova Salud POS',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    backgroundColor: '#020617',
  });

  if (IS_DEV) {
    mainWindow.loadURL(DEV_URL);
  } else {
    // Modo producción: cargar index.html del build de React
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // Abrir links externos en el navegador del sistema
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

    const apiFile = app.isPackaged ? 'server.cjs' : 'src/index.js';
    
    apiProcess = spawn(process.execPath, [apiFile], {
      cwd: apiPath,
      env: { ...process.env, NODE_ENV: 'production', ELECTRON_RUN_AS_NODE: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    const fs = require('fs');
    const logPath = path.join(app.getPath('desktop'), 'nova_salud_api_log.txt');
    fs.writeFileSync(logPath, 'INICIANDO API...\n');

    apiProcess.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      console.log('[API]', msg);
      fs.appendFileSync(logPath, '[stdout] ' + msg + '\n');
    });

    apiProcess.stderr.on('data', (data) => {
      const msg = data.toString().trim();
      console.error('[API ERR]', msg);
      fs.appendFileSync(logPath, '[stderr] ' + msg + '\n');
    });

    apiProcess.on('error', (err) => {
      console.error('Error al iniciar API:', err);
      fs.appendFileSync(logPath, '[error] ' + err.message + '\n');
      reject(err);
    });

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
    setTimeout(() => waitForApi(resolve, reject, attempts + 1), 1000);
  });
}

// ─── CICLO DE VIDA DE ELECTRON ────────────────────────────────────────────────
app.whenReady().then(async () => {
  if (IS_DEV) {
    console.log('🔧 Modo desarrollo - conectando a Vite dev server');
    createWindow();
  } else {
    try {
      console.log('📦 Modo producción - iniciando API...');
      await startApiServer();
      createWindow();
    } catch (error) {
      console.error('❌ Error al iniciar:', error);
      createWindow();
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ─── CERRAR LA APP ────────────────────────────────────────────────────────────
app.on('window-all-closed', () => {
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
