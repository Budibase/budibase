import { get } from "svelte/store"
import DataFetch from "./DataFetch"
import { TableNames } from "../constants"
import { APIClient } from "../api/types"

interface GroupUserQuery {
  groupId: string
  emailSearch: string
}

interface GroupUserDatasource {
  tableId: TableNames.USERS
}

export default class GroupUserFetch extends DataFetch<
  GroupUserDatasource,
  {},
  GroupUserQuery
> {
  constructor(opts: { API: APIClient; query: GroupUserQuery }) {
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
        bookmark: cursor ?? undefined,
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
