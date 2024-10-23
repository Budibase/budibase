import { get, derived } from "svelte/store"
import { FieldType, UILogicalOperator } from "@budibase/types"
import { memo } from "../../../utils/memo"

export const createStores = context => {
  const { props } = context

  // Initialise to default props
  const filter = memo(get(props).initialFilter)
  const inlineFilters = memo([])

  return {
    filter,
    inlineFilters,
  }
}

export const deriveStores = context => {
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

export const createActions = context => {
  const { filter, inlineFilters } = context

  const addInlineFilter = (column, value) => {
    const filterId = `inline-${column.name}`
    const type = column.schema.type
    let inlineFilter = {
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

export const initialise = context => {
  const { filter, initialFilter } = context

  // Reset filter when initial filter prop changes
  initialFilter.subscribe(filter.set)
}
