<script>
  import { API } from "api"
  import { tables, datasources } from "stores/backend"

  import { Icon, Modal, notifications, Heading, Body } from "@budibase/bbui"
  import { params, goto } from "@roxi/routify"
  import {
    IntegrationTypes,
    DatasourceTypes,
    DEFAULT_BB_DATASOURCE_ID,
  } from "constants/backend"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import DatasourceConfigModal from "components/backend/DatasourceNavigator/modals/DatasourceConfigModal.svelte"
  import GoogleDatasourceConfigModal from "components/backend/DatasourceNavigator/modals/GoogleDatasourceConfigModal.svelte"
  import { createRestDatasource } from "builderStore/datasource"
  import DatasourceOption from "./_components/DatasourceOption.svelte"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons/index.js"
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"

  let internalTableModal
  let externalDatasourceModal
  let integrations = []
  let integration = null
  let disabled = false
  let promptUpload = false

  $: hasData = $datasources.list.length > 1 || $tables.list.length > 1
  $: hasDefaultData =
    $datasources.list.findIndex(
      datasource => datasource._id === DEFAULT_BB_DATASOURCE_ID
    ) !== -1

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

  const handleIntegrationSelect = integrationType => {
    const selected = integrations.find(([type]) => type === integrationType)[1]

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
      features: selected.features || [],
    }

    if (selected.friendlyName) {
      integration.name = selected.friendlyName
    }

    if (integration.type === IntegrationTypes.REST) {
      disabled = true

      // Skip modal for rest, create straight away
      createRestDatasource(integration)
        .then(response => {
          $goto(`./datasource/${response._id}`)
        })
        .catch(() => {
          disabled = false
          notifications.error("Error creating datasource")
        })
    } else {
      externalDatasourceModal.show()
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

  function sortIntegrations(integrations) {
    let integrationsArray = Object.entries(integrations)

    function getTypeOrder(schema) {
      if (schema.type === DatasourceTypes.API) {
        return 1
      }

      if (schema.type === DatasourceTypes.RELATIONAL) {
        return 2
      }

      return schema.type?.charCodeAt(0)
    }

    integrationsArray.sort((a, b) => {
      let typeOrderA = getTypeOrder(a[1])
      let typeOrderB = getTypeOrder(b[1])

      if (typeOrderA === typeOrderB) {
        return a[1].friendlyName?.localeCompare(b[1].friendlyName)
      }

      return typeOrderA < typeOrderB ? -1 : 1
    })

    return integrationsArray
  }

  const fetchIntegrations = async () => {
    const unsortedIntegrations = await API.getIntegrations()
    integrations = sortIntegrations(unsortedIntegrations)
  }

  $: fetchIntegrations()
</script>

<Modal bind:this={internalTableModal}>
  <CreateTableModal {promptUpload} afterSave={handleInternalTableSave} />
</Modal>

<Modal bind:this={externalDatasourceModal}>
  {#if integration?.auth?.type === "google"}
    <GoogleDatasourceConfigModal {integration} />
  {:else}
    <DatasourceConfigModal {integration} />
  {/if}
</Modal>

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
      disabled={disabled || hasDefaultData}
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
    {#each integrations as [key, value]}
      <DatasourceOption
        on:click={() => handleIntegrationSelect(key)}
        title={value.friendlyName}
        description={value.type}
        {disabled}
      >
        <IntegrationIcon integrationType={key} schema={value} />
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
