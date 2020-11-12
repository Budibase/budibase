const { ensureDir, constants, copyFile, writeFile } = require("fs-extra")
const { join } = require("../centralPath")
const { budibaseAppsDir } = require("../budibaseDir")

/**
 * Compile all the non-db static web assets that are required for the running of
 * a budibase application. This includes CSS, the JSON structure of the DOM and
 * the client library, a script responsible for reading the JSON structure
 * and rendering the application.
 * @param {} appId - id of the application we want to compile static assets for
 * @param {*} pageName - name of the page that the assets will be served for
 * @param {*} pkg - app package information/metadata
 */
module.exports = async (appId, pageName, pkg) => {
  const pagePath = join(budibaseAppsDir(), appId, "public", pageName)

  pkg.screens = pkg.screens || []

  await ensureDir(pagePath)

  await buildPageCssBundle(pagePath, pkg)

  await buildFrontendAppDefinition(pagePath, pkg)

  await copyClientLib(pagePath)
}

/**
 * Reads the _css property of a page and its screens, and creates a singular CSS
 * bundle for the page at <appId>/public/<pageName>/bundle.css
 * @param {String} publicPagePath - path to the public assets directory of the budibase application
 * @param {Object} pkg - app package information
 * @param {"main" | "unauthenticated"} pageName - the pagename of the page we are compiling CSS for.
 */
const buildPageCssBundle = async (publicPagePath, pkg) => {
  let cssString = ""

  for (let screen of pkg.screens || []) {
    if (!screen._css) continue
    if (screen._css.trim().length === 0) {
      delete screen._css
      continue
    }
    cssString += screen._css
  }

  if (pkg.page._css) cssString += pkg.page._css

  writeFile(join(publicPagePath, "bundle.css"), cssString)
}

/**
 * Copy the budibase client library and sourcemap from NPM to <appId>/public/<pageName>.
 * The client library is then served as a static asset when the budibase application
 * is running in preview or prod
 * @param {String} pagePath - path to write the client library to
 */
const copyClientLib = async pagePath => {
  const sourcepath = require.resolve("@budibase/client")
  const destPath = join(pagePath, "budibase-client.js")

  await copyFile(sourcepath, destPath, constants.COPYFILE_FICLONE)

  await copyFile(
    sourcepath + ".map",
    destPath + ".map",
    constants.COPYFILE_FICLONE
  )
}

/**
 * Build the frontend definition for a budibase application. This includes all page and screen information,
 * and is injected into the budibase client library to tell it how to start constructing
 * the DOM from components defined in the frontendDefinition.
 * @param {String} pagePath - path to the public folder of the page where the definition will be written
 * @param {Object} pkg - app package information from which the frontendDefinition will be built.
 */
const buildFrontendAppDefinition = async (pagePath, pkg) => {
  const filename = join(pagePath, "clientFrontendDefinition.js")

  // Delete CSS code from the page and screens so it's not injected
  delete pkg.page._css

  for (let screen of pkg.screens) {
    if (screen._css) {
      delete pkg.page._css
    }
  }

  const clientUiDefinition = JSON.stringify({
    page: pkg.page,
    screens: pkg.screens,
    libraries: ["@budibase/standard-components"],
  })

  await writeFile(
    filename,
    `
     window['##BUDIBASE_FRONTEND_DEFINITION##'] = ${clientUiDefinition};
    `
  )
}
