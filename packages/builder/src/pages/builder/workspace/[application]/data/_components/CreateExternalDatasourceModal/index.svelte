<script lang="ts">
  import DatasourceConfigEditor from "@/components/backend/Datasources/ConfigEditor/index.svelte"
  import TableImportSelection from "@/components/backend/Datasources/TableImportSelection/index.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { datasources } from "@/stores/builder"
  import { configFromIntegration } from "@/stores/selectors"
  import { Modal, keepOpen, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { get } from "svelte/store"
  import GoogleAuthPrompt from "./GoogleAuthPrompt.svelte"
  import { createDatasourceCreationStore } from "./stores/datasourceCreation"
  import { createOnGoogleAuthStore } from "./stores/onGoogleAuth"
  import type { UIIntegration } from "@budibase/types"

  $goto

  export let loading = false
  const store = createDatasourceCreationStore()
  const onGoogleAuth = createOnGoogleAuthStore()
  let modal: Modal

  type DatasourceConfig = Record<string, unknown>

  const handleStoreChanges = (
    store: typeof $store,
    modal: Modal,
    goto: typeof $goto
  ) => {
    store.stage === null ? modal?.hide() : modal?.show()

    if (store.finished && store.datasource) {
      const datasource = store.datasource
      const queryString =
        datasource.plus || datasource.source === "REST"
          ? ""
          : "?promptQuery=true"
      goto(`./datasource/${datasource._id}${queryString}`)
    }
  }

  $: handleStoreChanges($store, modal, $goto)

  export function show(integration: UIIntegration) {
    if (integration.name === IntegrationTypes.REST) {
      // A REST integration is created immediately, we don't need to display a config modal.
      loading = true
      datasources
        .create({ integration, config: configFromIntegration(integration) })
        .then(datasource => {
          store.setIntegration(integration)
          store.setDatasource(datasource)
        })
        .finally(() => (loading = false))
    } else if (integration.name === IntegrationTypes.GOOGLE_SHEETS) {
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
  $: $onGoogleAuth((integration, config) => {
    store.setIntegration(integration)
    store.setConfig(config)
    store.editConfigStage()
  })

  const createDatasource = async (config: DatasourceConfig) => {
    try {
      const datasource = await datasources.create({
        integration: get(store).integration!,
        config,
      })
      store.setDatasource(datasource)

      notifications.success("Datasource created successfully")
    } catch (e: any) {
      notifications.error(`Error creating datasource: ${e.message}`)
    }

    return keepOpen
  }

  function ensure<K extends keyof typeof $store>(
    key: K,
    config: typeof $store
  ) {
    if (!config[key]) {
      const error = `${key} is not set`
      notifications.error(error)
      throw new Error(error)
    }
    return config[key]
  }
</script>

<Modal on:hide={store.cancel} bind:this={modal}>
  {#if $store.stage === "googleAuth"}
    <GoogleAuthPrompt
      on:close={() => {
        modal.hide()
      }}
    />
  {:else if $store.stage === "editConfig"}
    <DatasourceConfigEditor
      integration={$store.integration!}
      config={ensure("config", $store)}
      onSubmit={({ config }) => {
        createDatasource(config)
      }}
    />
  {:else if $store.stage === "selectTables"}
    <TableImportSelection
      integration={ensure("integration", $store)}
      datasource={ensure("datasource", $store)}
      onComplete={store.markAsFinished}
    />
  {/if}
</Modal>
