<script>
  import { ModalContent, Modal, Body, Layout, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  import ICONS from "../icons"
  import api from "builderStore/api"
  import { IntegrationNames } from "constants"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import DatasourceConfigModal from "components/backend/DatasourceNavigator/modals/DatasourceConfigModal.svelte"

  export let modal
  let integrations = []
  let integration = {}
  let internalTableModal
  let externalDatasourceModal

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
  <DatasourceConfigModal {integration} />
</Modal>

<Modal bind:this={modal}>
  <ModalContent
    disabled={!Object.keys(integration).length}
    title="Add Data"
    confirmText="Continue"
    cancelText="Start from scratch"
    size="M"
    onConfirm={() => {
      chooseNextModal()
    }}
  >
    <Body size="XS"
      >All apps need data. You can connect to a data source below, or add data
      to your app using Budibase's built-in database - it's simple!
    </Body>

    <Layout noPadding>
      <div
        class:selected={integration.type === INTERNAL}
        on:click={() => selectIntegration(INTERNAL)}
        class="item hoverable"
      >
        <div class="item-body">
          <svelte:component this={ICONS.BUDIBASE} height="18" width="18" />
          <span class="icon-spacing">
            <Body size="S">Budibase DB (no prior data required)</Body></span
          >
        </div>
      </div>
      <Label size="S">Connect to data source</Label>

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
