import { writable, get } from "svelte/store"
import { datasources, integrations, tables, views } from "./"
import { API } from "api"
import { duplicateName } from "helpers/duplicate"

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
      const queries = await API.getQueries()
      set({
        list: queries,
        selected: null,
      })
    },
    fetch: async () => {
      const queries = await API.getQueries()
      sortQueries(queries)
      update(state => ({
        ...state,
        list: queries,
      }))
    },
    save: async (datasourceId, query) => {
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
      update(state => {
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
          selected: savedQuery._id,
        }
      })
      return savedQuery
    },
    import: async ({ data, datasourceId }) => {
      return await API.importQueries({
        datasourceId,
        data,
      })
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
      const parameters = query.parameters.reduce(
        (acc, next) => ({
          ...acc,
          [next.name]: next.default,
        }),
        {}
      )
      const result = await API.previewQuery({
        ...query,
        parameters,
      })
      // Assume all the fields are strings and create a basic schema from the
      // unique fields returned by the server
      const schema = {}
      for (let [field, type] of Object.entries(result.schemaFields)) {
        schema[field] = type || "string"
      }
      return { ...result, schema, rows: result.rows || [] }
    },
    delete: async query => {
      await API.deleteQuery({
        queryId: query?._id,
        queryRev: query?._rev,
      })
      update(state => {
        state.list = state.list.filter(existing => existing._id !== query._id)
        if (state.selected === query._id) {
          state.selected = null
        }
        return state
      })
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

      return actions.save(datasourceId, newQuery)
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
