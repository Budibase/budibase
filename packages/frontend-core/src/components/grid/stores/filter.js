import { writable, get } from "svelte/store"

export const createStores = context => {
  const { props } = context

  // Initialise to default props
  const filter = writable(get(props).initialFilter)

  return {
    filter,
  }
}

export const initialise = context => {
  const { filter, initialFilter } = context

  // Reset filter when initial filter prop changes
  initialFilter.subscribe(filter.set)
}
