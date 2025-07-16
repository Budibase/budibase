import { derived, writable, get } from "svelte/store"
import { keepOpen, notifications } from "@budibase/bbui"
import { datasources, tables } from "@/stores/builder"
import { Datasource } from "@budibase/types"

export const createTableSelectionStore = (datasource: Datasource) => {
  const tableNamesStore = writable<string[]>([])
  const selectedTableNamesStore = writable<string[]>([])
  const errorStore = writable<Error | null>(null)
  const loadingStore = writable<boolean>(true)

  datasources.getTableNames(datasource).then(tableNames => {
    tableNamesStore.set(tableNames)
    selectedTableNamesStore.set(
      tableNames.filter(tableName => datasource.entities?.[tableName])
    )

    loadingStore.set(false)
  })

  const setSelectedTableNames = (selectedTableNames: string[]) => {
    selectedTableNamesStore.set(selectedTableNames)
  }

  const importSelectedTables = async (onComplete: () => any) => {
    errorStore.set(null)

    try {
      await datasources.updateSchema(datasource, get(selectedTableNamesStore))
      await tables.fetch()
      notifications.success(`Tables fetched successfully.`)
      await onComplete()
    } catch (err: any) {
      errorStore.set(err)
      return keepOpen
    }
  }

  const combined = derived(
    [tableNamesStore, selectedTableNamesStore, errorStore, loadingStore],
    ([
      $tableNamesStore,
      $selectedTableNamesStore,
      $errorStore,
      $loadingStore,
    ]) => {
      return {
        tableNames: $tableNamesStore,
        selectedTableNames: $selectedTableNamesStore,
        error: $errorStore,
        loading: $loadingStore,
        hasSelected: $selectedTableNamesStore.length > 0,
      }
    }
  )

  return {
    subscribe: combined.subscribe,
    setSelectedTableNames,
    importSelectedTables,
  }
}
