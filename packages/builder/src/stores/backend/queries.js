import { writable, get } from "svelte/store"
import { datasources, integrations, tables, views } from "./"
import api from "builderStore/api"
import { duplicateName } from "../../helpers/duplicate"

const sortQueries = queryList => {
  queryList.sort((q1, q2) => {
    return q1.name.localeCompare(q2.name)
  })
}

export function createQueriesStore() {
  const store = writable({ list: [], selected: null })
  const { subscribe, set, update } = store

  const actions = {
    init: async () => {
      const response = await api.get(`/api/queries`)
      const json = await response.json()
      set({ list: json, selected: null })
    },
    fetch: async () => {
      const response = await api.get(`/api/queries`)
      const json = await response.json()
      sortQueries(json)
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
        sortQueries(queries)
        return { list: queries, selected: json._id }
      })
      return json
    },
    import: async body => {
      const response = await api.post(`/api/queries/import`, body)

      if (response.status !== 200) {
        throw new Error(response.message)
      }

      return response.json()
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
    duplicate: async query => {
      let list = get(store).list
      const newQuery = { ...query }
      const datasourceId = query.datasourceId

      delete newQuery._id
      delete newQuery._rev
      newQuery.name = duplicateName(
        query.name,
        list.map(q => q.name)
      )

      actions.save(datasourceId, newQuery)
    },
  }

  return {
    subscribe,
    set,
    update,
    ...actions,
  }
}

export const queries = createQueriesStore()
