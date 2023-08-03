import { get } from "svelte/store"

export const initialise = context => {
  const { datasource, fetch, filter, sort } = context

  // Update fetch when filter changes
  filter.subscribe($filter => {
    if (get(datasource)?.type === "table") {
      get(fetch)?.update({
        filter: $filter,
      })
    }
  })

  // Update fetch when sorting changes
  sort.subscribe($sort => {
    if (get(datasource)?.type === "table") {
      console.log("update", $sort)
      console.log(get(fetch))
      get(fetch)?.update({
        sortOrder: $sort.order,
        sortColumn: $sort.column,
      })
    }
  })
}
