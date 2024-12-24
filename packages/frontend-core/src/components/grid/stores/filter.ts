import { get, derived, Writable, Readable } from "svelte/store"
import {
  FieldType,
  UIColumn,
  UIFilter,
  UIInlineFilter,
  UILogicalOperator,
} from "@budibase/types"
import { Store as StoreContext } from "."
import { memo } from "../../../utils/memo"

export interface FilterStore {
  filter: Writable<UIFilter>
  inlineFilters: Writable<UIInlineFilter[]>
}

export interface FilterDerivedStore {
  allFilters: Readable<UIFilter>
}

export type Store = FilterStore & FilterDerivedStore

export const createStores = (context: StoreContext): FilterStore => {
  const { props } = context

  // Initialise to default props
  const filter = memo(get(props).initialFilter)
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
      let allFilters = {
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
      allFilters.groups = [...allFilters.groups, ...$filter.groups]
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
    const inlineFilter: UIInlineFilter = {
      field: column.name,
      id: filterId,
      operator: "string",
      valueType: "value",
      type,
      value,
    }

    // Add overrides specific so the certain column type
    if (type === FieldType.NUMBER) {
      inlineFilter.value = parseFloat(value)
      inlineFilter.operator = "equal"
    } else if (type === FieldType.BIGINT) {
      inlineFilter.operator = "equal"
    } else if (type === FieldType.ARRAY) {
      inlineFilter.operator = "contains"
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
  initialFilter.subscribe(filter.set)
}
