import { get } from "svelte/store"

const SuppressErrors = true

export const createActions = context => {
  const { definition, API, datasource } = context

  const refreshDefinition = async () => {
    const $datasource = get(datasource)
    if (!$datasource) {
      definition.set(null)
      return
    }
    const table = await API.fetchTableDefinition($datasource.tableId)
    const view = Object.values(table?.views || {}).find(
      view => view.id === $datasource.id
    )
    definition.set(view)
  }

  const saveDefinition = async newDefinition => {
    await API.viewV2.update(newDefinition)
  }

  const addRow = async row => {
    const $datasource = get(datasource)
    row.tableId = $datasource?.tableId
    row._viewId = $datasource?.id
    return {
      ...await API.saveRow(row, SuppressErrors),
      _viewId: row._viewId
    }
  }

  const updateRow = async row => {
    const $datasource = get(datasource)
    return {
      ...await API.patchRow(row, SuppressErrors),
      _viewId: $datasource.id,
    }
  }

  const deleteRows = async rows => {
    await API.viewV2.deleteRows({
      viewId: get(datasource).id,
      rows,
    })
  }

  // TODO: update in future. We can't depend on having table read access.
  const getRow = async id => {
    const res = await API.searchTable({
      tableId: get(datasource).tableId,
      limit: 1,
      query: {
        equal: {
          _id: id,
        },
      },
      paginate: false,
    })
    return res?.rows?.[0]
  }

  const isDatasourceValid = datasource => {
    return (
      datasource?.type === "viewV2" && datasource?.id && datasource?.tableId
    )
  }

  return {
    viewV2: {
      actions: {
        refreshDefinition,
        saveDefinition,
        addRow,
        updateRow,
        deleteRows,
        getRow,
        isDatasourceValid,
      },
    },
  }
}

export const initialise = context => {
  const { definition, datasource, sort, rows, filter } = context

  // Keep sort and filter state in line with the view definition
  definition.subscribe($definition => {
    if (!$definition || get(datasource)?.type !== "viewV2") {
      return
    }
    sort.set({
      column: $definition.sort?.field,
      order: $definition.sort?.order,
    })
    filter.set($definition.query || [])
  })

  // When sorting changes, ensure view definition is kept up to date
  sort.subscribe(async $sort => {
    const $view = get(definition)
    if (!$view || get(datasource)?.type !== "viewV2") {
      return
    }
    if (
      $sort?.column !== $view.sort?.field ||
      $sort?.order !== $view.sort?.order
    ) {
      await datasource.actions.saveDefinition({
        ...$view,
        sort: {
          field: $sort.column,
          order: $sort.order,
        },
      })
      await rows.actions.refreshData()
    }
  })

  // When filters change, ensure view definition is kept up to date
  filter.subscribe(async $filter => {
    const $view = get(definition)
    if (!$view || get(datasource)?.type !== "viewV2") {
      return
    }
    if (JSON.stringify($filter) !== JSON.stringify($view.query)) {
      await datasource.actions.saveDefinition({
        ...$view,
        query: $filter,
      })
      await rows.actions.refreshData()
    }
  })
}
