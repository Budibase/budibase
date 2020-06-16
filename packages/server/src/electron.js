const { app, BrowserWindow, shell } = require("electron")
const { join } = require("path")
const { homedir } = require("os")
const isDev = require("electron-is-dev")
const { autoUpdater } = require("electron-updater")
const unhandled = require("electron-unhandled")

require("dotenv").config({ path: join(homedir(), ".budibase", ".env") })

if (isDev) {
  unhandled({
    showDialog: true,
  })
}

const APP_URL = "http://localhost:4001/_builder"
const APP_TITLE = "Budibase Builder"

let win

function handleRedirect(e, url) {
  e.preventDefault()
  shell.openExternal(url)
}

async function createWindow() {
  app.server = await require("./app")()
  win = new BrowserWindow({ width: 1920, height: 1080 })
  win.setTitle(APP_TITLE)
  win.loadURL(APP_URL)
  if (isDev) {
    win.webContents.openDevTools()
  } else {
    autoUpdater.checkForUpdatesAndNotify()
  }

  // open _blank in default browser
  win.webContents.on("new-window", handleRedirect)
  win.webContents.on("will-navigate", handleRedirect)
}

app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) createWindow()
})
