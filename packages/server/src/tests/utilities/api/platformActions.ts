import type {
  FetchActionSessionEventsResponse,
  FetchActionSessionsResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

type ActionsQuery = Record<string, string | undefined>

export class PlatformActionsAPI extends TestAPI {
  fetchSessions = async (
    query: ActionsQuery = {},
    expectations?: Expectations
  ) => {
    return await this._get<FetchActionSessionsResponse>(
      "/api/actions/sessions",
      { query, expectations }
    )
  }

  fetchSessionEvents = async (
    { sourceType, sourceId }: { sourceType: string; sourceId: string },
    query: ActionsQuery,
    expectations?: Expectations
  ) => {
    return await this._get<FetchActionSessionEventsResponse>(
      `/api/actions/sessions/${sourceType}/${encodeURIComponent(sourceId)}/events`,
      { query, expectations }
    )
  }
}
