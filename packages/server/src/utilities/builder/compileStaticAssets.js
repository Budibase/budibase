const {
  ensureDir,
  constants,
  copyFile,
  writeFile,
  readdir,
  readFile,
  existsSync,
} = require("fs-extra")
const { join } = require("../centralPath")
const { budibaseAppsDir } = require("../budibaseDir")

const CSS_DIRECTORY = "css"

/**
 * Compile all the non-db static web assets that are required for the running of
 * a budibase application. This includes CSS, the JSON structure of the DOM and
 * the client library, a script responsible for reading the JSON structure
 * and rendering the application.
 * @param {string} appId id of the application we want to compile static assets for
 * @param {array|object} assets a list of screens or screen layouts for which the CSS should be extracted and stored.
 */
module.exports = async (appId, assets) => {
  const publicPath = join(budibaseAppsDir(), appId, "public")
  await ensureDir(publicPath)
  for (let asset of Array.isArray(assets) ? assets : [assets]) {
    await buildCssBundle(publicPath, asset)
    await copyClientLib(publicPath)
    // remove props that shouldn't be present when written to DB
    if (asset._css) {
      delete asset._css
    }
  }
  return assets
}

/**
 * Reads the _css property of all screens and the screen layouts, and creates a singular CSS
 * bundle for the app at <appId>/public/bundle.css
 * @param {String} publicPath - path to the public assets directory of the budibase application
 * @param {Object} asset a single screen or screen layout which is being updated
 */
const buildCssBundle = async (publicPath, asset) => {
  const cssPath = join(publicPath, CSS_DIRECTORY)
  let cssString = ""

  // create a singular CSS file for this asset
  const assetCss = asset._css ? asset._css.trim() : ""
  if (assetCss.length !== 0) {
    await ensureDir(cssPath)
    await writeFile(join(cssPath, asset._id), assetCss)
  }

  // bundle up all the CSS in the directory into one top level CSS file
  if (existsSync(cssPath)) {
    const cssFiles = await readdir(cssPath)
    for (let filename of cssFiles) {
      const css = await readFile(join(cssPath, filename))
      cssString += css
    }
  }

  await writeFile(join(publicPath, "bundle.css"), cssString)
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
