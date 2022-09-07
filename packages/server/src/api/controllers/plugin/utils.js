import {
  createTempFolder,
  getPluginMetadata,
  findFileRec,
  downloadTarballDirect,
  extractTarball,
  deleteFolderFileSystem,
} from "../../../utilities/fileSystem"
import { join } from "path"
const fetch = require("node-fetch")

export const uploadedFilePlugin = async file => {
  if (!file.name.endsWith(".tar.gz")) {
    throw new Error("Plugin must be compressed into a gzipped tarball.")
  }
  const path = createTempFolder(file.name.split(".tar.gz")[0])
  await extractTarball(file.path, path)

  return await getPluginMetadata(path)
}

export const uploadedNpmPlugin = async (url, name, headers = {}) => {
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
  const tarballPluginFile = findFileRec(path, ".tar.gz")
  if (!tarballPluginFile) {
    throw new Error("Tarball plugin file not found")
  }

  try {
    await extractTarball(tarballPluginFile, path)
    deleteFolderFileSystem(join(path, "package"))
  } catch (err) {
    throw new Error(err)
  }

  return await getPluginMetadata(path)
}

export const uploadedUrlPlugin = async (url, name = "", headers = {}) => {
  if (!url.includes(".tar.gz")) {
    throw new Error("Plugin must be compressed into a gzipped tarball.")
  }

  const path = await downloadUnzipTarball(url, name, headers)

  return await getPluginMetadata(path)
}

export const uploadedGithubPlugin = async (ctx, url, name = "", token = "") => {
  let githubUrl = url

  if (!githubUrl.includes("https://github.com/")) {
    throw new Error("The plugin origin must be from Github")
  }

  if (url.includes(".git")) {
    githubUrl = url.replace(".git", "")
  }

  const githubApiUrl = githubUrl.replace(
    "https://github.com/",
    "https://api.github.com/repos/"
  )
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const pluginRaw = await fetch(githubApiUrl, { headers })
    if (pluginRaw.status !== 200) {
      throw new Error(`Repository not found`)
    }

    let pluginDetails = await pluginRaw.json()
    const pluginName = pluginDetails.name || name

    const pluginLatestReleaseUrl = pluginDetails?.["releases_url"]
      ? pluginDetails?.["releases_url"].replace("{/id}", "/latest")
      : undefined
    if (!pluginLatestReleaseUrl) {
      throw new Error("Github release not found")
    }

    const pluginReleaseRaw = await fetch(pluginLatestReleaseUrl, { headers })
    if (pluginReleaseRaw.status !== 200) {
      throw new Error("Github latest release not found")
    }
    const pluginReleaseDetails = await pluginReleaseRaw.json()
    const pluginReleaseTarballAsset = pluginReleaseDetails?.assets?.find(
      x => x?.content_type === "application/gzip"
    )
    const pluginLastReleaseTarballUrl =
      pluginReleaseTarballAsset?.browser_download_url
    if (!pluginLastReleaseTarballUrl) {
      throw new Error("Github latest release url not found")
    }

    const path = await downloadUnzipTarball(
      pluginLastReleaseTarballUrl,
      pluginName,
      headers
    )

    return await getPluginMetadata(path)
  } catch (err) {
    let errMsg = err?.message || err

    if (errMsg === "unexpected response Not Found") {
      errMsg = "Github release tarbal not found"
    }

    throw new Error(errMsg)
  }
}

export const downloadUnzipTarball = async (url, name, headers = {}) => {
  try {
    const path = createTempFolder(name)

    await downloadTarballDirect(url, path, headers)

    return path
  } catch (e) {
    throw new Error(e.message)
  }
}
