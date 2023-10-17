import { writable, get, derived } from "svelte/store"
import { datasources, integrations } from "./"
import { API } from "api"
import { duplicateName } from "helpers/duplicate"

const sortQueries = queryList => {
  queryList.sort((q1, q2) => {
    return q1.name.localeCompare(q2.name)
  })
}

export function createQueriesStore() {
  const store = writable({
    list: [],
    selectedQueryId: null,
  })
  const derivedStore = derived(store, $store => ({
    ...$store,
    selected: $store.list?.find(q => q._id === $store.selectedQueryId),
  }))

  const fetch = async () => {
    const queries = await API.getQueries()
    sortQueries(queries)
    store.update(state => ({
      ...state,
      list: queries,
    }))
  }

  const save = async (datasourceId, query) => {
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
    store.update(state => {
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
        selectedQueryId: savedQuery._id,
      }
    })
    return savedQuery
  }

  const importQueries = async ({ data, datasourceId }) => {
    return await API.importQueries({
      datasourceId,
      data,
    })
  }

  const select = id => {
    store.update(state => ({
      ...state,
      selectedQueryId: id,
    }))
  }

  const preview = async query => {
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
  }

  const deleteQuery = async query => {
    await API.deleteQuery({
      queryId: query?._id,
      queryRev: query?._rev,
    })
    store.update(state => {
      state.list = state.list.filter(existing => existing._id !== query._id)
      return state
    })
  }

  const duplicate = async query => {
    let list = get(store).list
    const newQuery = { ...query }
    const datasourceId = query.datasourceId

    delete newQuery._id
    delete newQuery._rev
    newQuery.name = duplicateName(
      query.name,
      list.map(q => q.name)
    )

    return await save(datasourceId, newQuery)
  }

  const removeDatasourceQueries = datasourceId => {
    store.update(state => ({
      ...state,
      list: state.list.filter(table => table.datasourceId !== datasourceId),
    }))
  }

  return {
    subscribe: derivedStore.subscribe,
    fetch,
    init: fetch,
    select,
    save,
    import: importQueries,
    delete: deleteQuery,
    preview,
    duplicate,
    removeDatasourceQueries,
  }
}

export const queries = createQueriesStore()
