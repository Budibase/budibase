import { get } from "svelte/store"
import DataFetch from "./DataFetch.js"
import { TableNames } from "../constants"

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
    const { cursor, query } = get(this.store)
    try {
      // "query" normally contains a lucene query, but users uses a non-standard
      // search endpoint so we use query uniquely here
      const res = await this.API.searchUsers({
        page: cursor,
        email: query.email,
        appId: query.appId,
      })
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
