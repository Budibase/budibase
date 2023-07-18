import os from "os"
import process from "process"
import { env } from "@budibase/backend-core"
import { GetDiagnosticsResponse, UserCtx } from "@budibase/types"

export async function systemDebugInfo(
  ctx: UserCtx<void, GetDiagnosticsResponse>
) {
  const { days, hours, minutes } = secondsToHMS(os.uptime())
  const totalMemory = convertBytes(os.totalmem())

  ctx.body = {
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
