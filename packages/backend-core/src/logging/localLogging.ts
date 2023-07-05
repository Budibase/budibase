import fs from "fs"
import path from "path"
import * as rfs from "rotating-file-stream"

import { env } from "process"
import { budibaseTempDir } from "src/objectStore"

export function localFileDestination() {
  const fileName = path.join(budibaseTempDir(), `budibase.logs`)
  const outFile = rfs.createStream(fileName, {
    size: env.ROLLING_LOG_MAX_SIZE,
    teeToStdout: true,
  })

  outFile.on("rotation", () => {
    fs.copyFileSync(fileName, `${fileName}.bak`)
  })

  return outFile
}
