const fetch = require("node-fetch")
import { downloadUnzipPlugin } from "../../../utilities/fileSystem"

export const createNpmPlugin = async (url, name = "") => {
  let npmTarball = url
  let pluginName = name

  if (
    !npmTarball.includes("https://www.npmjs.com") &&
    !npmTarball.includes("https://registry.npmjs.org")
  ) {
    throw "The plugin origin must be from NPM"
  }

  if (!npmTarball.includes(".tgz")) {
    const npmPackageURl = url.replace(
      "https://www.npmjs.com/package/",
      "https://registry.npmjs.org/"
    )
    const response = await fetch(npmPackageURl)
    if (response.status === 200) {
      let npmDetails = await response.json()
      pluginName = npmDetails.name
      const npmVersion = npmDetails["dist-tags"].latest
      npmTarball = npmDetails.versions[npmVersion].dist.tarball
    } else {
      throw "Cannot get package details"
    }
  }

  return await downloadUnzipPlugin(pluginName, npmTarball)
}
