import { get } from "svelte/store"
import DataFetch from "./DataFetch.js"
import { TableNames } from "../constants"
import { QueryUtils } from "../utils"

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
    const { limit, paginate, tenantId } = this.options
    const { cursor, query } = get(this.store)
    let finalQuery
    // convert old format to new one - we now allow use of the lucene format
    const { appId, paginated, ...rest } = query
    if (!QueryUtils.hasFilters(query) && rest.email != null) {
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
      let tenantInfo
      try {
        tenantInfo = await this.API.getTenantInfo({ tenantId })
      } catch {
        tenantInfo = undefined
      }
      return {
        rows: res?.data || [],
        hasNextPage: res?.hasNextPage || false,
        cursor: res?.nextPage || null,
        tenantOwner: tenantInfo?.owner,
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
