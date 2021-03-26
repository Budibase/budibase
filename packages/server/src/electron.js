const { app, BrowserWindow, shell, dialog, Menu } = require("electron")
const { join } = require("./utilities/centralPath")
const isDev = require("electron-is-dev")
const { autoUpdater } = require("electron-updater")
const unhandled = require("electron-unhandled")
const { existsSync } = require("fs-extra")
const initialiseBudibase = require("./utilities/initialiseBudibase")
const { budibaseAppsDir } = require("./utilities/budibaseDir")
const { openNewGitHubIssue, debugInfo } = require("electron-util")
const eventEmitter = require("./events")
const isMac = process.platform === "darwin"
const budibaseDir = budibaseAppsDir()
const envFile = join(budibaseDir, ".env")

async function startApp() {
  if (!existsSync(envFile)) {
    await initialiseBudibase({ dir: budibaseDir })
  }
  // evict environment from cache, so it reloads when next asked
  delete require.cache[require.resolve("./environment")]
  // store the port incase its going to get overridden
  const port = process.env.PORT
  require("dotenv").config({ path: envFile })
  // overwrite the port - don't want to use dotenv for the port
  require("./environment")._set("PORT", port)

  unhandled({
    showDialog: true,
    reportButton: error => {
      openNewGitHubIssue({
        title: error.message,
        user: "Budibase",
        labels: ["error-report"],
        repo: "budibase",
        body: `### Error that occurred when using the budibase builder:\n\`\`\`\n${
          error.stack
        }\n\`\`\`\n### Operating System Information:\n---\n\n${debugInfo()}`,
      })
    },
  })

  let win

  function handleRedirect(e, url) {
    e.preventDefault()
    shell.openExternal(url)
  }

  async function createWindow() {
    app.server = require("./app")
    eventEmitter.on("internal:port", port => {
      const APP_URL = `http://localhost:${port}/_builder`
      const APP_TITLE = "Budibase Builder"
      win = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: join(__dirname, "..", "build", "icons", "512x512.png"),
      })
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
    })
  }

  app.whenReady().then(createWindow)

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.server.close()
      app.quit()
    }
  })

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow()
  })

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: () => shell.openExternal("https://www.budibase.com/"),
        },
        {
          label: "Documentation",
          click: () => shell.openExternal("https://docs.budibase.com/"),
        },
        {
          label: "Search issues",
          click: () =>
            shell.openExternal("https://github.com/Budibase/budibase/issues"),
        },
        {
          label: "Community discussions",
          click: () =>
            shell.openExternal(
              "https://github.com/Budibase/budibase/discussions"
            ),
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Budibase Update Available",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version of the budibase builder has been downloaded. Restart the application to apply the updates.",
  }

  dialog.showMessageBox(dialogOpts).then(returnValue => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on("error", message => {
  console.error("There was a problem updating the application")
  console.error(message)
})

startApp()
