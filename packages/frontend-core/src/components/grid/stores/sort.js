import { derived, get } from "svelte/store"
import { memo } from "../../../utils"
import { SortOrder } from "@budibase/types"

export const createStores = context => {
  const { props } = context
  const $props = get(props)

  // Initialise to default props
  const sort = memo({
    column: $props.initialSortColumn,
    order: $props.initialSortOrder || SortOrder.ASCENDING,
  })

  return {
    sort,
  }
}

export const initialise = context => {
  const { sort, initialSortColumn, initialSortOrder, schema } = context

  // Reset sort when initial sort props change
  initialSortColumn.subscribe(newSortColumn => {
    sort.update(state => ({ ...state, column: newSortColumn }))
  })
  initialSortOrder.subscribe(newSortOrder => {
    sort.update(state => ({
      ...state,
      order: newSortOrder || SortOrder.ASCENDING,
    }))
  })

  // Derive if the current sort column exists in the schema
  const sortColumnExists = derived([sort, schema], ([$sort, $schema]) => {
    if (!$sort?.column || !$schema) {
      return true
    }
    return $schema[$sort.column] != null
  })

  // Clear sort state if our sort column does not exist
  sortColumnExists.subscribe(exists => {
    if (!exists) {
      sort.set({
        column: null,
        order: SortOrder.ASCENDING,
      })
    }
  })
}
