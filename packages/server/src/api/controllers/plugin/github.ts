import { getPluginMetadata } from "../../../utilities/fileSystem"
import fetch from "node-fetch"
import { downloadUnzipTarball } from "./utils"

export async function request(
  url: string,
  headers: { [key: string]: string },
  err: string
) {
  const response = await fetch(url, { headers })
  if (response.status >= 300) {
    const respErr = await response.text()
    throw new Error(`Error: ${err} - ${respErr}`)
  }
  return response.json()
}

export async function githubUpload(url: string, name = "", token = "") {
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
  const headers: any = token ? { Authorization: `Bearer ${token}` } : {}
  const pluginDetails = await request(
    githubApiUrl,
    headers,
    "Repository not found"
  )
  const pluginName = pluginDetails.name || name
  const pluginLatestReleaseUrl = pluginDetails?.["releases_url"]
    ? pluginDetails?.["releases_url"].replace("{/id}", "/latest")
    : undefined
  if (!pluginLatestReleaseUrl) {
    throw new Error("Github release not found")
  }

  const pluginReleaseDetails = await request(
    pluginLatestReleaseUrl,
    headers,
    "Github latest release not found"
  )
  const pluginReleaseTarballAsset = pluginReleaseDetails?.assets?.find(
    (x: any) => x?.["content_type"] === "application/gzip"
  )
  const pluginLastReleaseTarballUrl =
    pluginReleaseTarballAsset?.["browser_download_url"]
  if (!pluginLastReleaseTarballUrl) {
    throw new Error("Github latest release url not found")
  }

  try {
    const path = await downloadUnzipTarball(
      pluginLastReleaseTarballUrl,
      pluginName,
      headers
    )
    return await getPluginMetadata(path)
  } catch (err: any) {
    let errMsg = err?.message || err
    if (errMsg === "unexpected response Not Found") {
      errMsg = "Github release tarball not found"
    }
    throw new Error(errMsg)
  }
}
