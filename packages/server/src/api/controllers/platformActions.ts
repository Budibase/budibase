import type {
  FetchActionSessionEventsParams,
  FetchActionSessionEventsResponse,
  FetchActionSessionsResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"
import {
  parseActionSessionEventsQuery,
  parseActionSessionsQuery,
} from "../routes/utils/validators/platformActions"

export async function fetchActionSessions(
  ctx: UserCtx<void, FetchActionSessionsResponse>
) {
  const { env, status, bookmark, limit } = parseActionSessionsQuery(ctx.query)
  ctx.body = await sdk.platformActions.fetchSessions({
    environment: env,
    status,
    bookmark,
    limit,
  })
}

export async function fetchActionSessionEvents(
  ctx: UserCtx<
    void,
    FetchActionSessionEventsResponse,
    FetchActionSessionEventsParams
  >
) {
  const { sourceType, sourceId } = ctx.params
  const { env, bookmark, limit } = parseActionSessionEventsQuery(ctx.query)
  ctx.body = await sdk.platformActions.fetchSessionEvents({
    environment: env,
    sourceType,
    sourceId,
    bookmark,
    limit,
  })
}
