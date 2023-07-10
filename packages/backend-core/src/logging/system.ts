import fs from "fs"
import path from "path"
import * as rfs from "rotating-file-stream"

import env from "../environment"
import { budibaseTempDir } from "../objectStore"

const logsFileName = `budibase.logs`
const budibaseLogsHistoryFileName = "budibase-logs-history.txt"

const logsPath = path.join(budibaseTempDir(), "systemlogs")

function getFullPath(fileName: string) {
  return path.join(logsPath, fileName)
}

export function localFileDestination() {
  const outFile = rfs.createStream(logsFileName, {
    size: env.ROLLING_LOG_MAX_SIZE,
    path: logsPath,
    maxFiles: 1,
    immutable: true,
    history: "budibase-logs-history.txt",
    initialRotation: false,
  })

  return outFile
}

export function getLogReadStream() {
  const streams = []
  const historyFile = getFullPath(budibaseLogsHistoryFileName)
  if (fs.existsSync(historyFile)) {
    const fileContent = fs.readFileSync(historyFile, "utf-8")
    const historyFiles = fileContent.split("\n")
    for (const historyFile of historyFiles.filter(x => x)) {
      streams.push(fs.readFileSync(historyFile))
    }
  }

  streams.push(fs.readFileSync(getFullPath(logsFileName)))

  const combinedContent = Buffer.concat(streams)
  return combinedContent
}
