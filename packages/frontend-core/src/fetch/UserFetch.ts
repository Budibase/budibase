import { get } from "svelte/store"
import DataFetch from "./DataFetch.js"
import { TableNames } from "../constants"
import { utils } from "@budibase/shared-core"
import { BasicOperator, Table } from "@budibase/types"
import { APIClient } from "../api/types.js"

export default class UserFetch extends DataFetch<{ tableId: string }, {}> {
  constructor(opts: { API: APIClient; datasource: Table; options?: {} }) {
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
    const { appId, paginated, ...rest } = query || ({} as any) // TODO
    const finalQuery = utils.isSupportedUserSearch(rest)
      ? query
      : { [BasicOperator.EMPTY]: { email: true } } // TODO: check

    try {
      const opts = {
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
