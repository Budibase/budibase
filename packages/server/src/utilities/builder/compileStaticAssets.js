const { ensureDir, constants, copyFile, writeFile } = require("fs-extra")
const { join } = require("../centralPath")
const { budibaseAppsDir } = require("../budibaseDir")
const CouchDB = require("../../db")
const { getScreenParams, getLayoutParams } = require("../../db/utils")

async function getAppPackage(appId) {
  const db = new CouchDB(appId)
  let params = {
    include_docs: true,
  }
  let [screens, layouts] = await Promise.all([
    db.allDocs(getScreenParams(null, params)),
    db.allDocs(getLayoutParams(null, params)),
  ])
  screens = screens.rows.map(row => row.doc)
  layouts = layouts.rows.map(row => row.doc)
  if (!screens) {
    screens = []
  }
  if (!layouts) {
    layouts = []
  }
  return { screens, layouts }
}

/**
 * Compile all the non-db static web assets that are required for the running of
 * a budibase application. This includes CSS, the JSON structure of the DOM and
 * the client library, a script responsible for reading the JSON structure
 * and rendering the application.
 * @param {string} appId - id of the application we want to compile static assets for
 */
module.exports = async appId => {
  const publicPath = join(budibaseAppsDir(), appId, "public")
  const pkg = await getAppPackage(appId)

  await ensureDir(publicPath)
  await buildCssBundle(publicPath, pkg)
  await copyClientLib(publicPath)
}

/**
 * Reads the _css property of all screens and the screen layouts, and creates a singular CSS
 * bundle for the app at <appId>/public/bundle.css
 * @param {String} publicPath - path to the public assets directory of the budibase application
 * @param {Object} pkg - app package information
 */
const buildCssBundle = async (publicPath, pkg) => {
  let cssString = ""

  for (let screen of pkg.screens || []) {
    if (!screen._css) continue
    if (screen._css.trim().length === 0) {
      delete screen._css
      continue
    }
    cssString += screen._css
  }

  if (pkg.layout._css) cssString += pkg.layout._css

  writeFile(join(publicPath, "bundle.css"), cssString)
}

/**
 * Copy the budibase client library and sourcemap from NPM to <appId>/public/.
 * The client library is then served as a static asset when the budibase application
 * is running in preview or prod
 * @param {String} publicPath - path to write the client library to
 */
const copyClientLib = async publicPath => {
  const sourcepath = require.resolve("@budibase/client")
  const destPath = join(publicPath, "budibase-client.js")

  await copyFile(sourcepath, destPath, constants.COPYFILE_FICLONE)

  await copyFile(
    sourcepath + ".map",
    destPath + ".map",
    constants.COPYFILE_FICLONE
  )
}
