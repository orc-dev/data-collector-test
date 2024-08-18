/**
 * @file main.mjs
 * 
 * @description This file is the main entry point for the Electron application.
 * It creates the main application window, handles application lifecycle 
 * events, and sets up global shortcuts.
 * 
 * @date Aug.8 2024
 */
import { app, BrowserWindow, globalShortcut, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import isDev from 'electron-is-dev';

// Define __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, 
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webgl: true,
            webSecurity: false,
        },
    });

    const localhostURL = 'http://localhost:8080';
    const indexhtmlURL = `file://${path.join(__dirname, '../public/index.html')}`;
    
    mainWindow.loadURL(isDev ? localhostURL : indexhtmlURL);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
  
    // Register a 'F12' shortcut listener to toggle DevTools
    globalShortcut.register('F12', () => {
        if (mainWindow) {
            mainWindow.webContents.toggleDevTools();
        }
    });

    // Handle folder selection dialog
    ipcMain.handle('dialog:openDirectory', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        return result;
    });

    // Listen for video recording save requests
    ipcMain.on('save-recording', (event, savePath, buffer) => {
        // Save the file to the dynamically provided path
        fs.writeFile(savePath, buffer, (err) => {
            if (err) {
                console.error('Failed to save video:', err);
                event.reply('save-recording-error', err.message);
            } else {
                console.log(`Video saved to: ${savePath}`);
                event.reply('save-recording-success', savePath);
            }
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app-exit', () => {
    app.quit();
});
