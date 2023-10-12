import { get } from "svelte/store"
import DataFetch from "./DataFetch.js"
import { TableNames } from "../constants"
import { LuceneUtils } from "../utils"

export default class UserFetch extends DataFetch {
  constructor(opts) {
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

  async getData() {
    const { limit, paginate } = this.options
    const { cursor, query } = get(this.store)
    let finalQuery
    // convert old format to new one - we now allow use of the lucene format
    const { appId, paginated, ...rest } = query
    if (!LuceneUtils.hasFilters(query) && rest.email) {
      finalQuery = { string: { email: rest.email } }
    } else {
      finalQuery = rest
    }
    try {
      const opts = {
        bookmark: cursor,
        query: finalQuery,
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
