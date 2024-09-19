import { writable, get, derived } from "svelte/store"
import { FieldType, FilterGroupLogicalOperator } from "@budibase/types"

export const createStores = context => {
  const { props } = context

  // Initialise to default props
  const filter = writable(get(props).initialFilter)
  const inlineFilters = writable([])

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
      const inlineFilterGroup = $inlineFilters?.length
        ? {
            logicalOperator: FilterGroupLogicalOperator.ALL,
            filters: [...($inlineFilters || [])],
          }
        : null

      return inlineFilterGroup
        ? {
            logicalOperator: FilterGroupLogicalOperator.ALL,
            groups: [...($filter?.groups || []), inlineFilterGroup],
          }
        : $filter
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
