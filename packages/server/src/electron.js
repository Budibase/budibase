const { app, BrowserWindow } = require('electron');

require("dotenv").config()

const DEV_URL = "http://localhost:4001";

function createWindow() {
  app.server = require("./app");
  let win = new BrowserWindow({ width: 1920, height: 1080 });
  win.loadURL(DEV_URL);
}

app.whenReady().then(createWindow)