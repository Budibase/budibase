import fs from "fs"
import { join } from "path"

export function loadJSFile(directory: string, name: string) {
  return fs.readFileSync(join(directory, name), "utf8")
}
