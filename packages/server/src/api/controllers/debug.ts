import os from "os"
import process from "process"
import { env, logging } from "@budibase/backend-core"
import {
  BugReportRequest,
  GetDiagnosticsResponse,
  UserCtx,
} from "@budibase/types"
import { createTempFolder } from "src/utilities/fileSystem"
import fs from "fs"
import { basename, join } from "path"
import archiver from "archiver"
import { csvToJson } from "./table"

export async function systemDebugInfo(
  ctx: UserCtx<void, GetDiagnosticsResponse>
) {
  ctx.body = getDiagnostics()
}

function getDiagnostics(): GetDiagnosticsResponse {
  const { days, hours, minutes } = secondsToHMS(os.uptime())
  const totalMemory = convertBytes(os.totalmem())

  return {
    budibaseVersion: env.VERSION,
    hosting: env.DEPLOYMENT_ENVIRONMENT,
    nodeVersion: process.version,
    platform: process.platform,
    cpuArch: process.arch,
    cpuCores: os.cpus().length,
    cpuInfo: os.cpus()[0].model,
    totalMemory: `${totalMemory.gb}GB`,
    uptime: `${days} day(s), ${hours} hour(s), ${minutes} minute(s)`,
  }
}

function secondsToHMS(seconds: number) {
  const MINUTE_IN_SECONDS = 60
  const HOUR_IN_SECONDS = 3600
  const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

  const minutes = Math.floor((seconds / MINUTE_IN_SECONDS) % 60)
  const hours = Math.floor((seconds / HOUR_IN_SECONDS) % 24)
  const days = Math.floor(seconds / DAY_IN_SECONDS)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

function convertBytes(bytes: number) {
  const kb = bytes / 1024
  const mb = kb / 1024
  const gb = mb / 1024

  return { gb, mb, kb }
}

class ZipBuilder {
  static inTmpDir(name: string): ZipBuilder {
    return new ZipBuilder(join(createTempFolder(), name))
  }

  private constructor(private dir: string) {
    fs.mkdirSync(dir, { recursive: true })
  }

  binary(path: string, content: Buffer) {
    const fd = fs.openSync(join(this.dir, path), "w")
    try {
      fs.writeFileSync(fd, content)
    } finally {
      fs.closeSync(fd)
    }
  }

  text(path: string, content: string) {
    this.binary(path, Buffer.from(content))
  }

  json(path: string, content: Record<string, any>) {
    this.text(path, JSON.stringify(content, null, 2))
  }

  async build(): Promise<string> {
    const archive = archiver("zip", { zlib: { level: 9 } })
    const stream = fs.createWriteStream(`${this.dir}.zip`)

    return new Promise((resolve, reject) => {
      archive
        .directory(this.dir, basename(this.dir))
        .on("error", err => reject(err))
        .pipe(stream)

      stream.on("close", () => resolve(`${this.dir}.zip`))
      archive.finalize()
    })
  }
}

export async function bugReport(ctx: UserCtx<BugReportRequest>) {
  const { browserUrl, clientApiCalls } = ctx.request.body

  const zip = ZipBuilder.inTmpDir("bug-report")

  if (logging.tail !== undefined) {
    zip.text("server.log", logging.tail!.readAll())
  }

  zip.json("user.json", ctx.user)
  zip.json("diagnostics.json", getDiagnostics())

  if (clientApiCalls) {
    zip.json("client-api-calls.json", clientApiCalls)
  }

  zip.json("meta.json", { browserUrl })

  const path = await zip.build()

  ctx.attachment("bug-report.zip")
  ctx.body = fs.createReadStream(path)
}
