import fs from "fs"
import path from "path"
import * as rfs from "rotating-file-stream"

import env from "../environment"
import { budibaseTempDir } from "../objectStore"

const logsFileName = path.join(budibaseTempDir(), `budibase.logs`)
const rollingFileName = `${logsFileName}.bak`

export function localFileDestination() {
  const outFile = rfs.createStream(logsFileName, {
    size: env.ROLLING_LOG_MAX_SIZE,
  })

  outFile.on("rotation", () => {
    fs.copyFileSync(logsFileName, rollingFileName)
  })

  return outFile
}

export function getLogReadStream() {
  const logsContent = fs.readFileSync(logsFileName)
  if (!fs.existsSync(rollingFileName)) {
    return logsContent
  }

  const rollingContent = fs.readFileSync(rollingFileName)
  const combinedContent = Buffer.concat([rollingContent, logsContent])
  return combinedContent
}
