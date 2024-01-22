const {ipcMain, app, BrowserWindow} = require('electron')
const fs = require('fs');
const path = require('path');

let mainWindow = null;

function createSplashWindow() {
  let splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true
  });

  splashWindow.loadFile('./imgs/MITMYNID-SPLASH.jpg');
  splashWindow.setIgnoreMouseEvents(true);
  splashWindow.on('closed', () => {
    splashWindow = null;
  });

  return splashWindow;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    icon: "icon.ico",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile('index.html');
  //mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  mainWindow.removeMenu();

  ipcMain.on("infospotlocationreceived", (evt, arg) => {
    mainWindow.webContents.send("setnewinfospotlocation", arg);
  });
}

app.whenReady().then(() => {
    let splashWindow = createSplashWindow();
  
    splashWindow.once('closed', () => {
      createWindow();
    });
  
    setTimeout(() => {
      splashWindow.close();
    }, 2000);
  });
  
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('quitprogram', (evt, arg) => {
  app.quit();
});
