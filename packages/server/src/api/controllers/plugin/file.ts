import {
  createTempFolder,
  getPluginMetadata,
  extractTarball,
} from "../../../utilities/fileSystem"

export async function fileUpload(file: { name: string; path: string }) {
  if (!file.name.endsWith(".tar.gz")) {
    throw new Error("Plugin must be compressed into a gzipped tarball.")
  }
  const path = createTempFolder(file.name.split(".tar.gz")[0])
  await extractTarball(file.path, path)

  return await getPluginMetadata(path)
}
