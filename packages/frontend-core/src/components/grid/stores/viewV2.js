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
    return await API.viewV2.createRow(row, SuppressErrors)
  }

  const updateRow = async row => {
    const $datasource = get(datasource)
    const savedRow = await API.viewV2.updateRow(row, SuppressErrors)
    return {
      ...savedRow,
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

  return {
    viewV2: {
      actions: {
        refreshDefinition,
        saveDefinition,
        addRow,
        updateRow,
        deleteRows,
        getRow,
      },
    },
  }
}

export const initialise = context => {
  const { definition, datasource, sort, rows } = context

  // For views, keep sort state in line with the view definition
  definition.subscribe($definition => {
    if (!$definition || get(datasource)?.type !== "viewV2") {
      return
    }
    const $sort = get(sort)
    if (
      $definition.sort?.field !== $sort?.column ||
      $definition.sort?.order !== $sort?.order
    ) {
      sort.set({
        column: $definition.sort?.field,
        order: $definition.sort?.order,
      })
    }
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
}
