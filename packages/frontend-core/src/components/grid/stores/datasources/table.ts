import {
  Row,
  SaveRowRequest,
  SaveRowResponse,
  SaveTableRequest,
  SortOrder,
  UIDatasource,
} from "@budibase/types"
import { get } from "svelte/store"
import { Store as StoreContext } from ".."

const SuppressErrors = true

interface TableActions {
  table: {
    actions: {
      saveDefinition: (newDefinition: SaveTableRequest) => Promise<void>
      addRow: (row: SaveRowRequest) => Promise<SaveRowResponse>
      updateRow: (row: SaveRowRequest) => Promise<SaveRowResponse>
      deleteRows: (rows: (string | Row)[]) => Promise<void>
      getRow: (id: string) => Promise<Row>
      isDatasourceValid: (datasource: UIDatasource) => boolean
      canUseColumn: (name: string) => boolean
    }
  }
}

export type Store = TableActions

export const createActions = (context: StoreContext): TableActions => {
  const { API, datasource, columns } = context

  const saveDefinition = async (newDefinition: SaveTableRequest) => {
    await API.saveTable(newDefinition)
  }

  const saveRow = async (row: SaveRowRequest) => {
    row = {
      ...row,
      tableId: get(datasource)?.tableId,
    }
    return await API.saveRow(row, SuppressErrors)
  }

  const deleteRows = async (rows: (string | Row)[]) => {
    await API.deleteRows(get(datasource).tableId, rows)
  }

  const isDatasourceValid = (datasource: UIDatasource) => {
    return datasource?.type === "table" && !!datasource?.tableId
  }

  const getRow = async (id: any) => {
    const res = await API.searchTable(get(datasource).tableId, {
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

  const canUseColumn = (name: string) => {
    return get(columns).some(col => col.name === name)
  }

  return {
    table: {
      actions: {
        saveDefinition,
        addRow: saveRow,
        updateRow: saveRow,
        deleteRows,
        getRow,
        isDatasourceValid,
        canUseColumn,
      },
    },
  }
}

export const initialise = (context: StoreContext) => {
  const {
    datasource,
    fetch,
    filter,
    inlineFilters,
    allFilters,
    sort,
    table,
    initialFilter,
    initialSortColumn,
    initialSortOrder,
  } = context

  // Keep a list of subscriptions so that we can clear them when the datasource
  // config changes
  let unsubscribers: any[] = []

  // Observe datasource changes and apply logic for table datasources
  datasource.subscribe($datasource => {
    // Clear previous subscriptions
    unsubscribers?.forEach(unsubscribe => unsubscribe())
    unsubscribers = []
    if (!table.actions.isDatasourceValid($datasource)) {
      return
    }

    // Wipe state
    filter.set(get(initialFilter))
    inlineFilters.set([])
    sort.set({
      column: get(initialSortColumn),
      order: get(initialSortOrder) || SortOrder.ASCENDING,
    })

    // Update fetch when filter changes
    unsubscribers.push(
      allFilters.subscribe($allFilters => {
        // Ensure we're updating the correct fetch
        const $fetch = get(fetch)
        if ($fetch?.options?.datasource?.tableId !== $datasource.tableId) {
          return
        }
        $fetch.update({
          filter: $allFilters,
        })
      })
    )

    // Update fetch when sorting changes
    unsubscribers.push(
      sort.subscribe($sort => {
        // Ensure we're updating the correct fetch
        const $fetch = get(fetch)
        if ($fetch?.options?.datasource?.tableId !== $datasource.tableId) {
          return
        }
        $fetch.update({
          sortOrder: $sort.order || SortOrder.ASCENDING,
          sortColumn: $sort.column,
        })
      })
    )
  })
}
