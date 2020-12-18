const { ensureDir, constants, copyFile } = require("fs-extra")
const { join } = require("../centralPath")
const { budibaseAppsDir } = require("../budibaseDir")

/**
 * Compile all the non-db static web assets that are required for the running of
 * a budibase application. This includes the JSON structure of the DOM and
 * the client library, a script responsible for reading the JSON structure
 * and rendering the application.
 * @param {string} appId id of the application we want to compile static assets for
 */
module.exports = async appId => {
  const publicPath = join(budibaseAppsDir(), appId, "public")
  await ensureDir(publicPath)
  await copyClientLib(publicPath)
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
