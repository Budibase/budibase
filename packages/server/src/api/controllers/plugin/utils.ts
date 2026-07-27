import {
  createTempFolder,
  deleteFolderFileSystem,
} from "../../../utilities/fileSystem"
import { objectStore } from "@budibase/backend-core"

export async function downloadUnzipTarball(
  url: string,
  name: string,
  headers = {},
  { followRedirects = true }: { followRedirects?: boolean } = {}
) {
  const path = createTempFolder(name)

  try {
    await objectStore.downloadTarballDirect(url, path, headers, {
      followRedirects,
    })
    return path
  } catch (e: any) {
    deleteFolderFileSystem(path)
    throw e
  }
}
