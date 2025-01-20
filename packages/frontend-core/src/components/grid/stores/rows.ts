import { writable, derived, get, Writable, Readable } from "svelte/store"
import { DataFetch, fetchData } from "../../../fetch"
import { NewRowID, RowPageSize } from "../lib/constants"
import {
  generateRowID,
  getCellID,
  isGeneratedRowID,
  parseCellID,
} from "../lib/utils"
import { tick } from "svelte"
import { Helpers } from "@budibase/bbui"
import { sleep } from "../../../utils/utils"
import { FieldType, Row, UIRow } from "@budibase/types"
import { getRelatedTableValues } from "../../../utils"
import { Store as StoreContext } from "."

interface IndexedUIRow extends UIRow {
  __idx: number
}

interface RowStore {
  rows: Writable<UIRow[]>
  fetch: Writable<DataFetch | null>
  loaded: Writable<boolean>
  refreshing: Writable<boolean>
  loading: Writable<boolean>
  rowChangeCache: Writable<Record<string, Record<string, any>>>
  inProgressChanges: Writable<Record<string, number>>
  hasNextPage: Writable<boolean>
  error: Writable<string | null>
}

interface RowDerivedStore {
  rows: RowStore["rows"]
  rowLookupMap: Readable<Record<string, IndexedUIRow>>
}

interface RowActionStore {
  rows: RowStore["rows"] & {
    actions: {
      addRow: (params: {
        row: Row
        idx: number
        bubble: boolean
        notify: boolean
      }) => Promise<UIRow | undefined>
      duplicateRow: (row: UIRow) => Promise<UIRow | undefined>
      bulkDuplicate: (
        rowsToDupe: UIRow[],
        progressCallback: (progressPercentage: number) => void
      ) => Promise<UIRow[]>
      updateValue: (params: {
        rowId: string
        column: string
        value: any
        apply: boolean
      }) => Promise<void>
      applyRowChanges: (params: {
        rowId: string
        changes?: Record<string, any>
        updateState?: boolean
        handleErrors?: boolean
      }) => Promise<UIRow | undefined>
      deleteRows: (rowsToDelete: UIRow[]) => Promise<void>
      loadNextPage: () => void
      refreshRow: (id: string) => Promise<void>
      replaceRow: (id: string, row: UIRow | undefined) => void
      refreshData: () => Promise<void>
      cleanRow: (row: UIRow) => Row
      bulkUpdate: (
        changeMap: Record<string, Record<string, any>>,
        progressCallback: (progressPercentage: number) => void
      ) => Promise<void>
    }
  }
}

export type Store = RowStore & RowDerivedStore & RowActionStore

export const createStores = (): RowStore => {
  const rows = writable([])
  const loading = writable(false)
  const loaded = writable(false)
  const refreshing = writable(false)
  const rowChangeCache = writable({})
  const inProgressChanges = writable({})
  const hasNextPage = writable(false)
  const error = writable(null)
  const fetch = writable(null)

  // Mark loaded as true if we've ever stopped loading
  let hasStartedLoading = false
  loading.subscribe($loading => {
    if ($loading) {
      hasStartedLoading = true
    } else if (hasStartedLoading) {
      loaded.set(true)
    }
  })

  return {
    rows,
    fetch,
    loaded,
    refreshing,
    loading,
    rowChangeCache,
    inProgressChanges,
    hasNextPage,
    error,
  }
}

