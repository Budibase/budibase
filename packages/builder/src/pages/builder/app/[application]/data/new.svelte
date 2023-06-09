<script>
  import { API } from "api"
  import {
    tables,
    datasources,
    sortedIntegrations as integrations,
    integrations as integrationsStore,
  } from "stores/backend"

  import { IntegrationTypes } from "constants/backend"
  import { Icon, Modal, notifications, Heading, Body } from "@budibase/bbui"
  import { params, goto } from "@roxi/routify"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import CreateExternalDatasourceModal from "./_CreateExternalDatasourceModal.svelte"
  import DatasourceOption from "./_components/DatasourceOption.svelte"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons/index.js"
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"

  let internalTableModal
  let externalDatasourceModal
  let disabled = false
  let promptUpload = false
  $: hasData = $datasources.list.length > 1 || $tables.list.length > 1

  const getGoogleSetupId = params => {
    const id = params["?continue_google_setup"]
    $goto("./new")
    return id
  }

  const handleOpenGoogle = (
    setupId,
    integrationsStore,
    externalDatasourceModal
  ) => {
    if (setupId && integrationsStore && externalDatasourceModal) {
      externalDatasourceModal.show({
        ...integrationsStore[IntegrationTypes.GOOGLE_SHEETS],
        name: IntegrationTypes.GOOGLE_SHEETS,
      })
    }
  }

  $: googleSetupId = getGoogleSetupId($params)
  $: handleOpenGoogle(
    googleSetupId,
    $integrationsStore,
    externalDatasourceModal
  )

  const createSampleData = async () => {
    disabled = true

    try {
      await API.addSampleData($params.application)
      await tables.fetch()
      await datasources.fetch()
      $goto("./table")
    } catch (e) {
      disabled = false
      notifications.error("Error creating datasource")
    }
  }

  const handleInternalTable = () => {
    promptUpload = false
    internalTableModal.show()
  }

  const handleDataImport = () => {
    promptUpload = true
    internalTableModal.show()
  }

  const handleInternalTableSave = table => {
    notifications.success(`Table created successfully.`)
    $goto(`./table/${table._id}`)
  }
</script>

<Modal bind:this={internalTableModal}>
  <CreateTableModal {promptUpload} afterSave={handleInternalTableSave} />
</Modal>

<CreateExternalDatasourceModal
  {googleSetupId}
  on:hide={() => {
    googleSetupId = false
  }}
  bind:disabled
  bind:this={externalDatasourceModal}
/>

<div class="page">
  <div class="closeButton">
    {#if hasData}
      <Icon hoverable name="Close" on:click={$goto("./table")} />
    {/if}
  </div>
  <div class="heading">
    <Heading weight="light">Add new data source</Heading>
  </div>

  <div class="subHeading">
    <Body>Get started with our Budibase DB</Body>
    <div
      role="tooltip"
      title="Budibase DB is built with CouchDB"
      class="tooltip"
    >
      <FontAwesomeIcon name="fa-solid fa-circle-info" />
    </div>
  </div>

  <div class="options">
    <DatasourceOption
      on:click={handleInternalTable}
      title="Create new table"
      description="Non-relational"
      {disabled}
    >
      <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
    </DatasourceOption>
    <DatasourceOption
      on:click={createSampleData}
      title="Use sample data"
      description="Non-relational"
      disabled={disabled || $datasources.hasDefaultData}
    >
      <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
    </DatasourceOption>
    <DatasourceOption
      on:click={handleDataImport}
      title="Upload data"
      description="Non-relational"
      {disabled}
    >
      <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
    </DatasourceOption>
  </div>

  <div class="subHeading">
    <Body>Or connect to an external datasource</Body>
  </div>

  <div class="options">
    {#each $integrations as integration}
      <DatasourceOption
        on:click={() => externalDatasourceModal.show(integration)}
        title={integration.friendlyName}
        description={integration.type}
        {disabled}
      >
        <IntegrationIcon
          integrationType={integration.name}
          schema={integration}
        />
      </DatasourceOption>
    {/each}
  </div>
</div>

<style>
  .page {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .closeButton {
    height: 38px;
    display: flex;
    justify-content: right;
    width: 100%;
  }

  .heading {
    margin-bottom: 12px;
  }

  .subHeading {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  .tooltip {
    margin-left: 6px;
  }

  .options {
    width: 100%;
    display: grid;
    column-gap: 24px;
    row-gap: 24px;
    grid-template-columns: repeat(auto-fit, 235px);
    justify-content: center;
    margin-bottom: 48px;
    max-width: 1050px;
  }
</style>
