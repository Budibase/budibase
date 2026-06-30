<svelte:options runes={true} />

<script lang="ts">
  import { Modal, keepOpen, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { IntegrationTypes } from "@/constants/backend"
  import GoogleAuthPrompt from "./GoogleAuthPrompt.svelte"

  import { get } from "svelte/store"
  import TableImportSelection from "@/components/backend/Datasources/TableImportSelection/index.svelte"
  import DatasourceConfigEditor from "@/components/backend/Datasources/ConfigEditor/index.svelte"
  import { datasources } from "@/stores/builder"
  import { createOnGoogleAuthStore } from "./stores/onGoogleAuth.js"
  import { createDatasourceCreationStore } from "./stores/datasourceCreation.js"
  import { configFromIntegration } from "@/stores/selectors"
  import type { Datasource, UIIntegration } from "@budibase/types"

  interface ModalHandle {
    show(): void
    hide(): void
  }

  type DatasourceConfig = NonNullable<Datasource["config"]>

  interface DatasourceCreationState {
    finished: boolean
    stage: "googleAuth" | "editConfig" | "selectTables" | null
    integration: UIIntegration | null
    config: DatasourceConfig | null
    datasource: Datasource | null
  }

  interface CreateDatasourceSubmit {
    config: DatasourceConfig
    projectIds?: string[]
  }

  const store = createDatasourceCreationStore()
  const onGoogleAuth = createOnGoogleAuthStore()
  let modal: ModalHandle | undefined = $state()

  let modalVisible = $state(false)

  const handleStoreChanges = (
    store: DatasourceCreationState,
    modal: ModalHandle | undefined,
    goto: (url: string) => void
  ) => {
    store.stage === null ? modal?.hide() : modal?.show()

    if (store.finished && store.datasource) {
      const queryString =
        store.datasource.plus || store.datasource.source === "REST"
          ? ""
          : "?promptQuery=true"
      goto(`./datasource/${store.datasource._id}${queryString}`)
    }
  }

  $effect(() => {
    handleStoreChanges($store, modal, $goto)
  })

  export function show(integration: UIIntegration) {
    if (integration.name === IntegrationTypes.GOOGLE_SHEETS) {
      // This prompt redirects users to the Google OAuth flow, they'll be returned to this modal afterwards
      // with query params populated that trigger the `onGoogleAuth` store.
      store.googleAuthStage()
    } else {
      // All other integrations can generate config from data in the integration object.
      store.setIntegration(integration)
      store.setConfig(configFromIntegration(integration))
      store.editConfigStage()
    }
  }

  // Triggers opening the config editor whenever Google OAuth returns the user to the page
  $effect(() => {
    $onGoogleAuth((integration: UIIntegration, config: DatasourceConfig) => {
      store.setIntegration(integration)
      store.setConfig(config)
      store.editConfigStage()
    })
  })

  const createDatasource = async ({
    config,
    projectIds,
  }: CreateDatasourceSubmit): Promise<void | typeof keepOpen> => {
    try {
      const integration = get(store).integration
      if (!integration) {
        throw new Error("Integration is required")
      }
      const datasource = await datasources.create({
        integration,
        config,
        projectIds,
      })
      store.setDatasource(datasource)

      notifications.success("Datasource created successfully")
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      notifications.error(`Error creating datasource: ${message}`)
    }

    return keepOpen
  }
</script>

<Modal
  on:show={() => {
    modalVisible = true
  }}
  on:hide={() => {
    if (modalVisible) {
      modalVisible = false
      store.cancel()
    }
  }}
  bind:this={modal}
>
  {#if $store.stage === "googleAuth"}
    <GoogleAuthPrompt
      on:close={() => {
        modal?.hide()
      }}
    />
  {:else if $store.stage === "editConfig" && $store.integration && $store.config}
    <DatasourceConfigEditor
      integration={$store.integration}
      config={$store.config}
      showProjectField
      onSubmit={createDatasource}
    />
  {:else if $store.stage === "selectTables" && $store.integration && $store.datasource}
    <TableImportSelection
      integration={$store.integration}
      datasource={$store.datasource}
      onComplete={store.markAsFinished}
    />
  {/if}
</Modal>
