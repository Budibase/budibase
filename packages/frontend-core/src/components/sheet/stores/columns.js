import { derived, get, writable } from "svelte/store"

export const DefaultColumnWidth = 200

export const createColumnsStores = context => {
  const { schema } = context
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
  schema.subscribe($schema => {
    if (!$schema) {
      columns.set([])
      stickyColumn.set(null)
      return
    }
    const currentColumns = get(columns)
    const currentStickyColumn = get(stickyColumn)

    // Get field list
    let fields = []
    Object.entries($schema || {}).forEach(([field, fieldSchema]) => {
      if (!fieldSchema.primaryDisplay) {
        fields.push(field)
      }
    })

    // Update columns, removing extraneous columns and adding missing ones
    columns.set(
      fields.map(field => {
        // Check if there is an existing column with this name so we can keep
        // the width setting
        let existing = currentColumns.find(x => x.name === field)
        if (!existing && currentStickyColumn?.name === field) {
          existing = currentStickyColumn
        }
        return {
          name: field,
          width: existing?.width || DefaultColumnWidth,
          schema: $schema[field],
          visible: existing?.visible ?? true,
        }
      })
    )

    // Update sticky column
    const primaryDisplay = Object.entries($schema).find(entry => {
      return entry[1].primaryDisplay
    })
    if (!primaryDisplay) {
      return
    }

    // Check if there is an existing column with this name so we can keep
    // the width setting
    let existing = currentColumns.find(x => x.name === primaryDisplay[0])
    if (!existing && currentStickyColumn?.name === primaryDisplay[0]) {
      existing = currentStickyColumn
    }
    stickyColumn.set({
      name: primaryDisplay[0],
      width: existing?.width || DefaultColumnWidth,
      left: 40,
      schema: primaryDisplay[1],
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
