import fs from "fs"
import path from "path"
import * as rfs from "rotating-file-stream"

import env from "../environment"
import { budibaseTempDir } from "../objectStore"

const logsFileName = `budibase.log`
const budibaseLogsHistoryFileName = "budibase-logs-history.txt"

const logsPath = path.join(budibaseTempDir(), "systemlogs")

function getFullPath(fileName: string) {
  return path.join(logsPath, fileName)
}

export function getSingleFileMaxSizeInfo(totalMaxSize: string) {
  const regex = /(\d+)([A-Za-z])/
  const match = totalMaxSize?.match(regex)
  if (!match) {
    console.warn(`totalMaxSize does not have a valid value`, {
      totalMaxSize,
    })
    return undefined
  }

  const size = +match[1]
  const unit = match[2]
  if (size === 1) {
    switch (unit) {
      case "B":
        return { size: `${size}B`, totalHistoryFiles: 1 }
      case "K":
        return { size: `${(size * 1000) / 2}B`, totalHistoryFiles: 1 }
      case "M":
        return { size: `${(size * 1000) / 2}K`, totalHistoryFiles: 1 }
      case "G":
        return { size: `${(size * 1000) / 2}M`, totalHistoryFiles: 1 }
      default:
        return undefined
    }
  }

  if (size % 2 === 0) {
    return { size: `${size / 2}${unit}`, totalHistoryFiles: 1 }
  }

  return { size: `1${unit}`, totalHistoryFiles: size - 1 }
}

export function localFileDestination() {
  const fileInfo = getSingleFileMaxSizeInfo(env.ROLLING_LOG_MAX_SIZE)
  const outFile = rfs.createStream(logsFileName, {
    // As we have a rolling size, we want to half the max size
    size: fileInfo?.size,
    path: logsPath,
    maxFiles: fileInfo?.totalHistoryFiles || 1,
    immutable: true,
    history: budibaseLogsHistoryFileName,
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
