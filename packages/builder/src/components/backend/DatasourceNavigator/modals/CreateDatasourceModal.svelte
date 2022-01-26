<script>
  import {
    ModalContent,
    Modal,
    Body,
    Layout,
    Detail,
    notifications,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import ICONS from "../icons"
  import { API } from "api"
  import { IntegrationNames, IntegrationTypes } from "constants/backend"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import DatasourceConfigModal from "components/backend/DatasourceNavigator/modals/DatasourceConfigModal.svelte"
  import GoogleDatasourceConfigModal from "components/backend/DatasourceNavigator/modals/GoogleDatasourceConfigModal.svelte"
  import { createRestDatasource } from "builderStore/datasource"
  import { goto } from "@roxi/routify"
  import ImportRestQueriesModal from "./ImportRestQueriesModal.svelte"

  export let modal
  let integrations = {}
  let integration = {}
  let internalTableModal
  let externalDatasourceModal
  let importModal

  $: showImportButton = false

  checkShowImport()

  onMount(() => {
    fetchIntegrations()
  })

  function selectIntegration(integrationType) {
    const selected = integrations[integrationType]

    // build the schema
    const config = {}
    for (let key of Object.keys(selected.datasource)) {
      config[key] = selected.datasource[key].default
    }
    integration = {
      type: integrationType,
      plus: selected.plus,
      config,
      schema: selected.datasource,
      auth: selected.auth,
    }
    checkShowImport()
  }

  function checkShowImport() {
    showImportButton = integration.type === "REST"
  }

  function showImportModal() {
    importModal.show()
  }

  async function chooseNextModal() {
    if (integration.type === IntegrationTypes.INTERNAL) {
      externalDatasourceModal.hide()
      internalTableModal.show()
    } else if (integration.type === IntegrationTypes.REST) {
      try {
        // Skip modal for rest, create straight away
        const resp = await createRestDatasource(integration)
        $goto(`./datasource/${resp._id}`)
      } catch (error) {
        notifications.error("Error creating datasource")
      }
    } else {
      externalDatasourceModal.show()
    }
  }

  async function fetchIntegrations() {
    let newIntegrations = {
      [IntegrationTypes.INTERNAL]: { datasource: {}, name: "INTERNAL/CSV" },
    }
    try {
      const integrationList = await API.getIntegrations()
      newIntegrations = {
        ...newIntegrations,
        ...integrationList,
      }
    } catch (error) {
      notifications.error("Error fetching integrations")
    }
    integrations = newIntegrations
  }
</script>

<Modal bind:this={internalTableModal}>
  <CreateTableModal />
</Modal>

<Modal bind:this={externalDatasourceModal}>
  {#if integration?.auth?.type === "google"}
    <GoogleDatasourceConfigModal {integration} {modal} />
  {:else}
    <DatasourceConfigModal {integration} {modal} />
  {/if}
</Modal>

<Modal bind:this={importModal}>
  {#if integration.type === "REST"}
    <ImportRestQueriesModal
      navigateDatasource={true}
      createDatasource={true}
      onCancel={() => modal.show()}
    />
  {/if}
</Modal>

<Modal bind:this={modal}>
  <ModalContent
    disabled={!Object.keys(integration).length}
    title="Data"
    confirmText="Continue"
    showSecondaryButton={showImportButton}
    secondaryButtonText="Import"
    secondaryAction={() => showImportModal()}
    showCancelButton={false}
    size="M"
    onConfirm={() => {
      chooseNextModal()
    }}
  >
    <Layout noPadding>
      <Body size="S"
        >All apps need data. You can connect to a data source below, or add data
        to your app using Budibase's built-in database.
      </Body>
      <div
        class:selected={integration.type === IntegrationTypes.INTERNAL}
        on:click={() => selectIntegration(IntegrationTypes.INTERNAL)}
        class="item hoverable"
      >
        <div class="item-body">
          <svelte:component this={ICONS.BUDIBASE} height="18" width="18" />
          <span class="icon-spacing"> <Body size="S">Budibase DB</Body></span>
        </div>
      </div>
    </Layout>

    <Layout gap="XS" noPadding>
      <div class="title-spacing">
        <Detail size="S">Connect to data source</Detail>
      </div>
      <div class="item-list">
        {#each Object.entries(integrations).filter(([key]) => key !== IntegrationTypes.INTERNAL) as [integrationType, schema]}
          <div
            class:selected={integration.type === integrationType}
            on:click={() => selectIntegration(integrationType)}
            class="item hoverable"
          >
            <div class="item-body">
              <svelte:component
                this={ICONS[integrationType]}
                height="18"
                width="18"
              />

              <span class="icon-spacing">
                <Body size="S"
                  >{schema.name || IntegrationNames[integrationType]}</Body
                ></span
              >
            </div>
          </div>
        {/each}
      </div>
    </Layout>
  </ModalContent>
</Modal>

<style>
  .icon-spacing {
    margin-left: var(--spacing-m);
  }
  .item-body {
    display: flex;
    margin-left: var(--spacing-m);
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    display: grid;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid var(--spectrum-alias-border-color);
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
  }

  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }

  .item:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
