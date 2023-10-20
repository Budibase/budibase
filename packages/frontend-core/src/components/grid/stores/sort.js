import { derived, get } from "svelte/store"
import { memo } from "../../../utils"

export const createStores = context => {
  const { props } = context
  const $props = get(props)

  // Initialise to default props
  const sort = memo({
    column: $props.initialSortColumn,
    order: $props.initialSortOrder || "ascending",
  })

  return {
    sort,
  }
}

export const initialise = context => {
  const { sort, initialSortColumn, initialSortOrder, definition } = context

  // Reset sort when initial sort props change
  initialSortColumn.subscribe(newSortColumn => {
    sort.update(state => ({ ...state, column: newSortColumn }))
  })
  initialSortOrder.subscribe(newSortOrder => {
    sort.update(state => ({ ...state, order: newSortOrder || "ascending" }))
  })

  // Derive if the current sort column exists in the schema
  const sortColumnExists = derived(
    [sort, definition],
    ([$sort, $definition]) => {
      if (!$sort?.column || !$definition) {
        return true
      }
      return $definition.schema?.[$sort.column] != null
    }
  )

  // Clear sort state if our sort column does not exist
  sortColumnExists.subscribe(exists => {
    if (!exists) {
      sort.set({
        column: null,
        order: "ascending",
      })
    }
  })
}
