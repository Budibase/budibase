import { readFileSync } from "fs"

export function readStaticFile(path: string) {
  return readFileSync(path, "utf-8")
}
