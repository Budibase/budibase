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

  const saveRow = async row => {
    const $datasource = get(datasource)
    row.tableId = $datasource?.tableId
    row._viewId = $datasource?.id
    return {
      ...(await API.saveRow(row, SuppressErrors)),
      _viewId: row._viewId,
    }
  }

  const deleteRows = async rows => {
    // Ensure we delete _viewId from rows as otherwise this throws a 500
    rows?.forEach(row => {
      delete row?._viewId
    })
    await API.deleteRows({
      tableId: get(datasource).id,
      rows,
    })
  }

  const getRow = () => {
    throw "Views don't support fetching individual rows"
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
        addRow: saveRow,
        updateRow: saveRow,
        deleteRows,
        getRow,
        isDatasourceValid,
      },
    },
  }
}

export const initialise = context => {
  const { definition, datasource, sort, rows, filter, subscribe } = context

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

  // When hidden we show columns, we need to refresh data in order to fetch
  // values for those columns
  subscribe("show-column", async () => {
    if (get(datasource)?.type !== "viewV2") {
      return
    }
    await rows.actions.refreshData()
  })
}
