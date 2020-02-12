const crypto = require("crypto")
const { ensureDir, emptyDir, writeFile } = require("fs-extra")
const { join } = require("path")

module.exports.convertCssToFiles = async (publicPagePath, pkg) => {
  const cssDir = join(publicPagePath, "css")
  await ensureDir(cssDir)
  await emptyDir(cssDir)

  for (let screen of pkg.screens || []) {
    if (!screen._css) continue
    if (screen._css.trim().length === 0) {
      delete screen._css
      continue
    }
    screen._css = await createCssFile(cssDir, screen._css)
  }

  if (pkg.page._css) {
    pkg.page._css = await createCssFile(cssDir, pkg.page._css)
  }
}

module.exports.getHashedCssPaths = (cssDir, _css) => {
  const fileName =
    crypto
      .createHash("md5")
      .update(_css)
      .digest("hex") + ".css"

  const filePath = join(cssDir, fileName)
  const url = `/css/${fileName}`

  return { filePath, url }
}

const createCssFile = async (cssDir, _css) => {
  const { filePath, url } = module.exports.getHashedCssPaths(cssDir, _css)

  await writeFile(filePath, _css)

  return url
}
