import { cache, context, db as dbCore } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { type GetWorkspaceHomeMetricsResponse } from "@budibase/types"

import { getQuotaMonthWindow } from "../../utilities/quotaMonthWindow"

const METRICS_FRESH_TTL_MS = 10 * 60 * 1000
const METRICS_FAILURE_TTL_MS = 5 * 60 * 1000
const METRICS_RETENTION_TTL_SECONDS = 24 * 60 * 60
const METRICS_CACHE_KEY_PREFIX = "workspaceHome:metrics"

interface WorkspaceMetricsCacheEnvelope {
  value: GetWorkspaceHomeMetricsResponse
  expiresAt: number
}

const buildWorkspaceMetricsCacheKey = (prodWorkspaceId: string) =>
  `${METRICS_CACHE_KEY_PREFIX}:${prodWorkspaceId}`

const getDefaultMetrics = (): GetWorkspaceHomeMetricsResponse => {
  const { periodStart, periodEnd } = getQuotaMonthWindow()
  return {
    totalUsers: 0,
    automationRunsThisMonth: 0,
    agentActionsThisMonth: 0,
    periodStart,
    periodEnd,
  }
}

const getCachedMetrics = async (cacheKey: string) => {
  return (await cache
    .get(cacheKey)
    .catch(() => null)) as WorkspaceMetricsCacheEnvelope | null
}

const storeCachedMetrics = async (
  cacheKey: string,
  envelope: WorkspaceMetricsCacheEnvelope
) => {
  await cache
    .store(cacheKey, envelope, METRICS_RETENTION_TTL_SECONDS)
    .catch(() => null)
}

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

const computeWorkspaceHomeMetrics = async (
  prodWorkspaceId: string
): Promise<GetWorkspaceHomeMetricsResponse> => {
  const { periodStart, periodEnd, monthString } = getQuotaMonthWindow()

  const usersPromise = countUsersWithWorkspaceAccess(prodWorkspaceId)

  const automationsPromise = quotas.getQuotaUsage().then(usage => {
    return (
      usage.apps?.[prodWorkspaceId]?.monthly?.[monthString]?.automations ?? 0
    )
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

export const getWorkspaceHomeMetrics = async (
  workspaceId: string
): Promise<GetWorkspaceHomeMetricsResponse> => {
  const prodWorkspaceId = dbCore.getProdWorkspaceID(workspaceId)
  const cacheKey = buildWorkspaceMetricsCacheKey(prodWorkspaceId)

  const envelope = await getCachedMetrics(cacheKey)

  if (envelope && envelope.expiresAt > Date.now()) {
    return envelope.value
  }

  try {
    const value = await computeWorkspaceHomeMetrics(prodWorkspaceId)
    const nextEnvelope: WorkspaceMetricsCacheEnvelope = {
      value,
      expiresAt: Date.now() + METRICS_FRESH_TTL_MS,
    }

    await storeCachedMetrics(cacheKey, nextEnvelope)

    return value
  } catch {
    const value = envelope?.value || getDefaultMetrics()
    const fallbackEnvelope: WorkspaceMetricsCacheEnvelope = {
      value,
      expiresAt: Date.now() + METRICS_FAILURE_TTL_MS,
    }

    await storeCachedMetrics(cacheKey, fallbackEnvelope)

    return value
  }
}
