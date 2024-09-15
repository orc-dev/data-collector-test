/**
 * @file main.mjs
 * 
 * @description This file is the main entry point for the Electron application.
 * It creates the main application window, handles application lifecycle 
 * events, and sets up global shortcuts.
 * 
 * @date Aug.08 2024 Create.
 *       Aug.21 2024 Add csv writing listener.
 *       Sep.13 2024 Add feature to hide mouse cursor after inactivity.
 */
import { app, BrowserWindow, globalShortcut, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'url';
import { Parser } from 'json2csv';
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
        fullscreen: true,
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

    // Add mouse movement detection to hide/show the cursor
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.insertCSS('body { cursor: auto; }');
        setupMouseHideFeature();
    });
}

function setupMouseHideFeature() {
    mainWindow.webContents.executeJavaScript(`
        let mouseTimeout;
        document.addEventListener('mousemove', () => {
            document.body.style.cursor = 'default';
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                document.body.style.cursor = 'none';
            }, 3000);  // Hide cursor after 3 seconds of inactivity
        });
    `);
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

    // Listen for CSV writing requests
    ipcMain.on('write-csv', (event, filePath, csvData, opts) => {
        try {
            const json2csvParser = new Parser(opts);
            const csv = json2csvParser.parse(csvData);
            
            fs.writeFile(filePath, csv, 'utf8', (err) => {
                if (err) {
                    console.error('Failed to save CSV:', err);
                    event.reply('write-csv-failure', err.message);
                } else {
                    console.log(`CSV saved to: ${filePath}`);
                    event.reply('write-csv-success', `File saved to: ${filePath}`);
                }
            });
        } catch (err) {
            console.error('Error generating CSV:', err);
            event.reply('write-csv-failure', 'Error generating CSV');
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

ipcMain.on('app-exit', () => {
    app.quit();
});
