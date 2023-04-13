import { derived, get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { GutterWidth, DefaultColumnWidth } from "../lib/constants"

export const createStores = () => {
  const columns = writable([])
  const stickyColumn = writable(null)

  // Derive an enriched version of columns with left offsets and indexes
  // automatically calculated
  const enrichedColumns = derived(
    columns,
    $columns => {
      let offset = 0
      return $columns.map(column => {
        const enriched = {
          ...column,
          left: offset,
        }
        if (column.visible) {
          offset += column.width
        }
        return enriched
      })
    },
    []
  )

  // Derived list of columns which have not been explicitly hidden
  const visibleColumns = derived(
    enrichedColumns,
    $columns => {
      return $columns.filter(col => col.visible)
    },
    []
  )

  return {
    columns: {
      ...columns,
      subscribe: enrichedColumns.subscribe,
    },
    stickyColumn,
    visibleColumns,
  }
}

export const deriveStores = context => {
  const { table, columns, stickyColumn, API, dispatch } = context

  // Merge new schema fields with existing schema in order to preserve widths
  table.subscribe($table => {
    const schema = $table?.schema
    if (!schema) {
      columns.set([])
      stickyColumn.set(null)
      return
    }
    const currentColumns = get(columns)
    const currentStickyColumn = get(stickyColumn)

    // Find primary display
    let primaryDisplay
    if ($table.primaryDisplay && schema[$table.primaryDisplay]) {
      primaryDisplay = $table.primaryDisplay
    }

    // Get field list
    let fields = []
    Object.keys(schema).forEach(field => {
      if (field !== primaryDisplay) {
        fields.push(field)
      }
    })

    // Update columns, removing extraneous columns and adding missing ones
    columns.set(
      fields
        .map(field => ({
          name: field,
          schema: schema[field],
          width: schema[field].width || DefaultColumnWidth,
          visible: schema[field].visible ?? true,
          order: schema[field].order,
        }))
        .sort((a, b) => {
          // Sort by order first
          const orderA = a.order
          const orderB = b.order
          if (orderA != null && orderB != null) {
            return orderA < orderB ? -1 : 1
          } else if (orderA != null) {
            return -1
          } else if (orderB != null) {
            return 1
          }

          // Then sort by auto columns
          const autoColA = a.schema?.autocolumn
          const autoColB = b.schema?.autocolumn
          if (autoColA === autoColB) {
            return 0
          }
          return autoColA ? 1 : -1
        })
    )

    // Update sticky column
    if (!primaryDisplay) {
      stickyColumn.set(null)
      return
    }

    // Check if there is an existing column with this name so we can keep
    // the width setting
    let existing = currentColumns.find(x => x.name === primaryDisplay)
    if (!existing && currentStickyColumn?.name === primaryDisplay) {
      existing = currentStickyColumn
    }
    stickyColumn.set({
      name: primaryDisplay,
      width: schema[primaryDisplay].width || DefaultColumnWidth,
      left: GutterWidth,
      schema: schema[primaryDisplay],
      idx: "sticky",
    })
  })

  // Updates the tables primary display column
  const changePrimaryDisplay = async column => {
    return await saveTable({
      ...get(table),
      primaryDisplay: column,
    })
  }

  // Persists column changes by saving metadata against table schema
  const saveChanges = async () => {
    const $columns = get(columns)
    const $table = get(table)
    const $stickyColumn = get(stickyColumn)
    const newSchema = cloneDeep($table.schema)

    // Build new updated table schema
    Object.keys(newSchema).forEach(column => {
      // Respect order specified by columns
      const index = $columns.findIndex(x => x.name === column)
      if (index !== -1) {
        newSchema[column].order = index
      } else {
        delete newSchema[column].order
      }

      // Copy over metadata
      if (column === $stickyColumn?.name) {
        newSchema[column].visible = true
        newSchema[column].width = $stickyColumn.width || DefaultColumnWidth
      } else {
        newSchema[column].visible = $columns[index]?.visible ?? true
        newSchema[column].width = $columns[index]?.width || DefaultColumnWidth
      }
    })

    await saveTable({ ...$table, schema: newSchema })
  }

  const saveTable = async newTable => {
    // Update local state
    table.set(newTable)

    // Broadcast event so that we can keep sync with external state
    // (e.g. data section which maintains a list of table definitions)
    dispatch("updatetable", newTable)

    // Update server
    await API.saveTable(newTable)
  }

  return {
    columns: {
      ...columns,
      actions: {
        saveChanges,
        changePrimaryDisplay,
      },
    },
  }
}
