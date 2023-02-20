import { App, BBContext } from "@budibase/types"
import { db as dbCore, context } from "@budibase/backend-core"
import os from "os"

export async function fetch(ctx: BBContext) {
  const allDatabases = await dbCore.getAllDbs()
  const devAppIDs = await dbCore.getDevAppIDs({ idsOnly: true })
  const prodAppIDs = await dbCore.getProdAppIDs({ idsOnly: true })
  const allAppIds = await dbCore.getAllApps({ idsOnly: true })

  var outputString = ""

  const freeMem = os.freemem()
  const totalMem = os.totalmem()
  const usedMem = totalMem - freeMem
  const uptime = os.uptime()

  // **** budibase_os_uptime ****
  outputString += convertToOpenMetrics(
    "budibase_os_uptime",
    "Time in seconds that the host operating system has been up",
    "counter",
    uptime
  )

  // **** budibase_os_free_mem ****
  outputString += convertToOpenMetrics(
    "budibase_os_free_mem",
    "Bytes of memory free for usage on the host operating system",
    "gauge",
    freeMem
  )

  // **** budibase_os_total_mem ****
  outputString += convertToOpenMetrics(
    "budibase_os_total_mem",
    "Total bytes of memory on the host operating system",
    "gauge",
    totalMem
  )

  // **** budibase_os_used_mem ****
  outputString += convertToOpenMetrics(
    "budibase_os_used_mem",
    "Total bytes of memory in use on the host operating system",
    "gauge",
    usedMem
  )

  // **** budibase_os_load1 ****
  outputString += convertToOpenMetrics(
    "budibase_os_load1",
    "Host operating system load average",
    "gauge",
    os.loadavg()[0]
  )

  // **** budibase_os_load5 ****
  outputString += convertToOpenMetrics(
    "budibase_os_load5",
    "Host operating system load average",
    "gauge",
    os.loadavg()[1]
  )
  // **** budibase_os_load15 ****
  outputString += convertToOpenMetrics(
    "budibase_os_load15",
    "Host operating system load average",
    "gauge",
    os.loadavg()[2]
  )

  // **** budibase_tenant_app_count ****
  outputString += convertToOpenMetrics(
    "budibase_tenant_app_count",
    "The number of apps created by a user",
    "gauge",
    allAppIds.length
  )

  // **** budibase_tenant_production_app_count ****
  outputString += convertToOpenMetrics(
    "budibase_tenant_production_app_count",
    "The number of apps a user has published",
    "gauge",
    prodAppIDs.length
  )

  // **** budibase_tenant_dev_app_count ****
  outputString += convertToOpenMetrics(
    "budibase_tenant_dev_app_count",
    "The number of apps a user has unpublished in development",
    "gauge",
    devAppIDs.length
  )

  // **** budibase_tenant_db_count ****
  outputString += convertToOpenMetrics(
    "budibase_tenant_db_count",
    "The number of couchdb databases including global tables such as _users",
    "gauge",
    allDatabases.length
  )

  ctx.body = outputString
}

export function convertToOpenMetrics(
  metricName: string,
  metricHelp: string,
  metricType: string,
  metricValue: number
) {
  return `
    # HELP ${metricName} ${metricHelp}.
    # TYPE ${metricName} ${metricType}
    ${metricName} ${metricValue}`
}

export default {
  fetch,
}
