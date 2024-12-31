import { get, derived, Writable, Readable } from "svelte/store"
import {
  ArrayOperator,
  BasicOperator,
  FieldType,
  UIColumn,
  UILegacyFilter,
  UILogicalOperator,
  UISearchFilter,
} from "@budibase/types"
import { Store as StoreContext } from "."
import { memo } from "../../../utils/memo"

export interface FilterStore {
  filter: Writable<UISearchFilter | undefined>
  inlineFilters: Writable<UILegacyFilter[]>
}

export interface FilterDerivedStore {
  allFilters: Readable<UISearchFilter | undefined>
}

export type Store = FilterStore & FilterDerivedStore

export const createStores = (context: StoreContext): FilterStore => {
  const { props } = context

  // Initialise to default props
  const filter = memo(get(props).initialFilter ?? undefined)
  const inlineFilters = memo([])

  return {
    filter,
    inlineFilters,
  }
}

export const deriveStores = (context: StoreContext): FilterDerivedStore => {
  const { filter, inlineFilters } = context
  const allFilters = derived(
    [filter, inlineFilters],
    ([$filter, $inlineFilters]) => {
      // Just use filter prop if no inline filters
      if (!$inlineFilters?.length) {
        return $filter
      }
      const allFilters: UISearchFilter = {
        logicalOperator: UILogicalOperator.ALL,
        groups: [
          {
            logicalOperator: UILogicalOperator.ALL,
            filters: $inlineFilters,
          },
        ],
      }

      // Just use inline if no filter
      if (!$filter?.groups?.length) {
        return allFilters
      }
      // Join them together if both
      allFilters.groups = [...allFilters.groups!, ...$filter.groups]
      return allFilters
    }
  )

  return {
    allFilters,
  }
}

export const createActions = (context: StoreContext) => {
  const { filter, inlineFilters } = context

  const addInlineFilter = (column: UIColumn, value: string) => {
    const filterId = `inline-${column.name}`
    const type = column.schema.type
    const inlineFilter: UILegacyFilter = {
      field: column.name,
      id: filterId,
      operator: BasicOperator.STRING,
      valueType: "value",
      type,
      value,
    }

    // Add overrides specific so the certain column type
    if (type === FieldType.NUMBER) {
      inlineFilter.value = parseFloat(value)
      inlineFilter.operator = BasicOperator.EQUAL
    } else if (type === FieldType.BIGINT) {
      inlineFilter.operator = BasicOperator.EQUAL
    } else if (type === FieldType.ARRAY) {
      inlineFilter.operator = ArrayOperator.CONTAINS
    }

    inlineFilters.update($inlineFilters => {
      // Remove any existing inline filter for this column
      $inlineFilters = $inlineFilters?.filter(x => x.id !== filterId)

      // Add new one if a value exists
      if (value) {
        $inlineFilters.push(inlineFilter)
      }
      return $inlineFilters
    })
  }

  return {
    filter: {
      ...filter,
      actions: {
        addInlineFilter,
      },
    },
  }
}

export const initialise = (context: StoreContext) => {
  const { filter, initialFilter } = context

  // Reset filter when initial filter prop changes
  initialFilter.subscribe($initialFilter =>
    filter.set($initialFilter ?? undefined)
  )
}
