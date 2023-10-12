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
    const filterId = `inline-${column}`
    let inlineFilter = {
      field: column.name,
      id: filterId,
      operator: "equal",
      type: column.schema.type,
      valueType: "value",
      value,
    }

    // Add overrides specific so the certain column type
    switch (column.schema.type) {
      case "string":
      case "formula":
      case "longform":
        inlineFilter.operator = "string"
        break
      case "number":
        inlineFilter.value = parseFloat(value)
        break
      case "array":
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
