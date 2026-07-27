import { downloadUnzipTarball } from "./utils"
import {
  deleteFolderFileSystem,
  getPluginMetadata,
} from "../../../utilities/fileSystem"

function parseTarGzUrl(url: string): URL {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error("Invalid plugin URL.")
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Plugin URL must use HTTPS.")
  }

  if (!parsed.pathname.endsWith(".tar.gz")) {
    throw new Error("Plugin must be compressed into a gzipped tarball.")
  }

  return parsed
}

export async function urlUpload(url: string, name = "", headers = {}) {
  parseTarGzUrl(url)

  const path = await downloadUnzipTarball(url, name, headers, {
    followRedirects: false,
  })
  try {
    return await getPluginMetadata(path)
  } catch (err) {
    deleteFolderFileSystem(path)
    throw err
  }
}
