<script>
  import {
    ModalContent,
    Modal,
    Body,
    Layout,
    Detail,
    Heading,
    notifications,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import ICONS from "../icons"
  import { API } from "api"
  import { IntegrationTypes } from "constants/backend"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import DatasourceConfigModal from "components/backend/DatasourceNavigator/modals/DatasourceConfigModal.svelte"
  import GoogleDatasourceConfigModal from "components/backend/DatasourceNavigator/modals/GoogleDatasourceConfigModal.svelte"
  import { createRestDatasource } from "builderStore/datasource"
  import { goto } from "@roxi/routify"
  import ImportRestQueriesModal from "./ImportRestQueriesModal.svelte"
  import DatasourceCard from "../_components/DatasourceCard.svelte"

  export let modal
  let integrations = {}
  let integration = {}
  let internalTableModal
  let externalDatasourceModal
  let importModal

  $: showImportButton = false
  $: customIntegrations = Object.entries(integrations).filter(
    entry => entry[1].custom
  )

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
    if (selected.friendlyName) {
      integration.name = selected.friendlyName
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
    title="Add datasource"
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
    <Layout noPadding gap="XS">
      <Body size="S">Get started with Budibase DB</Body>
      <div
        class:selected={integration.type === IntegrationTypes.INTERNAL}
        on:click={() => selectIntegration(IntegrationTypes.INTERNAL)}
        class="item hoverable"
      >
        <div class="item-body with-type">
          <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
          <div class="text">
            <Heading size="XXS">Budibase DB</Heading>
            <Detail size="S" class="type">Non-relational</Detail>
          </div>
        </div>
      </div>
    </Layout>

    <Layout noPadding gap="XS">
      <Body size="S">Connect to an external datasource</Body>
      <div class="item-list">
        {#each Object.entries(integrations).filter(([key, val]) => key !== IntegrationTypes.INTERNAL && !val.custom) as [integrationType, schema]}
          <DatasourceCard
            on:selected={evt => selectIntegration(evt.detail)}
            {schema}
            bind:integrationType
            {integration}
          />
        {/each}
      </div>
    </Layout>

    {#if customIntegrations.length > 0}
      <Layout noPadding gap="XS">
        <Body size="S">Custom datasource</Body>
        <div class="item-list">
          {#each customIntegrations as [integrationType, schema]}
            <DatasourceCard
              on:selected={evt => selectIntegration(evt.detail)}
              {schema}
              bind:integrationType
              {integration}
            />
          {/each}
        </div>
      </Layout>
    {/if}
  </ModalContent>
</Modal>

<style>
  .item-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    display: grid;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s)
      var(--spectrum-alias-item-padding-m);
    background: var(--spectrum-alias-background-color-secondary);
    transition: background 0.13s ease-out;
    border: solid var(--spectrum-alias-border-color);
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
  }
  .item:hover,
  .item.selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }

  .item-body {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
  .item-body.with-type {
    align-items: flex-start;
  }
  .item-body.with-type :global(svg) {
    margin-top: 4px;
  }

  .text :global(.spectrum-Detail) {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
