import {
  createTempFolder,
  deleteFolderFileSystem,
  getPluginMetadata,
  extractTarball,
} from "../../../utilities/fileSystem"
import { KoaFile } from "@budibase/types"

export async function fileUpload(file: KoaFile) {
  const filename = file.originalFilename
  const filePath = file.filepath

  if (!filename || !filePath) {
    throw new Error("File is not valid - cannot upload.")
  }
  if (!filename.endsWith(".tar.gz")) {
    throw new Error("Plugin must be compressed into a gzipped tarball.")
  }
  const path = createTempFolder(filename.split(".tar.gz")[0])

  try {
    await extractTarball(filePath, path)
    return await getPluginMetadata(path)
  } catch (err) {
    deleteFolderFileSystem(path)
    throw err
  }
}
