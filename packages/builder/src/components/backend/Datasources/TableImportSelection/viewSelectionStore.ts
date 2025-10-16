import { derived, writable, get } from "svelte/store"
import { keepOpen, notifications } from "@budibase/bbui"
import { datasources, queries } from "@/stores/builder"
import { Datasource, Query } from "@budibase/types"

export const createViewSelectionStore = (datasource: Datasource) => {
  const viewNamesStore = writable<string[]>([])
  const selectedViewNamesStore = writable<(string | undefined)[]>([])
  const errorStore = writable<Error | null>(null)
  const loadingStore = writable<boolean>(true)

  datasources.getViewNames(datasource).then(viewNames => {
    viewNamesStore.set(viewNames)
    selectedViewNamesStore.set(
      viewNames.filter(viewName => {
        // Check if a query already exists for this view
        const queryList = get(queries).list
        return queryList.some(
          (query: Query) =>
            query.datasourceId === datasource._id && query.name === viewName
        )
      })
    )
    loadingStore.set(false)
  })

  const setSelectedViewNames = (selectedViewNames: (string | undefined)[]) => {
    selectedViewNamesStore.set(selectedViewNames)
  }

  const importSelectedViews = async (onComplete: () => any) => {
    errorStore.set(null)

    try {
      const selectedViews = get(selectedViewNamesStore).filter(
        Boolean
      ) as string[]
      const existingQueries = get(queries).list.filter(
        (query: Query) => query.datasourceId === datasource._id
      )

      // Find views that need new queries (selected but no query exists)
      const viewsToCreate = selectedViews.filter(
        viewName => !existingQueries.some(query => query.name === viewName)
      )

      // Create new queries
      for (const viewName of viewsToCreate) {
        await datasources.createViewQuery(datasource, viewName)
      }

      await queries.fetch()
      notifications.success(`Views imported successfully.`)
      await onComplete()
    } catch (err: any) {
      errorStore.set(err)
      return keepOpen
    }
  }

  const combined = derived(
    [viewNamesStore, selectedViewNamesStore, errorStore, loadingStore],
    ([
      $viewNamesStore,
      $selectedViewNamesStore,
      $errorStore,
      $loadingStore,
    ]) => {
      return {
        viewNames: $viewNamesStore,
        selectedViewNames: $selectedViewNamesStore,
        error: $errorStore,
        loading: $loadingStore,
        hasSelected: $selectedViewNamesStore.length > 0,
      }
    }
  )

  return {
    subscribe: combined.subscribe,
    setSelectedViewNames,
    importSelectedViews,
  }
}
