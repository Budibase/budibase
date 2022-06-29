import { DEFAULT_TIMESTAMP } from "./../index"
import { events } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { App } from "@budibase/types"

const getOldestCreatedAt = (allApps: App[]): string | undefined => {
  const timestamps = allApps
    .filter(app => !!app.createdAt)
    .map(app => app.createdAt as string)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (timestamps.length) {
    return timestamps[0]
  }
}

const getMonthTimestamp = (monthString: string): number => {
  const parts = monthString.split("-")
  const month = parseInt(parts[0]) - 1 // we already do +1 in month string calculation
  const year = parseInt(parts[1])

  // using 0 as the day in next month gives us last day in previous month
  const date = new Date(year, month + 1, 0).getTime()
  const now = new Date().getTime()

  if (date > now) {
    return now
  } else {
    return date
  }
}

export const backfill = async (allApps: App[]) => {
  const usage = await quotas.getQuotaUsage()

  const rows = usage.usageQuota.rows
  let timestamp: string | number = DEFAULT_TIMESTAMP

  const oldestAppTimestamp = getOldestCreatedAt(allApps)
  if (oldestAppTimestamp) {
    timestamp = oldestAppTimestamp
  }

  await events.rows.created(rows, timestamp)

  for (const [monthString, quotas] of Object.entries(usage.monthly)) {
    if (monthString === "current") {
      continue
    }
    const monthTimestamp = getMonthTimestamp(monthString)

    const queries = quotas.queries
    await events.query.run(queries, monthTimestamp)

    const automations = quotas.automations
    await events.automation.run(automations, monthTimestamp)
  }

  return usage
}
