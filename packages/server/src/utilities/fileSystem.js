const { budibaseTempDir } = require("./budibaseDir")
const { isDev } = require("./index")
const fs = require("fs")
const { join } = require("path")
const { downloadTemplate } = require("./templates")

/**
 * The single stack system (Cloud and Builder) should not make use of the file system where possible,
 * this file handles all of the file access for the system with the intention of limiting it all to one
 * place. Keeping all of this logic in one place means that when we need to do file system access (like
 * downloading a package or opening a temporary file) in can be done in way that we can confirm it shouldn't
 * be done through an object store instead.
 */

/**
 * Checks if the system is currently in development mode and if it is makes sure
 * everything required to function is ready.
 */
exports.checkDevelopmentEnvironment = () => {
  if (isDev() && !fs.existsSync(budibaseTempDir())) {
    console.error(
      "Please run a build before attempting to run server independently to fill 'tmp' directory."
    )
    process.exit(-1)
  }
}

/**
 * This function manages temporary template files which are stored by Koa.
 * @param {Object} template The template object retrieved from the Koa context object.
 * @returns {Object} Returns an fs read stream which can be loaded into the database.
 */
exports.getTemplateStream = async template => {
  if (template.file) {
    return fs.createReadStream(template.file.path)
  } else {
    const templatePath = await downloadTemplate(...template.key.split("/"))
    return fs.createReadStream(join(templatePath, "db", "dump.txt"))
  }
}