export const deriveStores = (context: StoreContext): RowDerivedStore => {
  const { rows, enrichedSchema } = context

  // Enrich rows with an index property and any pending changes
  const enrichedRows = derived(
    [rows, enrichedSchema],
    ([$rows, $enrichedSchema]) => {
      const customColumns = Object.values($enrichedSchema || {}).filter(
        f => f.related
      )
      return $rows.map<IndexedUIRow>((row, idx) => ({
        ...row,
        __idx: idx,
        ...customColumns.reduce<Record<string, string>>((map, column) => {
          const fromField = $enrichedSchema![column.related!.field]
          map[column.name] = getRelatedTableValues(
            row,
            { ...column, related: column.related! },
            fromField
          )
          return map
        }, {}),
      }))
    }
  )

  // Generate a lookup map to quick find a row by ID
  const rowLookupMap = derived(enrichedRows, $enrichedRows => {
    let map: Record<string, IndexedUIRow> = {}
    for (let i = 0; i < $enrichedRows.length; i++) {
      map[$enrichedRows[i]._id] = $enrichedRows[i]
    }
    return map
  })

  return {
    rows: {
      ...rows,
      subscribe: enrichedRows.subscribe,
    },
    rowLookupMap,
  }
}

export const createActions = (context: StoreContext): RowActionStore => {
  const {
    rows,
    rowLookupMap,
    definition,
    allFilters,
    loading,
    sort,
    datasource,
    API,
    scroll,
    validation,
    focusedCellId,
    columns,
    rowChangeCache,
    inProgressChanges,
    hasNextPage,
    error,
    notifications,
    fetch,
    hasBudibaseIdentifiers,
    refreshing,
    columnLookupMap,
  } = context
  const instanceLoaded = writable(false)

  // Local cache of row IDs to speed up checking if a row exists
  let rowCacheMap: Record<string, boolean> = {}

  // Reset everything when datasource changes
  let unsubscribe: (() => void) | null = null
  let lastResetKey: string | null = null
  datasource.subscribe(async $datasource => {
    // Unsub from previous fetch if one exists
    unsubscribe?.()
    unsubscribe = null
    fetch.set(null)
    instanceLoaded.set(false)
    loading.set(true)

    // Abandon if we don't have a valid datasource
    if (!datasource.actions.isDatasourceValid($datasource)) {
      error.set("Datasource is invalid")
      return
    }

    // Tick to allow other reactive logic to update stores when datasource changes
    // before proceeding. This allows us to wipe filters etc if needed.
    await tick()
    const $allFilters = get(allFilters)
    const $sort = get(sort)

    // Create new fetch model
    const newFetch = fetchData({
      API,
      datasource: $datasource,
      options: {
        filter: $allFilters,
        sortColumn: $sort.column,
        sortOrder: $sort.order,
        limit: RowPageSize,
        paginate: true,

        // Disable client side limiting, so that for queries and custom data
        // sources we don't impose fake row limits. We want all the data.
        clientSideLimiting: false,
      },
    })

    // Subscribe to changes of this fetch model
    unsubscribe = newFetch.subscribe(async $fetch => {
      if ($fetch.error) {
        // Present a helpful error to the user
        let message = "An unknown error occurred"
        if ($fetch.error.status === 403) {
          message = "You don't have access to this data"
        } else if ($fetch.error.message) {
          message = $fetch.error.message
        }
        error.set(message)
      } else if ($fetch.loaded && !$fetch.loading) {
        error.set(null)
        hasNextPage.set($fetch.hasNextPage)
        const $instanceLoaded = get(instanceLoaded)
        const resetRows = $fetch.resetKey !== lastResetKey
        const previousResetKey = lastResetKey
        lastResetKey = $fetch.resetKey

        // If resetting rows due to a datasource change, wipe data and wait for
        // derived stores to compute. This prevents stale data being passed
        // to cells when we save the new schema.
        if (!$instanceLoaded && previousResetKey) {
          rows.set([])
          await tick()
        }

        // Reset state properties when dataset changes
        if (!$instanceLoaded || resetRows) {
          definition.set($fetch.definition ?? null)
        }

        // Reset scroll state when data changes
        if (!$instanceLoaded) {
          // Reset both top and left for a new datasource ID
          instanceLoaded.set(true)
          scroll.set({ top: 0, left: 0 })
        } else if (resetRows) {
          // Only reset top scroll position when resetting rows
          scroll.update(state => ({ ...state, top: 0 }))
        }

        // Process new rows
        handleNewRows($fetch.rows, resetRows)

        // Notify that we're loaded
        loading.set(false)
      }

      // Update refreshing state
      refreshing.set($fetch.loading)
    })

    fetch.set(newFetch)
  })

  // Handles validation errors from the rows API and updates local validation
  // state, storing error messages against relevant cells
  const handleValidationError = (
    rowId: string,
    error:
      | string
      | {
          message?: string
          json: { validationErrors: Record<string, string | undefined> }
        }
  ) => {
    let errorString
    if (typeof error === "string") {
      errorString = error
    } else if (typeof error?.message === "string") {
      errorString = error.message
    }

    // If the server doesn't reply with a valid error, assume that the source
    // of the error is the focused cell's column
    if (
      typeof error !== "string" &&
      !error?.json?.validationErrors &&
      errorString
    ) {
      const { field: focusedColumn } = parseCellID(get(focusedCellId))
      if (focusedColumn) {
        error = {
          json: {
            validationErrors: {
              [focusedColumn]: error.message,
            },
          },
        }
      }
    }
    if (typeof error !== "string" && error?.json?.validationErrors) {
      // Normal validation errors
      const keys = Object.keys(error.json.validationErrors)
      const $columns = get(columns)

      // Filter out missing columns from columns that we have
      let erroredColumns = []
      let missingColumns = []
      for (let column of keys) {
        if (datasource.actions.canUseColumn(column)) {
          erroredColumns.push(column)
        } else {
          missingColumns.push(column)
        }
      }
      const { json } = error
      // Process errors for columns that we have
      for (let column of erroredColumns) {
        // Ensure we have a valid error to display
        let err = json.validationErrors[column]
        if (Array.isArray(err)) {
          err = err[0]
        }
        if (typeof err !== "string" || !err.length) {
          error = "Something went wrong"
        }
        // Set error against the cell
        validation.actions.setError(
          getCellID(rowId, column),
          Helpers.capitalise(err)
        )
        // Ensure the column is visible
        const index = $columns.findIndex(x => x.name === column)
        if (index !== -1 && !$columns[index].visible) {
          columns.update(state => {
            state[index].visible = true
            return state.slice()
          })
        }
      }

      // Notify about missing columns
      for (let column of missingColumns) {
        get(notifications).error(`${column} is required but is missing`)
      }
    } else {
      get(notifications).error(errorString || "An unknown error occurred")
    }
  }

  // Adds a new row
  const addRow = async ({
    row,
    idx,
    bubble = false,
    notify = true,
  }: {
    row: Row
    idx: number
    bubble: boolean
    notify: boolean
  }) => {
    try {
      const newRow = (await datasource.actions.addRow(row))!

      // Update state
      if (idx != null) {
        rowCacheMap[newRow._id] = true
        rows.update(state => {
          state.splice(idx, 0, newRow)
          return state.slice()
        })
      } else {
        handleNewRows([newRow])
      }

      if (notify) {
        get(notifications).success("Row created successfully")
      }
      return newRow
    } catch (error: any) {
      if (bubble) {
        throw error
      } else {
        handleValidationError(NewRowID, error)
        validation.actions.focusFirstRowError(NewRowID)
      }
    }
  }

  // Duplicates a row, inserting the duplicate row after the existing one
  const duplicateRow = async (row: UIRow) => {
    let clone = cleanRow(row)
    delete clone._id
    delete clone._rev
    try {
      const duped = await addRow({
        row: clone,
        idx: row.__idx + 1,
        bubble: true,
        notify: false,
      })
      get(notifications).success("Duplicated 1 row")
      return duped
    } catch (error: any) {
      handleValidationError(row._id, error)
      validation.actions.focusFirstRowError(row._id)
    }
  }

  // Duplicates multiple rows, inserting them after the last source row
  const bulkDuplicate = async (
    rowsToDupe: UIRow[],
    progressCallback: (progressPercentage: number) => void
  ) => {
    // Find index of last row
    const $rowLookupMap = get(rowLookupMap)
    const indices = rowsToDupe.map(row => $rowLookupMap[row._id!]?.__idx)
    const index = Math.max(...indices)
    const count = rowsToDupe.length

    // Clone and clean rows
    const clones = rowsToDupe.map(row => {
      let clone = cleanRow(row)
      delete clone._id
      delete clone._rev
      return clone
    })

    // Create rows
    let saved = []
    let failed = 0
    for (let i = 0; i < count; i++) {
      try {
        const newRow = (await datasource.actions.addRow(clones[i]))!
        saved.push(newRow)
        rowCacheMap[newRow._id] = true
        await sleep(50) // Small sleep to ensure we avoid rate limiting
      } catch (error) {
        failed++
        console.error("Duplicating row failed", error)
      }
      progressCallback?.((i + 1) / count)
    }

    // Add to state
    if (saved.length) {
      rows.update(state => {
        return state.toSpliced(index + 1, 0, ...saved)
      })
    }

    // Notify user
    if (failed) {
      get(notifications).error(`Failed to duplicate ${failed} of ${count} rows`)
    } else if (saved.length) {
      get(notifications).success(`Duplicated ${saved.length} rows`)
    }
    return saved
  }

  // Replaces a row in state with the newly defined row, handling updates,
  // addition and deletion
  const replaceRow = (id: string, row: UIRow | undefined) => {
    // Get index of row to check if it exists
    const $rows = get(rows)
    const $rowLookupMap = get(rowLookupMap)
    const index = $rowLookupMap[id]?.__idx

    // Process as either an update, addition or deletion
    if (row) {
      if (index != null) {
        // An existing row was updated
        rows.update(state => {
          state[index] = { ...row }
          return state
        })
      } else {
        // A new row was created
        handleNewRows([row])
      }
    } else if (index != null) {
      // A row was removed
      handleRemoveRows([$rows[index]])
    }
  }

  // Refreshes a specific row
  const refreshRow = async (id: string) => {
    try {
      const row = await datasource.actions.getRow(id)
      replaceRow(id, row!)
    } catch {
      // Do nothing - we probably just don't support refreshing individual rows
    }
  }

  // Refreshes all data
  const refreshData = async () => {
    await get(fetch)?.getInitialData()
  }

  // Checks if a changeset for a row actually mutates the row or not
  const changesAreValid = (row: UIRow, changes: Record<string, any>) => {
    const columns = Object.keys(changes || {})
    if (!row || !columns.length) {
      return false
    }

    // Ensure there is at least 1 column that creates a difference
    return columns.some(column => row[column] !== changes[column])
  }

  // Patches a row with some changes in local state, and returns whether a
  // valid pending change was made or not
  const stashRowChanges = (rowId: string, changes: Record<string, any>) => {
    const $rowLookupMap = get(rowLookupMap)
    const $columnLookupMap = get(columnLookupMap)
    const row = $rowLookupMap[rowId]

    // Coerce some values into the correct types
    for (let column of Object.keys(changes || {})) {
      const type = $columnLookupMap[column]?.schema?.type

      // Stringify objects
      if (type === FieldType.STRING || type == FieldType.LONGFORM) {
        if (changes[column] != null && typeof changes[column] !== "string") {
          changes[column] = JSON.stringify(changes[column])
        }
      }
    }

    // Check this is a valid change
    if (!row || !changesAreValid(row, changes)) {
      return false
    }

    // Add change to cache
    rowChangeCache.update(state => ({
      ...state,
      [rowId]: {
        ...state[rowId],
        ...changes,
      },
    }))
    return true
  }

  // Saves any pending changes to a row, as well as any additional changes
  // specified
  const applyRowChanges = async ({
    rowId,
    changes = null,
    updateState = true,
    handleErrors = true,
  }: {
    rowId: string
    changes?: Record<string, any> | null
    updateState?: boolean
    handleErrors?: boolean
  }) => {
    const $rowLookupMap = get(rowLookupMap)
    const row = $rowLookupMap[rowId]
    if (row == null) {
      return
    }
    let savedRow: UIRow | undefined = undefined

    // Save change
    try {
      // Increment change count for this row
      inProgressChanges.update(state => ({
        ...state,
        [rowId]: (state[rowId] || 0) + 1,
      }))

      // Update row
      const stashedChanges = get(rowChangeCache)[rowId]
      const newRow = { ...cleanRow(row), ...stashedChanges, ...changes }
      savedRow = (await datasource.actions.updateRow(newRow))!

      // Update row state after a successful change
      if (savedRow?._id) {
        if (updateState) {
          rows.update(state => {
            state[row.__idx] = savedRow!
            return state.slice()
          })
        }
      } else if (savedRow?.id) {
        // Handle users table edge case
        await refreshRow(savedRow.id)
      }

      // Wipe row change cache for any values which have been saved
      const liveChanges = get(rowChangeCache)[rowId]
      rowChangeCache.update(state => {
        Object.keys(stashedChanges || {}).forEach(key => {
          if (stashedChanges[key] === liveChanges?.[key]) {
            delete state[rowId][key]
          }
        })
        return state
      })
    } catch (error: any) {
      if (handleErrors) {
        handleValidationError(rowId, error)
        validation.actions.focusFirstRowError(rowId)
      }
    }

    // Decrement change count for this row
    inProgressChanges.update(state => ({
      ...state,
      [rowId]: (state[rowId] || 1) - 1,
    }))
    return savedRow
  }

  // Updates a value of a row
  const updateValue = async ({
    rowId,
    column,
    value,
    apply = true,
  }: {
    rowId: string
    column: string
    value: any
    apply: boolean
  }) => {
    const success = stashRowChanges(rowId, { [column]: value })
    if (success && apply) {
      await applyRowChanges({ rowId })
    }
  }

  const bulkUpdate = async (
    changeMap: Record<string, Record<string, any>>,
    progressCallback: (progressPercentage: number) => void
  ) => {
    const rowIds = Object.keys(changeMap || {})
    const count = rowIds.length
    if (!count) {
      return
    }

    // Update rows
    const $columnLookupMap = get(columnLookupMap)
    let updated = []
    let failed = 0
    for (let i = 0; i < count; i++) {
      const rowId = rowIds[i]
      let changes = changeMap[rowId] || {}

      // Strip any readonly fields from the change set
      for (let field of Object.keys(changes)) {
        const column = $columnLookupMap[field]
        if (columns.actions.isReadonly(column)) {
          delete changes[field]
        }
      }
      if (!Object.keys(changes).length) {
        progressCallback?.((i + 1) / count)
        continue
      }
      try {
        const updatedRow = await applyRowChanges({
          rowId,
          changes: changeMap[rowId],
          updateState: false,
          handleErrors: false,
        })
        if (updatedRow) {
          updated.push(updatedRow)
        } else {
          failed++
        }
        await sleep(50) // Small sleep to ensure we avoid rate limiting
      } catch (error) {
        failed++
        console.error("Failed to update row", error)
      }
      progressCallback?.((i + 1) / count)
    }

    // Update state
    if (updated.length) {
      const $rowLookupMap = get(rowLookupMap)
      rows.update(state => {
        for (let row of updated) {
          const index = $rowLookupMap[row._id].__idx
          state[index] = row
        }
        return state.slice()
      })
    }

    // Notify user
    if (failed) {
      const unit = `row${count === 1 ? "" : "s"}`
      get(notifications).error(`Failed to update ${failed} of ${count} ${unit}`)
    } else if (updated.length) {
      const unit = `row${updated.length === 1 ? "" : "s"}`
      get(notifications).success(`Updated ${updated.length} ${unit}`)
    }
  }

  // Deletes an array of rows
  const deleteRows = async (rowsToDelete: UIRow[]) => {
    if (!rowsToDelete?.length) {
      return
    }

    // Actually delete rows
    rowsToDelete.forEach(row => delete row.__idx)
    await datasource.actions.deleteRows(rowsToDelete)

    // Update state
    handleRemoveRows(rowsToDelete)
  }

  // Local handler to process new rows inside the fetch, and append any new
  // rows to state that we haven't encountered before
  const handleNewRows = (newRows: Row[], resetRows?: boolean) => {
    if (resetRows) {
      rowCacheMap = {}
    }
    let rowsToAppend = []
    let newRow
    const $hasBudibaseIdentifiers = get(hasBudibaseIdentifiers)
    for (let i = 0; i < newRows.length; i++) {
      newRow = newRows[i]

      // Ensure we have a unique _id.
      // We generate one for non DS+ where required, but trust that any existing
      // _id values are unique (e.g. Mongo)
      if (!$hasBudibaseIdentifiers && !newRow._id?.length) {
        newRow._id = generateRowID()
      }

      if (!rowCacheMap[newRow._id!]) {
        rowCacheMap[newRow._id!] = true
        rowsToAppend.push(newRow)
      }
    }
    if (resetRows) {
      rows.set(rowsToAppend as UIRow[])
    } else if (rowsToAppend.length) {
      rows.update(state => [...state, ...(rowsToAppend as UIRow[])])
    }
  }

  // Local handler to remove rows from state
  const handleRemoveRows = (rowsToRemove: UIRow[]) => {
    const deletedIds = rowsToRemove.map(row => row._id)

    // We deliberately do not remove IDs from the cache map as the data may
    // still exist inside the fetch, but we don't want to add it again
    rows.update(state => {
      return state.filter(row => !deletedIds.includes(row._id))
    })
  }

  // Loads the next page of data if available
  const loadNextPage = () => {
    get(fetch)?.nextPage()
  }

  // Cleans a row by removing any internal grid metadata from it.
  // Call this before passing a row to any sort of external flow.
  const cleanRow = (row: UIRow) => {
    let clone: Row = { ...row }
    delete clone.__idx
    delete clone.__metadata
    if (!get(hasBudibaseIdentifiers) && isGeneratedRowID(clone._id!)) {
      delete clone._id
    }
    return clone
  }

  return {
    rows: {
      ...rows,
      actions: {
        addRow,
        duplicateRow,
        bulkDuplicate,
        updateValue,
        applyRowChanges,
        deleteRows,
        loadNextPage,
        refreshRow,
        replaceRow,
        refreshData,
        cleanRow,
        bulkUpdate,
      },
    },
  }
}

export const initialise = (context: StoreContext) => {
  const {
    rowChangeCache,
    inProgressChanges,
    previousFocusedRowId,
    previousFocusedCellId,
    rows,
    validation,
  } = context

  // Wipe the row change cache when changing row
  previousFocusedRowId.subscribe(id => {
    if (id && !get(inProgressChanges)[id]) {
      if (Object.keys(get(rowChangeCache)[id] || {}).length) {
        rowChangeCache.update(state => {
          delete state[id]
          return state
        })
      }
    }
  })

  // Ensure any unsaved changes are saved when changing cell
  previousFocusedCellId.subscribe(async id => {
    if (!id) {
      return
    }
    let { rowId, field } = parseCellID(id)
    rowId = rowId!
    field = field!
    const hasChanges = field in (get(rowChangeCache)[rowId] || {})
    const hasErrors = validation.actions.rowHasErrors(rowId)
    const isSavingChanges = get(inProgressChanges)[rowId]
    if (rowId && !hasErrors && hasChanges && !isSavingChanges) {
      await rows.actions.applyRowChanges({ rowId })
    }
  })
}
