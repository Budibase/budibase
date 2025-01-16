import { get } from "svelte/store"
import BaseDataFetch, { DataFetchParams } from "./DataFetch"
import { GroupUserDatasource, InternalTable } from "@budibase/types"

interface GroupUserQuery {
  groupId: string
  emailSearch: string
}

interface GroupUserDefinition {
  schema?: Record<string, any> | null
  primaryDisplay?: string
}

export default class GroupUserFetch extends BaseDataFetch<
  GroupUserDatasource,
  GroupUserDefinition,
  GroupUserQuery
> {
  constructor(opts: DataFetchParams<GroupUserDatasource, GroupUserQuery>) {
    super({
      ...opts,
      datasource: {
        type: "groupUser",
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
