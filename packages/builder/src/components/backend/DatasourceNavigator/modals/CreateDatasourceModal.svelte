<script>
  import { ModalContent, Modal, Body, Layout, Detail } from "@budibase/bbui"
  import { onMount } from "svelte"
  import ICONS from "../icons"
  import api from "builderStore/api"
  import { IntegrationNames } from "constants"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import DatasourceConfigModal from "components/backend/DatasourceNavigator/modals/DatasourceConfigModal.svelte"
  import ImportRestQueriesModal from "./ImportRestQueriesModal.svelte"

  export let modal
  let integrations = []
  let integration = {}
  let internalTableModal
  let externalDatasourceModal
  let importModal

  $: showImportButton = false

  checkShowImport()

  const INTERNAL = "BUDIBASE"

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
    }
    checkShowImport()
  }

  function checkShowImport() {
    showImportButton = integration.type === "REST"
  }

  function showImportModal() {
    importModal.show()
  }

  function chooseNextModal() {
    if (integration.type === INTERNAL) {
      externalDatasourceModal.hide()
      internalTableModal.show()
    } else {
      externalDatasourceModal.show()
    }
  }

  async function fetchIntegrations() {
    const response = await api.get("/api/integrations")
    const json = await response.json()
    integrations = {
      [INTERNAL]: { datasource: {}, name: "INTERNAL/CSV" },
      ...json,
    }
    return json
  }
</script>

<Modal bind:this={internalTableModal}>
  <CreateTableModal />
</Modal>

<Modal bind:this={externalDatasourceModal}>
  <DatasourceConfigModal {integration} {modal} />
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
        class:selected={integration.type === INTERNAL}
        on:click={() => selectIntegration(INTERNAL)}
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
        {#each Object.entries(integrations).filter(([key]) => key !== INTERNAL) as [integrationType, schema]}
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
