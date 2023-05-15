import { get } from "svelte/store"
import DataFetch from "./DataFetch.js"
import { TableNames } from "../constants"

export default class GroupUserFetch extends DataFetch {
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
    const { query, cursor } = get(this.store)
    try {
      const res = await this.API.getGroupUsers({
        id: query.groupId,
        emailSearch: query.emailSearch,
        bookmark: cursor,
      })

      return {
        rows: res?.users || [],
        hasNextPage: res?.hasNextPage || false,
        cursor: res?.bookmark || null,
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
