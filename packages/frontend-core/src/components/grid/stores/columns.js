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

  // Checks if we have a certain column by name
  const hasColumn = column => {
    const $columns = get(columns)
    const $sticky = get(stickyColumn)
    return $columns.some(col => col.name === column) || $sticky?.name === column
  }

  return {
    columns: {
      ...columns,
      subscribe: enrichedColumns.subscribe,
      actions: {
        hasColumn,
      },
    },
    stickyColumn,
    visibleColumns,
  }
}

export const deriveStores = context => {
  const { table, columns, stickyColumn, API, dispatch, config } = context

  // Updates the tables primary display column
  const changePrimaryDisplay = async column => {
    return await saveTable({
      ...get(table),
      primaryDisplay: column,
    })
  }

  // Updates the width of all columns
  const changeAllColumnWidths = async width => {
    columns.update(state => {
      return state.map(col => ({
        ...col,
        width,
      }))
    })
    if (get(stickyColumn)) {
      stickyColumn.update(state => ({
        ...state,
        width,
      }))
    }
    await saveChanges()
  }

  // Derive if we have any normal columns
  const hasNonAutoColumn = derived(
    [columns, stickyColumn],
    ([$columns, $stickyColumn]) => {
      let allCols = $columns || []
      if ($stickyColumn) {
        allCols = [...allCols, $stickyColumn]
      }
      const normalCols = allCols.filter(column => {
        return !column.schema?.autocolumn
      })
      return normalCols.length > 0
    }
  )

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

    // Update server
    if (get(config).allowSchemaChanges) {
      await API.saveTable(newTable)
    }

    // Broadcast change to external state can be updated, as this change
    // will not be received by the builder websocket because we caused it ourselves
    dispatch("updatetable", newTable)
  }

  return {
    hasNonAutoColumn,
    columns: {
      ...columns,
      actions: {
        ...columns.actions,
        saveChanges,
        saveTable,
        changePrimaryDisplay,
        changeAllColumnWidths,
      },
    },
  }
}

export const initialise = context => {
  const { table, columns, stickyColumn, schemaOverrides, columnWhitelist } =
    context

  const schema = derived(
    [table, schemaOverrides, columnWhitelist],
    ([$table, $schemaOverrides, $columnWhitelist]) => {
      if (!$table?.schema) {
        return null
      }
      let newSchema = { ...$table?.schema }

      // Edge case to temporarily allow deletion of duplicated user
      // fields that were saved with the "disabled" flag set.
      // By overriding the saved schema we ensure only overrides can
      // set the disabled flag.
      // TODO: remove in future
      Object.keys(newSchema).forEach(field => {
        newSchema[field] = {
          ...newSchema[field],
          disabled: false,
        }
      })

      // Apply schema overrides
      Object.keys($schemaOverrides || {}).forEach(field => {
        if (newSchema[field]) {
          newSchema[field] = {
            ...newSchema[field],
            ...$schemaOverrides[field],
          }
        }
      })

      // Apply whitelist if specified
      if ($columnWhitelist?.length) {
        Object.keys(newSchema).forEach(key => {
          if (!$columnWhitelist.includes(key)) {
            delete newSchema[key]
          }
        })
      }

      return newSchema
    }
  )

  // Merge new schema fields with existing schema in order to preserve widths
  schema.subscribe($schema => {
    if (!$schema) {
      columns.set([])
      stickyColumn.set(null)
      return
    }
    const $table = get(table)

    // Find primary display
    let primaryDisplay
    if ($table.primaryDisplay && $schema[$table.primaryDisplay]) {
      primaryDisplay = $table.primaryDisplay
    }

    // Get field list
    let fields = []
    Object.keys($schema).forEach(field => {
      if (field !== primaryDisplay) {
        fields.push(field)
      }
    })

    // Update columns, removing extraneous columns and adding missing ones
    columns.set(
      fields
        .map(field => ({
          name: field,
          label: $schema[field].displayName || field,
          schema: $schema[field],
          width: $schema[field].width || DefaultColumnWidth,
          visible: $schema[field].visible ?? true,
          order: $schema[field].order,
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
    stickyColumn.set({
      name: primaryDisplay,
      label: $schema[primaryDisplay].displayName || primaryDisplay,
      schema: $schema[primaryDisplay],
      width: $schema[primaryDisplay].width || DefaultColumnWidth,
      visible: true,
      order: 0,
      left: GutterWidth,
    })
  })
}
