import {
  createTempFolder,
  getPluginMetadata,
  extractTarball,
} from "../../../utilities/fileSystem"
import { KoaFile } from "@budibase/types"

export async function fileUpload(file: KoaFile) {
  if (!file.name || !file.path) {
    throw new Error("File is not valid - cannot upload.")
  }
  if (!file.name.endsWith(".tar.gz")) {
    throw new Error("Plugin must be compressed into a gzipped tarball.")
  }
  const path = createTempFolder(file.name.split(".tar.gz")[0])
  await extractTarball(file.path, path)

  return await getPluginMetadata(path)
}
