import { get } from "svelte/store"
import DataFetch from "./DataFetch"
import { TableNames } from "../constants"
import { utils } from "@budibase/shared-core"
import {
  BasicOperator,
  SearchFilters,
  SearchUsersRequest,
  Table,
} from "@budibase/types"
import { APIClient } from "../api/types.js"

interface UserFetchQuery {
  appId: string
  paginated: boolean
}

export default class UserFetch extends DataFetch<
  { tableId: string },
  {},
  UserFetchQuery
> {
  constructor(opts: {
    API: APIClient
    datasource: Table
    options?: {}
    query: UserFetchQuery
  }) {
    super({
      ...opts,
      datasource: {
        tableId: TableNames.USERS,
      },
    })
  }

  determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: false,
      supportsPagination: true,
    }
  }

  async getDefinition() {
    return {
      schema: {},
    }
  }

  getSchema(_datasource: any, definition: Table | null) {
    return definition?.schema
  }

  async getData() {
    const { limit, paginate } = this.options
    const { cursor, query } = get(this.store)

    // Convert old format to new one - we now allow use of the lucene format
    const { appId, paginated, ...rest } = query || {}

    const finalQuery: SearchFilters = utils.isSupportedUserSearch(rest)
      ? rest
      : { [BasicOperator.EMPTY]: { email: true } }

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
