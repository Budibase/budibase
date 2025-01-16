import { get } from "svelte/store"
import BaseDataFetch, { DataFetchParams } from "./DataFetch"
import { utils } from "@budibase/shared-core"
import {
  InternalTable,
  SearchFilters,
  SearchUsersRequest,
  UserDatasource,
} from "@budibase/types"

interface UserFetchQuery {
  appId: string
  paginated: boolean
}

interface UserDefinition {
  schema?: Record<string, any> | null
  primaryDisplay?: string
}

export default class UserFetch extends BaseDataFetch<
  UserDatasource,
  UserDefinition,
  UserFetchQuery
> {
  constructor(opts: DataFetchParams<UserDatasource, UserFetchQuery>) {
    super({
      ...opts,
      datasource: {
        type: "user",
        tableId: InternalTable.USER_METADATA,
      },
    })
  }

  async determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: false,
      supportsPagination: true,
    }
  }

  async getDefinition() {
    return { schema: {} }
  }

  async getData() {
    const { limit, paginate } = this.options
    const { cursor, query } = get(this.store)

    // Convert old format to new one - we now allow use of the lucene format
    const { appId, paginated, ...rest } = query

    const finalQuery: SearchFilters = utils.isSupportedUserSearch(rest)
      ? rest
      : {}

    try {
      const opts: SearchUsersRequest = {
        bookmark: cursor ?? undefined,
        query: finalQuery ?? undefined,
        appId: appId,
        paginate: paginated || paginate,
        limit,
      }
      const res = await this.API.searchUsers(opts)
      return {
        rows: res?.data || [],
        hasNextPage: res?.hasNextPage || false,
        cursor: res?.nextPage || null,
      }
    } catch (error) {
      return {
        rows: [],
        hasNextPage: false,
        error,
      }
    }
  }
}
