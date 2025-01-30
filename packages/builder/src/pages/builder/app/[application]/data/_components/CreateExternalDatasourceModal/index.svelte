<script>
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

  export let loading = false
  const store = createDatasourceCreationStore()
  const onGoogleAuth = createOnGoogleAuthStore()
  let modal

  const handleStoreChanges = (store, modal, goto) => {
    store.stage === null ? modal?.hide() : modal?.show()

    if (store.finished) {
      const queryString =
        store.datasource.plus || store.datasource.source === "REST"
          ? ""
          : "?promptQuery=true"
      goto(`./datasource/${store.datasource._id}${queryString}`)
    }
  }

  $: handleStoreChanges($store, modal, $goto)

  export function show(integration) {
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

  const createDatasource = async config => {
    try {
      const datasource = await datasources.create({
        integration: get(store).integration,
        config,
      })
      store.setDatasource(datasource)

      notifications.success("Datasource created successfully")
    } catch (e) {
      notifications.error(`Error creating datasource: ${e.message}`)
    }

    return keepOpen
  }
</script>

<Modal on:hide={store.cancel} bind:this={modal}>
  {#if $store.stage === "googleAuth"}
    <GoogleAuthPrompt />
  {:else if $store.stage === "editConfig"}
    <DatasourceConfigEditor
      integration={$store.integration}
      config={$store.config}
      onSubmit={({ config }) => createDatasource(config)}
    />
  {:else if $store.stage === "selectTables"}
    <TableImportSelection
      integration={$store.integration}
      datasource={$store.datasource}
      onComplete={store.markAsFinished}
    />
  {/if}
</Modal>
