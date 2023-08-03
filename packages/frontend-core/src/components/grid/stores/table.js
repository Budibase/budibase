import { get } from "svelte/store"

const SuppressErrors = true

export const createActions = context => {
  const { definition, API, datasource } = context

  const refreshDefinition = async () => {
    definition.set(await API.fetchTableDefinition(get(datasource).tableId))
  }

  const saveDefinition = async newDefinition => {
    await API.saveTable(newDefinition)
  }

  const saveRow = async row => {
    row.tableId = get(datasource)?.tableId
    return await API.saveRow(row, SuppressErrors)
  }

  const deleteRows = async rows => {
    await API.deleteRows({
      tableId: get(datasource).tableId,
      rows,
    })
  }

  return {
    table: {
      actions: {
        refreshDefinition,
        saveDefinition,
        addRow: saveRow,
        updateRow: saveRow,
        deleteRows,
      },
    },
  }
}

export const initialise = context => {
  const { datasource, fetch, filter, sort } = context

  // Update fetch when filter changes
  filter.subscribe($filter => {
    if (get(datasource)?.type === "table") {
      get(fetch)?.update({
        filter: $filter,
      })
    }
  })

  // Update fetch when sorting changes
  sort.subscribe($sort => {
    if (get(datasource)?.type === "table") {
      get(fetch)?.update({
        sortOrder: $sort.order,
        sortColumn: $sort.column,
      })
    }
  })
}
