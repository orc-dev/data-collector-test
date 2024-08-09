/**
 * @file main.mjs
 * 
 * @description This file is the main entry point for the Electron application.
 * It creates the main application window, handles application lifecycle 
 * events, and sets up global shortcuts.
 * 
 * @date Aug.8 2024
 */
import { app, BrowserWindow, globalShortcut } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import isDev from 'electron-is-dev';

// Define __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,  // Initial width
        height: 600, // Initial height
        //fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webgl: true,
            webSecurity: false,
        },
    });

    const localHostUrl = 'http://localhost:8080';
    const indexHtmlUrl = `file://${path.join(__dirname, '../public/index.html')}`;
    
    mainWindow.loadURL(isDev ? localHostUrl : indexHtmlUrl);
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
