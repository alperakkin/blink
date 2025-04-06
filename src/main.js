require('dotenv').config();

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);


let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'public/image/logo.png')
  });

  win.loadURL(process.env.API_URL);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      app.disableHardwareAcceleration();
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle("read-directory", async (_, dirPath) => {
  console.log(`📂 IPC Main: Reading Folder -> ${dirPath}`);

  try {
    const files = await readdir(dirPath);
    const fileDetails = files
      .filter(file => !file.startsWith("."))
      .map((file) => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        return {
          name: file,
          isDirectory: stats.isDirectory(),
        };
      });

    console.log("📂 Found:", fileDetails);
    return fileDetails;
  } catch (error) {
    console.error("🚨 Folder Read Error:", error.message);
    return { error: error.message };
  }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  });
  return result.filePaths[0];
});

