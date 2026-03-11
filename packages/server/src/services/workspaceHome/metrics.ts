import { cache, context, users } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { type GetWorkspaceHomeMetricsResponse } from "@budibase/types"

import { getQuotaMonthWindow } from "../../utilities/quotaMonthWindow"

const METRICS_FRESH_TTL_MS = 90 * 1000
const METRICS_FAILURE_TTL_MS = 5 * 60 * 1000
const METRICS_RETENTION_TTL_SECONDS = 24 * 60 * 60
const METRICS_CACHE_KEY_PREFIX = "workspaceHome:metrics:v3"
const BUDIBASE_AI_TOKENS_PER_CREDIT = 1000

interface WorkspaceMetricsCacheEnvelope {
  value: GetWorkspaceHomeMetricsResponse
  expiresAt: number
}

const buildWorkspaceMetricsCacheKey = (tenantId: string) =>
  `${METRICS_CACHE_KEY_PREFIX}:${tenantId}`

const convertBudibaseAIUsageToCredits = (usage = 0) => {
  return Math.floor(usage / BUDIBASE_AI_TOKENS_PER_CREDIT)
}

const getDefaultMetrics = (): GetWorkspaceHomeMetricsResponse => {
  const { periodStart, periodEnd } = getQuotaMonthWindow()
  return {
    totalUsers: 0,
    operationsThisMonth: 0,
    budibaseAICreditsThisMonth: 0,
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

const computeWorkspaceHomeMetrics =
  async (): Promise<GetWorkspaceHomeMetricsResponse> => {
    const { periodStart, periodEnd } = getQuotaMonthWindow()

    const usersPromise = users.getUserCount()

    const quotaUsagePromise = quotas.getQuotaUsage().then(usage => {
      return {
        operationsThisMonth: usage.monthly?.current?.actions ?? 0,
        budibaseAICreditsThisMonth: convertBudibaseAIUsageToCredits(
          usage.monthly?.current?.budibaseAICredits
        ),
      }
    })

    const [totalUsers, quotaUsage] = await Promise.all([
      usersPromise,
      quotaUsagePromise,
    ])

    return {
      totalUsers,
      operationsThisMonth: quotaUsage.operationsThisMonth,
      budibaseAICreditsThisMonth: quotaUsage.budibaseAICreditsThisMonth,
      periodStart,
      periodEnd,
    }
  }

export const getWorkspaceHomeMetrics =
  async (): Promise<GetWorkspaceHomeMetricsResponse> => {
    const cacheKey = buildWorkspaceMetricsCacheKey(context.getTenantId())

    const envelope = await getCachedMetrics(cacheKey)

    if (envelope && envelope.expiresAt > Date.now()) {
      return envelope.value
    }

    try {
      const value = await computeWorkspaceHomeMetrics()
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
