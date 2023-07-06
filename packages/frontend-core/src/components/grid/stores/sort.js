import { writable } from "svelte/store"

export const createStores = context => {
  const { props } = context

  // Initialise to default props
  const sort = writable({
    column: props.initialSortColumn,
    order: props.initialSortOrder || "ascending",
  })

  return {
    sort,
  }
}

export const initialise = context => {
  const { sort, initialSortColumn, initialSortOrder } = context

  // Reset sort when initial sort props change
  initialSortColumn.subscribe(newSortColumn => {
    sort.update(state => ({ ...state, column: newSortColumn }))
  })
  initialSortOrder.subscribe(newSortOrder => {
    sort.update(state => ({ ...state, order: newSortOrder }))
  })
}
