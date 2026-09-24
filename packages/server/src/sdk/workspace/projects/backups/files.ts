import { HTTPError } from "@budibase/backend-core"
import fsp from "fs/promises"
import { join, relative } from "path"
import {
  MAX_PROJECT_EXTRACTED_SIZE_BYTES,
  MAX_PROJECT_PACKAGE_FILES,
} from "./constants"

export const MAX_PROJECT_PATH_SEGMENTS = 4

export const isSafeArchivePath = (path: string) => {
  const segments = path.split(/[\\/]/)
  return (
    !path.startsWith("/") &&
    !path.startsWith("\\") &&
    !/^[A-Za-z]:/.test(path) &&
    segments.every(segment => segment !== ".." && segment !== ".")
  )
}

export const readProjectPackageFiles = async ({
  dirPath,
  rootPath = dirPath,
  totals = { files: 0, bytes: 0 },
}: {
  dirPath: string
  rootPath?: string
  totals?: { files: number; bytes: number }
}): Promise<string[]> => {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    const relPath = relative(rootPath, fullPath)
    if (!isSafeArchivePath(relPath)) {
      throw new HTTPError("Project package contains unsafe paths.", 400)
    }
    if (relPath.split(/[\\/]/).length > MAX_PROJECT_PATH_SEGMENTS) {
      throw new HTTPError(
        "Project package contains paths that are too deep.",
        400
      )
    }
    if (entry.isSymbolicLink()) {
      throw new HTTPError("Project package contains unsupported links.", 400)
    }
    if (entry.isDirectory()) {
      files.push(
        ...(await readProjectPackageFiles({
          dirPath: fullPath,
          rootPath,
          totals,
        }))
      )
    } else {
      const stats = await fsp.stat(fullPath)
      totals.files += 1
      totals.bytes += stats.size
      if (totals.files > MAX_PROJECT_PACKAGE_FILES) {
        throw new HTTPError("Project package contains too many files.", 400)
      }
      if (totals.bytes > MAX_PROJECT_EXTRACTED_SIZE_BYTES) {
        throw new HTTPError("Project package is too large.", 400)
      }
      files.push(fullPath)
    }
  }

  return files
}
