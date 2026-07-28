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

const normalizeSortOrder = (order?: SortOrder) =>
  order?.toLowerCase() === SortOrder.DESCENDING
    ? SortOrder.DESCENDING
    : SortOrder.ASCENDING

export const normalizeSorts = (
  options: SortNormalizationOptions,
  schema: TableSchema,
  defaultSortColumn: string | null
): SortField[] => {
  let normalizedSorts: SortField[] =
    options.sorts
      ?.filter(sortEntry => sortEntry?.field && schema[sortEntry.field])
      .map(
        sortEntry =>
          ({
            ...sortEntry,
            order: normalizeSortOrder(sortEntry.order),
            type: sortEntry.type || getSortType(schema, sortEntry.field),
          }) satisfies SortField
      ) || []

  if (!normalizedSorts.length && options.sorts == null && options.sortColumn) {
    if (schema[options.sortColumn]) {
      normalizedSorts = [
        {
          field: options.sortColumn,
          order: normalizeSortOrder(options.sortOrder),
          type: options.sortType || getSortType(schema, options.sortColumn),
        } satisfies SortField,
      ]
    }
  }

  if (!normalizedSorts.length && defaultSortColumn) {
    normalizedSorts = [
      {
        field: defaultSortColumn,
        order: SortOrder.ASCENDING,
        type: getSortType(schema, defaultSortColumn),
      } satisfies SortField,
    ]
  }

  return normalizedSorts
}
