import { Ctx } from "@budibase/types"
import { users as userCore, db as dbCore } from "@budibase/backend-core"
import { quotas, licensing } from "@budibase/pro"

import os from "os"

export async function fetch(ctx: Ctx) {
  // *** OPERATING SYSTEM ***
  const freeMem = os.freemem()
  const totalMem = os.totalmem()
  const usedMem = totalMem - freeMem
  const uptime = os.uptime()

  // *** APPS ***
  const allDatabases = await dbCore.getAllDbs()
  const devAppIDs = await dbCore.getDevAppIDs()
  const prodAppIDs = await dbCore.getProdAppIDs()
  const allAppIds = await dbCore.getAllApps({ idsOnly: true })

  // *** USERS ***
  const usersObject = await userCore.getAllUserIds()

  // *** QUOTAS ***
  const usage = await quotas.getQuotaUsage()
  const license = await licensing.cache.getCachedLicense()
  const appsQuotaUsage = usage.usageQuota.apps
  const rowsQuotaUsage = usage.usageQuota.rows
  const pluginsQuotaUsage = usage.usageQuota.plugins
  const userGroupsQuotaUsage = usage.usageQuota.userGroups
  const queryQuotaUsage = usage.monthly.current.queries
  const automationsQuotaUsage = usage.monthly.current.automations
  const appsQuotaLimit = license.quotas.usage.static.apps.value
  const rowsQuotaLimit = license.quotas.usage.static.rows.value
  const userGroupsQuotaLimit = license.quotas.usage.static.userGroups.value
  const pluginsQuotaLimit = license.quotas.usage.static.plugins.value
  const queryQuotaLimit = license.quotas.usage.monthly.queries.value
  const automationsQuotaLimit = license.quotas.usage.monthly.automations.value

  // *** BUILD THE OUTPUT STRING ***
  var outputString = ""

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

  // **** budibase_tenant_user_count ****
  outputString += convertToOpenMetrics(
    "budibase_tenant_user_count",
    "The number of users created",
    "gauge",
    usersObject.length
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

  // **** budibase_quota_usage_apps ****
  outputString += convertToOpenMetrics(
    "budibase_quota_usage_apps",
    "The number of apps created",
    "gauge",
    appsQuotaUsage
  )

  // **** budibase_quota_limit_apps ****
  outputString += convertToOpenMetrics(
    "budibase_quota_limit_apps",
    "The limit on the number of apps that can be created",
    "gauge",
    appsQuotaLimit == -1 ? Number.MAX_SAFE_INTEGER : appsQuotaLimit
  )

  // **** budibase_quota_usage_rows ****
  outputString += convertToOpenMetrics(
    "budibase_quota_usage_rows",
    "The number of database rows used from the quota",
    "gauge",
    rowsQuotaUsage
  )

  // **** budibase_quota_limit_rows ****
  outputString += convertToOpenMetrics(
    "budibase_quota_limit_rows",
    "The limit on the number of rows that can be created",
    "gauge",
    rowsQuotaLimit == -1 ? Number.MAX_SAFE_INTEGER : rowsQuotaLimit
  )

  // **** budibase_quota_usage_plugins ****
  outputString += convertToOpenMetrics(
    "budibase_quota_usage_plugins",
    "The number of plugins in use",
    "gauge",
    pluginsQuotaUsage
  )

  // **** budibase_quota_limit_plugins ****
  outputString += convertToOpenMetrics(
    "budibase_quota_limit_plugins",
    "The limit on the number of plugins that can be created",
    "gauge",
    pluginsQuotaLimit == -1 ? Number.MAX_SAFE_INTEGER : pluginsQuotaLimit
  )

  // **** budibase_quota_usage_user_groups ****
  outputString += convertToOpenMetrics(
    "budibase_quota_usage_user_groups",
    "The number of user groups created",
    "gauge",
    userGroupsQuotaUsage
  )

  // **** budibase_quota_limit_user_groups ****
  outputString += convertToOpenMetrics(
    "budibase_quota_limit_user_groups",
    "The limit on the number of user groups that can be created",
    "gauge",
    userGroupsQuotaLimit == -1 ? Number.MAX_SAFE_INTEGER : userGroupsQuotaLimit
  )

  // **** budibase_quota_usage_queries ****
  outputString += convertToOpenMetrics(
    "budibase_quota_usage_queries",
    "The number of queries used in the current month",
    "gauge",
    queryQuotaUsage
  )

  // **** budibase_quota_limit_queries ****
  outputString += convertToOpenMetrics(
    "budibase_quota_limit_queries",
    "The limit on the number of queries for the current month",
    "gauge",
    queryQuotaLimit == -1 ? Number.MAX_SAFE_INTEGER : queryQuotaLimit
  )

  // **** budibase_quota_usage_automations ****
  outputString += convertToOpenMetrics(
    "budibase_quota_usage_automations",
    "The number of automations used in the current month",
    "gauge",
    automationsQuotaUsage
  )

  // **** budibase_quota_limit_automations ****
  outputString += convertToOpenMetrics(
    "budibase_quota_limit_automations",
    "The limit on the number of automations that can be created",
    "gauge",
    automationsQuotaLimit == -1
      ? Number.MAX_SAFE_INTEGER
      : automationsQuotaLimit
  )
  ctx.body = outputString
  ctx.set("Content-Type", "text/plain")
}

export function convertToOpenMetrics(
  metricName: string,
  metricHelp: string,
  metricType: string,
  metricValue: number
) {
  return `# HELP ${metricName} ${metricHelp}.
# TYPE ${metricName} ${metricType}
${metricName} ${metricValue}\n`
}

export default {
  fetch,
}
