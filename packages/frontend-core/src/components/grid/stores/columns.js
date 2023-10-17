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
  const { columns, stickyColumn } = context

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

  return {
    hasNonAutoColumn,
  }
}

export const createActions = context => {
  const { columns, stickyColumn, datasource, definition } = context

  // Updates the datasources primary display column
  const changePrimaryDisplay = async column => {
    return await datasource.actions.saveDefinition({
      ...get(definition),
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

  // Persists column changes by saving metadata against datasource schema
  const saveChanges = async () => {
    const $columns = get(columns)
    const $definition = get(definition)
    const $stickyColumn = get(stickyColumn)
    const newSchema = cloneDeep($definition.schema)

    // Build new updated datasource schema
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

    await datasource.actions.saveDefinition({
      ...$definition,
      schema: newSchema,
    })
  }

  return {
    columns: {
      ...columns,
      actions: {
        saveChanges,
        changePrimaryDisplay,
        changeAllColumnWidths,
      },
    },
  }
}

export const initialise = context => {
  const { definition, columns, stickyColumn, schema } = context

  // Merge new schema fields with existing schema in order to preserve widths
  schema.subscribe($schema => {
    if (!$schema) {
      columns.set([])
      stickyColumn.set(null)
      return
    }
    const $definition = get(definition)

    // Find primary display
    let primaryDisplay
    if ($definition.primaryDisplay && $schema[$definition.primaryDisplay]) {
      primaryDisplay = $definition.primaryDisplay
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
