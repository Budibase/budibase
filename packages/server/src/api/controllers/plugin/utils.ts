import { createTempFolder } from "../../../utilities/fileSystem"
import { objectStore } from "@budibase/backend-core"

export async function downloadUnzipTarball(
  url: string,
  name: string,
  headers = {}
) {
  try {
    const path = createTempFolder(name)
    await objectStore.downloadTarballDirect(url, path, headers)

    return path
  } catch (e: any) {
    throw new Error(e.message)
  }
}
