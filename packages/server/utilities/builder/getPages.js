const { readJSON, readdir } = require("fs-extra")
const { join } = require("path")

module.exports = async appPath => {
  const pages = {}

  const pageFolders = await readdir(join(appPath, "pages"))
  for (let pageFolder of pageFolders) {
    try {
      pages[pageFolder] = await readJSON(
        join(appPath, "pages", pageFolder, "page.json")
      )
      pages[pageFolder].name = pageFolder
    } catch (_) {
      // ignore error
    }
  }

  return pages
}
