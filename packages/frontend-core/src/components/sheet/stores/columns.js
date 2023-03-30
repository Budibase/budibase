import { derived, get, writable } from "svelte/store"

export const DefaultColumnWidth = 200

export const createColumnsStores = context => {
  const { table, gutterWidth } = context
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
        .map(field => {
          // Check if there is an existing column with this name so we can keep
          // the width setting
          let existing = currentColumns.find(x => x.name === field)
          if (!existing && currentStickyColumn?.name === field) {
            existing = currentStickyColumn
          }
          return {
            name: field,
            width: existing?.width || DefaultColumnWidth,
            schema: schema[field],
            visible: existing?.visible ?? true,
          }
        })
        .sort((a, b) => {
          // Sort columns to put auto columns last
          let autoColA = a.schema?.autocolumn
          let autoColB = b.schema?.autocolumn
          if (autoColA === autoColB) {
            return 0
          }
          return autoColA ? 1 : -1
        })
    )

    // Update sticky column
    if (!primaryDisplay) {
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
      width: existing?.width || DefaultColumnWidth,
      left: gutterWidth,
      schema: schema[primaryDisplay],
      idx: "sticky",
    })
  })

  return {
    columns: {
      ...columns,
      subscribe: enrichedColumns.subscribe,
    },
    stickyColumn,
    visibleColumns,
  }
}
