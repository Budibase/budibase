import { get } from "svelte/store"
import DataFetch, { DataFetchParams } from "./DataFetch"
import { TableNames } from "../constants"
import { utils } from "@budibase/shared-core"
import {
  BasicOperator,
  SearchFilters,
  SearchUsersRequest,
} from "@budibase/types"

interface UserFetchQuery {
  appId: string
  paginated: boolean
}

interface UserDatasource {
  tableId: string
}

export default class UserFetch extends DataFetch<
  UserDatasource,
  {},
  UserFetchQuery
> {
  constructor(opts: DataFetchParams<UserDatasource, UserFetchQuery>) {
    super({
      ...opts,
      datasource: {
        tableId: TableNames.USERS,
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
      : { [BasicOperator.EMPTY]: { email: null } }

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
