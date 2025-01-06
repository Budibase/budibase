import { derived, get, Readable, Writable, writable } from "svelte/store"
import { DefaultColumnWidth, GutterWidth } from "../lib/constants"
import { UIColumn } from "@budibase/types"
import { Store as StoreContext } from "."

interface ColumnStore {
  columns: Writable<UIColumn[]>
}

interface DerivedColumnStore {
  tableColumns: Readable<UIColumn[]>
  displayColumn: Readable<UIColumn | undefined>
  columnLookupMap: Readable<Record<string, UIColumn>>
  visibleColumns: Readable<UIColumn[]>
  scrollableColumns: Readable<UIColumn[]>
  hasNonAutoColumn: Readable<boolean>
}

interface ColumnActions {
  columns: ColumnStore["columns"] & {
    actions: {
      changeAllColumnWidths: (width: number) => Promise<void>
      isReadonly: (column: UIColumn) => boolean
    }
  }
}

export type Store = ColumnStore & DerivedColumnStore & ColumnActions

export const createStores = (): ColumnStore => {
  const columns = writable<UIColumn[]>([])

  // Enrich columns with metadata about their display position
  const enrichedColumns = derived(columns, $columns => {
    let offset = GutterWidth
    let idx = 0
    return $columns.map(col => {
      const enriched = {
        ...col,
        __idx: idx,
        __left: offset,
      }
      if (col.visible) {
        idx++
        offset += col.width ?? 0
      }
      return enriched
    })
  })

  return {
    columns: {
      ...columns,
      subscribe: enrichedColumns.subscribe,
    },
  }
}

export const deriveStores = (context: StoreContext): DerivedColumnStore => {
  const { columns } = context

  // Derive a lookup map for all columns by name
  const columnLookupMap = derived(columns, $columns => {
    let map: Record<string, UIColumn> = {}
    $columns.forEach(column => {
      map[column.name] = column
    })
    return map
  })

  // Derived list of columns which are direct part of the table
  const tableColumns = derived(columns, $columns => {
    return $columns.filter(col => !col.related)
  })

  // Derived list of columns which have not been explicitly hidden
  const visibleColumns = derived(columns, $columns => {
    return $columns.filter(col => col.visible)
  })

  // Split visible columns into their discrete types
  const displayColumn = derived(visibleColumns, $visibleColumns => {
    return $visibleColumns.find(col => col.primaryDisplay)
  })
  const scrollableColumns = derived(visibleColumns, $visibleColumns => {
    return $visibleColumns.filter(col => !col.primaryDisplay)
  })

  // Derive if we have any normal columns
  const hasNonAutoColumn = derived(columns, $columns => {
    const normalCols = $columns.filter(column => {
      return !column.schema?.autocolumn
    })
    return normalCols.length > 0
  })

  return {
    tableColumns,
    displayColumn,
    columnLookupMap,
    visibleColumns,
    scrollableColumns,
    hasNonAutoColumn,
  }
}

export const createActions = (context: StoreContext): ColumnActions => {
  const { columns, datasource } = context

  // Updates the width of all columns
  const changeAllColumnWidths = async (width: number) => {
    const $columns = get(columns)
    $columns.forEach(column => {
      const { related } = column
      const mutation = { width }
      if (!related) {
        datasource.actions.addSchemaMutation(column.name, mutation)
      } else {
        datasource.actions.addSubSchemaMutation(
          related.subField,
          related.field,
          mutation
        )
      }
    })
    await datasource.actions.saveSchemaMutations()
  }

  // Checks if a column is readonly
  const isReadonly = (column: UIColumn) => {
    if (!column?.schema) {
      return false
    }
    return (
      column.schema.autocolumn ||
      column.schema.disabled ||
      column.schema.type === "formula" ||
      column.schema.type === "ai" ||
      column.schema.readonly
    )
  }

  return {
    columns: {
      ...columns,
      actions: {
        changeAllColumnWidths,
        isReadonly,
      },
    },
  }
}

export const initialise = (context: StoreContext) => {
  const { definition, columns, displayColumn, enrichedSchema } = context

  // Merge new schema fields with existing schema in order to preserve widths
  const processColumns = ($enrichedSchema: any) => {
    const $definition = get(definition)
    if (!$enrichedSchema || !$definition) {
      columns.set([])
      return
    }

    const $displayColumn = get(displayColumn)

    // Find primary display
    let primaryDisplay: string
    const candidatePD = $definition.primaryDisplay || $displayColumn?.name
    if (candidatePD && $enrichedSchema[candidatePD]) {
      primaryDisplay = candidatePD
    }

    // Update columns, removing extraneous columns and adding missing ones
    columns.set(
      Object.keys($enrichedSchema)
        .map(field => {
          const fieldSchema = $enrichedSchema[field]
          const column: UIColumn = {
            type: fieldSchema.type,
            name: field,
            label: fieldSchema.displayName || field,
            schema: fieldSchema,
            width: fieldSchema.width || DefaultColumnWidth,
            visible: fieldSchema.visible ?? true,
            readonly: fieldSchema.readonly,
            order: fieldSchema.order,
            conditions: fieldSchema.conditions,
            related: fieldSchema.related,
            calculationType: fieldSchema.calculationType,
            __left: undefined as any, // TODO
            __idx: undefined as any, // TODO
          }
          // Override a few properties for primary display
          if (field === primaryDisplay) {
            column.order = 0
            column.primaryDisplay = true
          }
          return column
        })
        .sort((a, b) => {
          // Display column should always come first
          if (a.name === primaryDisplay) {
            return -1
          } else if (b.name === primaryDisplay) {
            return 1
          }

          // Then sort by order
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
  }

  // Process columns when schema changes
  enrichedSchema.subscribe(processColumns)
}
