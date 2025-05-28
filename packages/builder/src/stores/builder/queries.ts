import { derived, get, Writable } from "svelte/store"
import { datasources } from "./datasources"
import { integrations } from "./integrations"
import { API } from "@/api"
import { duplicateName } from "@/helpers/duplicate"
import { DerivedBudiStore } from "@/stores/BudiStore"
import {
  Query,
  QueryPreview,
  PreviewQueryResponse,
  SaveQueryRequest,
  ImportRestQueryRequest,
  QuerySchema,
} from "@budibase/types"

const sortQueries = (queryList: Query[]) => {
  queryList.sort((q1, q2) => {
    return q1.name.localeCompare(q2.name)
  })
}

interface BuilderQueryStore {
  list: Query[]
  selectedQueryId: string | null
}

interface DerivedQueryStore extends BuilderQueryStore {
  selected?: Query
}

export class QueryStore extends DerivedBudiStore<
  BuilderQueryStore,
  DerivedQueryStore
> {
  constructor() {
    const makeDerivedStore = (store: Writable<BuilderQueryStore>) => {
      return derived(store, ($store): DerivedQueryStore => {
        return {
          list: $store.list,
          selectedQueryId: $store.selectedQueryId,
          selected: $store.list?.find(q => q._id === $store.selectedQueryId),
        }
      })
    }

    super(
      {
        list: [],
        selectedQueryId: null,
      },
      makeDerivedStore
    )

    this.select = this.select.bind(this)
  }

  async fetch() {
    const queries = await API.getQueries()
    sortQueries(queries)
    this.store.update(state => ({
      ...state,
      list: queries,
    }))
  }

  async save(datasourceId: string, query: SaveQueryRequest) {
    const _integrations = get(integrations)
    const dataSource = get(datasources).list.filter(
      ds => ds._id === datasourceId
    )
    // Check if readable attribute is found
    if (dataSource.length !== 0) {
      const integration = _integrations[dataSource[0].source]
      const readable = integration.query[query.queryVerb].readable
      if (readable) {
        query.readable = readable
      }
    }
    query.datasourceId = datasourceId
    const savedQuery = await API.saveQuery(query)
    this.store.update(state => {
      const idx = state.list.findIndex(query => query._id === savedQuery._id)
      const queries = state.list
      if (idx >= 0) {
        queries.splice(idx, 1, savedQuery)
      } else {
        queries.push(savedQuery)
      }
      sortQueries(queries)
      return {
        list: queries,
        selectedQueryId: savedQuery._id || null,
      }
    })
    return savedQuery
  }

  async importQueries(data: ImportRestQueryRequest) {
    return await API.importQueries(data)
  }

  select(id: string | null) {
    this.store.update(state => ({
      ...state,
      selectedQueryId: id,
    }))
  }

  async preview(query: QueryPreview): Promise<PreviewQueryResponse> {
    const result = await API.previewQuery(query)
    // Assume all the fields are strings and create a basic schema from the
    // unique fields returned by the server
    const schema: Record<string, QuerySchema> = {}
    for (let [field, metadata] of Object.entries(result.schema)) {
      schema[field] = (metadata as QuerySchema) || { type: "string" }
    }
    return { ...result, schema, rows: result.rows || [] }
  }

  async delete(query: Query) {
    if (!query._id || !query._rev) {
      throw new Error("Query ID or Revision is missing")
    }
    await API.deleteQuery(query._id, query._rev)
    this.store.update(state => ({
      ...state,
      list: state.list.filter(existing => existing._id !== query._id),
    }))
  }

  async duplicate(query: Query) {
    let list = get(this.store).list
    const newQuery = { ...query }
    const datasourceId = query.datasourceId

    delete newQuery._id
    delete newQuery._rev
    newQuery.name = duplicateName(
      query.name,
      list.map(q => q.name)
    )

    return await this.save(datasourceId, newQuery)
  }

  removeDatasourceQueries(datasourceId: string) {
    this.store.update(state => ({
      ...state,
      list: state.list.filter(table => table.datasourceId !== datasourceId),
    }))
  }

  init = this.fetch
}

export const queries = new QueryStore()
