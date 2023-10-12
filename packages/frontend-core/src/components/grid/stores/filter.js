import { writable, get } from "svelte/store"

export const createStores = context => {
  const { props } = context

  // Initialise to default props
  const filter = writable(get(props).initialFilter)

  return {
    filter,
  }
}

export const createActions = context => {
  const { filter } = context

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
    if (type === "number") {
      inlineFilter.value = parseFloat(value)
      inlineFilter.operator = "equal"
    } else if (type === "array") {
      inlineFilter.operator = "contains"
    }

    // Add this filter
    filter.update($filter => {
      // Remove any existing inline filter
      if ($filter?.length) {
        $filter = $filter?.filter(x => x.id !== filterId)
      }
      // Add new one if a value exists
      if (value) {
        $filter = [...($filter || []), inlineFilter]
      }
      return $filter
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
