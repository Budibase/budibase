import { get, writable } from "svelte/store"

export const createColumnsStores = context => {
  const { schema } = context
  const defaultWidth = 200
  const columns = writable([])
  const stickyColumn = writable(null)

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
    let offset = 0
    columns.set(
      fields.map((field, idx) => {
        const existing = currentColumns.find(x => x.name === field)
        const newCol = {
          idx,
          name: field,
          width: existing?.width || defaultWidth,
          left: offset,
          schema: $schema[field],
        }
        offset += newCol.width
        return newCol
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
    })
  })

  return {
    columns,
    stickyColumn,
  }
}
