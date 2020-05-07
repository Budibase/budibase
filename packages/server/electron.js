const { app, BrowserWindow } = require('electron');

require("dotenv").config()

function createWindow() {
  app.server = require("./app")();
  let win = new BrowserWindow({ width: 1920, height: 1080 });
  win.loadURL('http://localhost:4001');
}

app.whenReady().then(createWindow)