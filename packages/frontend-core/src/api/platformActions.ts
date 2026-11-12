import type {
  FetchActionSessionEventsParams,
  FetchActionSessionEventsQuery,
  FetchActionSessionEventsResponse,
  FetchActionSessionsQuery,
  FetchActionSessionsResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface FetchActionSessionEventsOpts
  extends FetchActionSessionEventsParams,
    FetchActionSessionEventsQuery {}

export interface PlatformActionEndpoints {
  fetchActionSessions: (
    opts?: FetchActionSessionsQuery
  ) => Promise<FetchActionSessionsResponse>
  fetchActionSessionEvents: (
    opts: FetchActionSessionEventsOpts
  ) => Promise<FetchActionSessionEventsResponse>
}

const buildQuery = (
  values: Record<string, string | number | undefined>
): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      params.set(key, String(value))
    }
  }
  const query = params.toString()
  return query ? `?${query}` : ""
}

export const buildPlatformActionEndpoints = (
  API: BaseAPIClient
): PlatformActionEndpoints => ({
  fetchActionSessions: async (opts = {}) => {
    const query = buildQuery({
      env: opts.env,
      status: opts.status,
      limit: opts.limit,
      bookmark: opts.bookmark,
    })
    return await API.get({
      url: `/api/actions/sessions${query}`,
    })
  },

  fetchActionSessionEvents: async ({
    sourceType,
    sourceId,
    env,
    limit,
    bookmark,
  }) => {
    const query = buildQuery({ env, limit, bookmark })
    return await API.get({
      url: `/api/actions/sessions/${encodeURIComponent(sourceType)}/${encodeURIComponent(sourceId)}/events${query}`,
    })
  },
})
