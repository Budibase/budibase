import { derived, get, writable } from "svelte/store"
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

  // Quick access to all columns
  const allColumns = derived(
    [columns, stickyColumn],
    ([$columns, $stickyColumn]) => {
      let allCols = $columns || []
      if ($stickyColumn) {
        allCols = [...allCols, $stickyColumn]
      }
      return allCols
    }
  )

  // Derive if we have any normal columns
  const hasNonAutoColumn = derived(allColumns, $allColumns => {
    const normalCols = $allColumns.filter(column => {
      return !column.schema?.autocolumn
    })
    return normalCols.length > 0
  })

  return {
    allColumns,
    hasNonAutoColumn,
  }
}

export const createActions = context => {
  const { columns, datasource, schema } = context

  // Updates the width of all columns
  const changeAllColumnWidths = async width => {
    const $schema = get(schema)
    let mutations = {}
    Object.keys($schema).forEach(field => {
      mutations[field] = { width }
    })
    datasource.actions.addSchemaMutations(mutations)
    await datasource.actions.saveSchemaMutations()
  }

  return {
    columns: {
      ...columns,
      actions: {
        changeAllColumnWidths,
      },
    },
  }
}

export const initialise = context => {
  const {
    definition,
    columns,
    stickyColumn,
    allColumns,
    enrichedSchema,
    compact,
  } = context

  // Merge new schema fields with existing schema in order to preserve widths
  const processColumns = $enrichedSchema => {
    if (!$enrichedSchema) {
      columns.set([])
      stickyColumn.set(null)
      return
    }
    const $definition = get(definition)
    const $allColumns = get(allColumns)
    const $stickyColumn = get(stickyColumn)
    const $compact = get(compact)

    // Find primary display
    let primaryDisplay
    const candidatePD = $definition.primaryDisplay || $stickyColumn?.name
    if (candidatePD && $enrichedSchema[candidatePD]) {
      primaryDisplay = candidatePD
    }

    // Get field list
    let fields = []
    Object.keys($enrichedSchema).forEach(field => {
      if ($compact || field !== primaryDisplay) {
        fields.push(field)
      }
    })

    // Update columns, removing extraneous columns and adding missing ones
    columns.set(
      fields
        .map(field => {
          const fieldSchema = $enrichedSchema[field]
          const oldColumn = $allColumns?.find(x => x.name === field)
          return {
            name: field,
            label: fieldSchema.displayName || field,
            schema: fieldSchema,
            width: fieldSchema.width || oldColumn?.width || DefaultColumnWidth,
            visible: fieldSchema.visible ?? true,
            readonly: fieldSchema.readonly,
            order: fieldSchema.order ?? oldColumn?.order,
            primaryDisplay: field === primaryDisplay,
          }
        })
        .sort((a, b) => {
          // If we don't have a pinned column then primary display will be in
          // the normal columns list, and should be first
          if (a.name === primaryDisplay) {
            return -1
          } else if (b.name === primaryDisplay) {
            return 1
          }

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
    if ($compact || !primaryDisplay) {
      stickyColumn.set(null)
      return
    }
    const stickySchema = $enrichedSchema[primaryDisplay]
    const oldStickyColumn = $allColumns?.find(x => x.name === primaryDisplay)
    stickyColumn.set({
      name: primaryDisplay,
      label: stickySchema.displayName || primaryDisplay,
      schema: stickySchema,
      width: stickySchema.width || oldStickyColumn?.width || DefaultColumnWidth,
      visible: true,
      order: 0,
      left: GutterWidth,
      primaryDisplay: true,
    })
  }

  // Process columns when schema changes
  enrichedSchema.subscribe(processColumns)

  // Process columns when compact flag changes
  compact.subscribe(() => processColumns(get(enrichedSchema)))
}
