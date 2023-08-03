import { get } from "svelte/store"

export const initialise = context => {
  const { definition, datasource, sort, rows } = context

  // For views, keep sort state in line with the view definition
  definition.subscribe($definition => {
    if (!$definition || get(datasource)?.type !== "viewV2") {
      return
    }
    const $sort = get(sort)
    if (
      $definition.sort?.field !== $sort?.column ||
      $definition.sort?.order !== $sort?.order
    ) {
      sort.set({
        column: $definition.sort?.field,
        order: $definition.sort?.order,
      })
    }
  })

  // When sorting changes, ensure view definition is kept up to date
  sort.subscribe(async $sort => {
    const $view = get(definition)
    if (!$view || get(datasource)?.type !== "viewV2") {
      return
    }
    if (
      $sort?.column !== $view.sort?.field ||
      $sort?.order !== $view.sort?.order
    ) {
      await datasource.actions.saveDefinition({
        ...$view,
        sort: {
          field: $sort.column,
          order: $sort.order,
        },
      })
      await rows.actions.refreshData()
    }
  })
}
