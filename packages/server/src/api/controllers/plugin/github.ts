import { utils as coreUtils } from "@budibase/backend-core"
import {
  deleteFolderFileSystem,
  getPluginMetadata,
} from "../../../utilities/fileSystem"
import { downloadUnzipTarball } from "./utils"

function parseGithubUrl(url: string): URL {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error("Invalid Github URL")
  }

  if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") {
    throw new Error("The plugin origin must be from Github")
  }

  return parsed
}

export async function request(
  url: string,
  headers: Record<string, string> = {},
  err: string
) {
  const response = await coreUtils.fetchWithBlacklist(url, { headers })
  if (response.status >= 300) {
    const respErr = await response.text()
    throw new Error(`Error: ${err} - ${respErr}`)
  }
  return response.json()
}

export async function githubUpload(url: string, name = "", token = "") {
  let githubUrl = parseGithubUrl(url).toString()
  let path: string | undefined

  if (url.includes(".git")) {
    githubUrl = url.replace(".git", "")
  }

  githubUrl = parseGithubUrl(githubUrl).toString()

  const githubApiUrl = githubUrl.replace(
    "https://github.com/",
    "https://api.github.com/repos/"
  )
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}
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
    path = await downloadUnzipTarball(
      pluginLastReleaseTarballUrl,
      pluginName,
      headers
    )
    return await getPluginMetadata(path)
  } catch (err: any) {
    if (path) {
      deleteFolderFileSystem(path)
    }
    let errMsg = err?.message || err
    if (errMsg === "unexpected response Not Found") {
      errMsg = "Github release tarball not found"
    }
    throw new Error(errMsg)
  }
}
