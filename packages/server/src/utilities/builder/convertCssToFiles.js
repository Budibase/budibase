const { writeFile } = require("fs-extra")
const { join } = require("../centralPath")

/**
 * Reads the _css property of all pages and screens in the budibase application, and creates a singlular CSS
 * bundle for the app at <appId>/public/bundle.css.
 * @param {*} publicPagePath - path to the public assets directory of the budibase application
 * @param {*} pkg - app package information
 * @param {*} pageName - the pagename of the page we are compiling CSS for.
 */
module.exports.convertCssToBundle = async (publicPagePath, pkg) => {
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
