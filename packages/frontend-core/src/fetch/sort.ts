import { FieldType, SortOrder, SortType } from "@budibase/types"
import type { SortField, TableSchema } from "@budibase/types"

interface SortNormalizationOptions {
  sorts?: SortField[] | null
  sortColumn: string | null
  sortOrder: SortOrder
  sortType: SortType | null
}

const getSortType = (schema: TableSchema, field: string) => {
  const fieldSchema = schema[field]
  if (
    fieldSchema?.type === FieldType.NUMBER ||
    fieldSchema?.type === FieldType.BIGINT ||
    ("responseType" in fieldSchema &&
      fieldSchema.responseType === FieldType.NUMBER) ||
    ("calculationType" in fieldSchema && fieldSchema.calculationType)
  ) {
    return SortType.NUMBER
  }
  return SortType.STRING
}

export const normalizeSorts = (
  options: SortNormalizationOptions,
  schema: TableSchema,
  defaultSortColumn: string | null
) => {
  let normalizedSorts =
    options.sorts
      ?.filter(sortEntry => sortEntry?.field && schema[sortEntry.field])
      .map(sortEntry => ({
        ...sortEntry,
        order: (
          sortEntry.order || SortOrder.ASCENDING
        ).toLowerCase() as SortOrder,
        type: sortEntry.type || getSortType(schema, sortEntry.field),
      })) || []

  if (!normalizedSorts.length && options.sorts == null && options.sortColumn) {
    if (schema[options.sortColumn]) {
      normalizedSorts = [
        {
          field: options.sortColumn,
          order: (
            options.sortOrder || SortOrder.ASCENDING
          ).toLowerCase() as SortOrder,
          type: options.sortType || getSortType(schema, options.sortColumn),
        },
      ]
    }
  }

  if (!normalizedSorts.length && defaultSortColumn) {
    normalizedSorts = [
      {
        field: defaultSortColumn,
        order: SortOrder.ASCENDING,
        type: getSortType(schema, defaultSortColumn),
      },
    ]
  }

  return normalizedSorts
}
