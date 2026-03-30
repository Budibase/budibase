import { utils as coreUtils } from "@budibase/backend-core"
import {
  deleteFolderFileSystem,
  getPluginMetadata,
} from "../../../utilities/fileSystem"
import { join } from "path"
import { downloadUnzipTarball } from "./utils"

function parseNpmUrl(url: string): URL {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error("Invalid NPM URL")
  }

  if (parsed.protocol !== "https:") {
    throw new Error("The plugin origin must be from NPM")
  }

  return parsed
}

function isAllowedNpmHost(host: string): boolean {
  return host === "www.npmjs.com" || host === "registry.npmjs.org"
}

export async function npmUpload(url: string, name: string, headers = {}) {
  let npmTarballUrl = url
  let pluginName = name

  const parsedInput = parseNpmUrl(npmTarballUrl)
  if (!isAllowedNpmHost(parsedInput.hostname)) {
    throw new Error("The plugin origin must be from NPM")
  }

  if (!npmTarballUrl.includes(".tgz")) {
    if (
      parsedInput.hostname !== "www.npmjs.com" ||
      !parsedInput.pathname.startsWith("/package/")
    ) {
      throw new Error("The plugin origin must be from NPM")
    }
    const packageName = parsedInput.pathname.replace("/package/", "").trim()
    const npmPackageURl = `https://registry.npmjs.org/${packageName}`
    const response = await coreUtils.fetchWithBlacklist(npmPackageURl)
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
  try {
    return await getPluginMetadata(pluginRoot, path)
  } catch (err) {
    deleteFolderFileSystem(path)
    throw err
  }
}
