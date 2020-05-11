const { app, BrowserWindow } = require('electron');
const { join } = require("path")
const { homedir } = require("os")

require("dotenv").config({ path: join(homedir(), ".budibase", ".env") })

const DEV_URL = "http://localhost:4001";

function createWindow() {
  app.server = require("./app");
  let win = new BrowserWindow({ width: 1920, height: 1080 });
  win.loadURL(DEV_URL);
}

app.whenReady().then(createWindow)