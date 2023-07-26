import { derived, writable, get } from "svelte/store"
import { notifications } from "@budibase/bbui"
import { datasources, ImportTableError, tables } from "stores/backend"

export const createTableSelectionStore = (integration, datasource) => {
  const tableNamesStore = writable([])
  const selectedTableNamesStore = writable([])
  const errorStore = writable(null)
  const loadingStore = writable(true)

  datasources.getTableNames(datasource).then(tableNames => {
    tableNamesStore.set(tableNames)
    selectedTableNamesStore.set(
      tableNames.filter(tableName => datasource.entities?.[tableName])
    )

    loadingStore.set(false)
  })

  const setSelectedTableNames = selectedTableNames => {
    selectedTableNamesStore.set(selectedTableNames)
  }

  const importSelectedTables = async onComplete => {
    errorStore.set(null)

    try {
      await datasources.updateSchema(datasource, get(selectedTableNamesStore))
      await tables.fetch()
      notifications.success(`Tables fetched successfully.`)
      await onComplete()
    } catch (err) {
      if (err instanceof ImportTableError) {
        errorStore.set(err)
      } else {
        notifications.error("Error fetching tables.")
      }

      // Prevent modal closing
      return false
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
