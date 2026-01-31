import { context, db as dbCore } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { type GetWorkspaceHomeMetricsResponse } from "@budibase/types"

import { getQuotaMonthWindow } from "../../utilities/quotaMonthWindow"

const countUsersWithWorkspaceAccess = async (prodWorkspaceId: string) => {
  const globalDb = context.getGlobalDB()

  const selector = {
    $or: [
      { "builder.global": true },
      { "admin.global": true },
      { [`roles.${prodWorkspaceId}`]: { $exists: true } },
    ],
    _id: { $regex: "^us_" },
  }

  const limit = 1000
  let bookmark: string | undefined
  let total = 0

  while (true) {
    const resp = await globalDb.find({
      selector,
      fields: ["_id"],
      limit,
      bookmark,
    })

    total += resp.docs.length

    if (!resp.bookmark || resp.docs.length < limit) {
      break
    }

    bookmark = resp.bookmark
  }

  return total
}

export const getWorkspaceHomeMetrics = async (
  workspaceId: string
): Promise<GetWorkspaceHomeMetricsResponse> => {
  const prodWorkspaceId = dbCore.getProdWorkspaceID(workspaceId)
  const { periodStart, periodEnd, monthString } = getQuotaMonthWindow()

  const usersPromise = countUsersWithWorkspaceAccess(prodWorkspaceId).catch(
    err => {
      console.log(
        `Error fetching workspace user count for ${prodWorkspaceId}`,
        err
      )
      return 0
    }
  )

  const automationsPromise = quotas
    .getQuotaUsage()
    .then(usage => {
      return (
        usage.apps?.[prodWorkspaceId]?.monthly?.[monthString]?.automations ?? 0
      )
    })
    .catch(err => {
      console.log(
        `Error fetching automation quota usage for ${prodWorkspaceId} (${monthString})`,
        err
      )
      return 0
    })

  const [totalUsers, automationRunsThisMonth] = await Promise.all([
    usersPromise,
    automationsPromise,
  ])

  return {
    totalUsers,
    automationRunsThisMonth,
    agentActionsThisMonth: 0,
    periodStart,
    periodEnd,
  }
}
