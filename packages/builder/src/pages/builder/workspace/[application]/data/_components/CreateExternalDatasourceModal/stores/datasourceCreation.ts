import { get, writable, type Writable } from "svelte/store"
import { shouldIntegrationFetchTableNames } from "@/stores/selectors"
import type { Datasource, UIIntegration } from "@budibase/types"

type CreationStage = "googleAuth" | "editConfig" | "selectTables" | null

type DatasourceCreationState = {
  finished: boolean
  stage: CreationStage
  integration: UIIntegration | null
  config: Record<string, unknown> | null
  datasource: Datasource | null
}

interface DatasourceCreationStore extends Writable<DatasourceCreationState> {
  cancel: () => void
  googleAuthStage: () => void
  setIntegration: (integration: UIIntegration) => void
  setConfig: (config: Record<string, unknown>) => void
  editConfigStage: () => void
  setDatasource: (datasource: Datasource) => void
  selectTablesStage: () => void
  markAsFinished: () => void
}

export const defaultStore: DatasourceCreationState = {
  finished: false,
  stage: null,
  integration: null,
  config: null,
  datasource: null,
}

export const createDatasourceCreationStore = (): Omit<
  DatasourceCreationStore,
  "set" | "update"
> => {
  const store = writable(defaultStore) as DatasourceCreationStore

  store.cancel = () => {
    const $store = get(store)
    // If the datasource has already been created, mark the store as finished.
    if ($store.stage === "selectTables") {
      store.markAsFinished()
    } else {
      store.set(defaultStore)
    }
  }

  // Used only by Google Sheets
  store.googleAuthStage = () => {
    store.update($store => ({
      ...$store,
      stage: "googleAuth",
    }))
  }

  store.setIntegration = integration => {
    store.update($store => ({
      ...$store,
      integration,
    }))
  }

  store.setConfig = config => {
    store.update($store => ({
      ...$store,
      config,
    }))
  }

  // Used for every flow but REST
  store.editConfigStage = () => {
    store.update($store => ({
      ...$store,
      stage: "editConfig",
    }))
  }

  store.setDatasource = datasource => {
    const $store = get(store)
    store.set({ ...$store, datasource })

    const { integration } = $store

    if (!integration) {
      const error = "Integration must be set"
      throw new Error(error)
    }

    if (shouldIntegrationFetchTableNames(integration)) {
      store.selectTablesStage()
    } else {
      store.markAsFinished()
    }
  }

  // Only used for datasource plus
  store.selectTablesStage = () => {
    store.update($store => ({
      ...$store,
      stage: "selectTables",
    }))
  }

  store.markAsFinished = () => {
    store.update($store => ({
      ...$store,
      finished: true,
    }))
  }

  return {
    subscribe: store.subscribe,
    cancel: store.cancel,
    googleAuthStage: store.googleAuthStage,
    setIntegration: store.setIntegration,
    setConfig: store.setConfig,
    editConfigStage: store.editConfigStage,
    setDatasource: store.setDatasource,
    selectTablesStage: store.selectTablesStage,
    markAsFinished: store.markAsFinished,
  }
}
