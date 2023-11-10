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
  const { columns, stickyColumn, datasource, definition, schema } = context

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
    let newSchema = cloneDeep(get(schema)) || {}

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
  const { definition, columns, stickyColumn, enrichedSchema } = context

  // Merge new schema fields with existing schema in order to preserve widths
  enrichedSchema.subscribe($enrichedSchema => {
    if (!$enrichedSchema) {
      columns.set([])
      stickyColumn.set(null)
      return
    }
    const $definition = get(definition)
    const $columns = get(columns)
    const $stickyColumn = get(stickyColumn)

    // Generate array of all columns to easily find pre-existing columns
    let allColumns = $columns || []
    if ($stickyColumn) {
      allColumns.push($stickyColumn)
    }

    // Find primary display
    let primaryDisplay
    const candidatePD = $definition.primaryDisplay || $stickyColumn?.name
    if (candidatePD && $enrichedSchema[candidatePD]) {
      primaryDisplay = candidatePD
    }

    // Get field list
    let fields = []
    Object.keys($enrichedSchema).forEach(field => {
      if (field !== primaryDisplay) {
        fields.push(field)
      }
    })

    // Update columns, removing extraneous columns and adding missing ones
    columns.set(
      fields
        .map(field => {
          const fieldSchema = $enrichedSchema[field]
          const oldColumn = allColumns?.find(x => x.name === field)
          return {
            name: field,
            label: fieldSchema.displayName || field,
            schema: fieldSchema,
            width: fieldSchema.width || oldColumn?.width || DefaultColumnWidth,
            visible: fieldSchema.visible ?? true,
            order: fieldSchema.order ?? oldColumn?.order,
          }
        })
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
    const stickySchema = $enrichedSchema[primaryDisplay]
    const oldStickyColumn = allColumns?.find(x => x.name === primaryDisplay)
    stickyColumn.set({
      name: primaryDisplay,
      label: stickySchema.displayName || primaryDisplay,
      schema: stickySchema,
      width: stickySchema.width || oldStickyColumn?.width || DefaultColumnWidth,
      visible: true,
      order: 0,
      left: GutterWidth,
    })
  })
}
