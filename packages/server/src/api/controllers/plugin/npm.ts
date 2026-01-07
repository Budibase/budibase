import { getPluginMetadata } from "../../../utilities/fileSystem"
import fetch from "node-fetch"
import { join } from "path"
import { downloadUnzipTarball } from "./utils"

export async function npmUpload(url: string, name: string, headers = {}) {
  let npmTarballUrl = url
  let pluginName = name

  if (
    !npmTarballUrl.includes("https://www.npmjs.com") &&
    !npmTarballUrl.includes("https://registry.npmjs.org")
  ) {
    throw new Error("The plugin origin must be from NPM")
  }

  if (!npmTarballUrl.includes(".tgz")) {
    const npmPackageURl = url.replace(
      "https://www.npmjs.com/package/",
      "https://registry.npmjs.org/"
    )
    const response = await fetch(npmPackageURl)
    if (response.status !== 200) {
      throw new Error("NPM Package not found")
    }

    let npmDetails = await response.json()
    pluginName = npmDetails.name
    const npmVersion = npmDetails["dist-tags"].latest
    npmTarballUrl = npmDetails?.versions?.[npmVersion]?.dist?.tarball

    if (!npmTarballUrl) {
      throw new Error("NPM tarball url not found")
    }
  }

  const path = await downloadUnzipTarball(npmTarballUrl, pluginName, headers)
  const pluginRoot = join(path, "package", "dist")

  return await getPluginMetadata(pluginRoot)
}
