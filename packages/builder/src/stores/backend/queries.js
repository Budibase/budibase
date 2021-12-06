import { writable, get } from "svelte/store"
import { datasources, integrations, tables, views } from "./"
import api from "builderStore/api"

export function createQueriesStore() {
  const { subscribe, set, update } = writable({ list: [], selected: null })

  return {
    subscribe,
    set,
    update,
    init: async () => {
      const response = await api.get(`/api/queries`)
      const json = await response.json()
      set({ list: json, selected: null })
    },
    fetch: async () => {
      const response = await api.get(`/api/queries`)
      const json = await response.json()
      update(state => ({ ...state, list: json }))
      return json
    },
    save: async (datasourceId, query) => {
      const _integrations = get(integrations)
      const dataSource = get(datasources).list.filter(
        ds => ds._id === datasourceId
      )
      // check if readable attribute is found
      if (dataSource.length !== 0) {
        const integration = _integrations[dataSource[0].source]
        const readable = integration.query[query.queryVerb].readable
        if (readable) {
          query.readable = readable
        }
      }
      query.datasourceId = datasourceId
      const response = await api.post(`/api/queries`, query)
      if (response.status !== 200) {
        throw new Error("Failed saving query.")
      }
      const json = await response.json()
      update(state => {
        const currentIdx = state.list.findIndex(query => query._id === json._id)

        const queries = state.list

        if (currentIdx >= 0) {
          queries.splice(currentIdx, 1, json)
        } else {
          queries.push(json)
        }
        return { list: queries, selected: json._id }
      })
      return json
    },
    select: query => {
      update(state => ({ ...state, selected: query._id }))
      views.unselect()
      tables.unselect()
      datasources.unselect()
    },
    unselect: () => {
      update(state => ({ ...state, selected: null }))
    },
    preview: async query => {
      const response = await api.post("/api/queries/preview", {
        fields: query.fields,
        queryVerb: query.queryVerb,
        transformer: query.transformer,
        parameters: query.parameters.reduce(
          (acc, next) => ({
            ...acc,
            [next.name]: next.default,
          }),
          {}
        ),
        datasourceId: query.datasourceId,
      })

      if (response.status !== 200) {
        const error = await response.text()
        throw `Query error: ${error}`
      }

      const json = await response.json()
      // Assume all the fields are strings and create a basic schema from the
      // unique fields returned by the server
      const schema = {}
      for (let field of json.schemaFields) {
        schema[field] = "string"
      }
      return { ...json, schema, rows: json.rows || [] }
    },
    delete: async query => {
      const response = await api.delete(
        `/api/queries/${query._id}/${query._rev}`
      )
      update(state => {
        state.list = state.list.filter(existing => existing._id !== query._id)
        if (state.selected === query._id) {
          state.selected = null
        }

        return state
      })
      return response
    },
  }
}

export const queries = createQueriesStore()
