import { derived, get, writable } from "svelte/store"

export const createColumnsStores = context => {
  const { schema } = context
  const defaultWidth = 200
  const columns = writable([])
  const stickyColumn = writable(null)

  // Derive an enriched version of columns with left offsets and indexes
  // automatically calculated
  const enrichedColumns = derived(columns, $columns => {
    let offset = 0
    return $columns.map((column, idx) => {
      const enriched = {
        ...column,
        idx,
        left: offset,
      }
      offset += column.width
      return enriched
    })
  })

  // Merge new schema fields with existing schema in order to preserve widths
  schema.subscribe($schema => {
    const currentColumns = get(columns)
    if (!$schema) {
      columns.set([])
      return
    }

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
        const existing = currentColumns.find(x => x.name === field)
        return {
          name: field,
          width: existing?.width || defaultWidth,
          schema: $schema[field],
        }
      })
    )
  })

  schema.subscribe($schema => {
    const primaryDisplay = Object.entries($schema).find(entry => {
      return entry[1].primaryDisplay
    })
    if (!primaryDisplay) {
      stickyColumn.set(null)
      return
    }
    const existingWidth = get(stickyColumn)?.width
    const same = primaryDisplay[0] === get(stickyColumn)?.name
    stickyColumn.set({
      name: primaryDisplay[0],
      width: same ? existingWidth : defaultWidth,
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
  }
}
