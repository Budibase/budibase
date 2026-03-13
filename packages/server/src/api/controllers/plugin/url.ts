import { downloadUnzipTarball } from "./utils"
import {
  deleteFolderFileSystem,
  getPluginMetadata,
} from "../../../utilities/fileSystem"

export async function urlUpload(url: string, name = "", headers = {}) {
  if (!url.includes(".tar.gz")) {
    throw new Error("Plugin must be compressed into a gzipped tarball.")
  }

  const path = await downloadUnzipTarball(url, name, headers)
  try {
    return await getPluginMetadata(path)
  } catch (err) {
    deleteFolderFileSystem(path)
    throw err
  }
}
