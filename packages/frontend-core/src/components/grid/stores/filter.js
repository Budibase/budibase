import { writable } from "svelte/store"
import { derivedMemo } from "../../../utils"

export const createStores = context => {
  const { props } = context

  // Initialise to default props
  const filter = writable(props.initialFilter)

  return {
    filter,
  }
}

export const initialise = context => {
  const { filter, initialFilter } = context

  // Reset filter when initial filter prop changes
  initialFilter.subscribe(filter.set)
}
