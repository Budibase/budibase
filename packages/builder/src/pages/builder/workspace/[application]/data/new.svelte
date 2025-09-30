<script lang="ts">
  import { API } from "@/api"
  import {
    tables,
    datasources,
    queries,
    sortedIntegrations as integrations,
  } from "@/stores/builder"

  import { hasData } from "@/stores/selectors"
  import { notifications, Body, Icon, AbsTooltip } from "@budibase/bbui"
  import { params, goto } from "@roxi/routify"
  import CreateExternalDatasourceModal from "./_components/CreateExternalDatasourceModal/index.svelte"
  import CreateInternalTableModal from "./_components/CreateInternalTableModal.svelte"
  import DatasourceOption from "./_components/DatasourceOption.svelte"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import ICONS from "@/components/backend/DatasourceNavigator/icons/index.js"
  import AiTableGeneration from "./_components/AITableGeneration.svelte"
  import RestTemplateModal from "./_components/RestTemplateModal.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { configFromIntegration } from "@/stores/selectors"

  let internalTableModal: CreateInternalTableModal
  let externalDatasourceModal: CreateExternalDatasourceModal
  let restTemplateModal: RestTemplateModal

  let sampleDataLoading = false
  let externalDatasourceLoading = false
  let templateLoading = false

  $: disabled =
    sampleDataLoading || externalDatasourceLoading || templateLoading

  const createSampleData = async () => {
    sampleDataLoading = true

    try {
      await API.addSampleData($params.application)
      await tables.fetch()
      await datasources.fetch()
      $goto("./table")
    } catch (e) {
      sampleDataLoading = false
      notifications.error("Error creating datasource")
    }
  }

  const handleTemplateSelection = async (template: any) => {
    templateLoading = true

    try {
      // Find the REST integration from available integrations
      const restIntegration = $integrations.find(
        integration => integration.name === IntegrationTypes.REST
      )

      if (!restIntegration) {
        throw new Error("REST integration not found")
      }

      // Create REST datasource with the template URL as base config
      const config = {
        ...configFromIntegration(restIntegration),
        url: template.url,
      }

      const datasource = await datasources.create({
        integration: restIntegration,
        config,
        name: template.name,
        uiMetadata: { iconUrl: template.icon },
      })

      // Import queries from the OpenAPI specification
      const importData = {
        data: template.url, // URL to fetch the OpenAPI spec
        datasourceId: datasource._id,
        datasource,
      }

      await queries.importQueries(importData)

      // Refresh data stores
      await Promise.all([datasources.fetch(), queries.fetch()])

      // Navigate to the newly created datasource
      $goto(`./datasource/${datasource._id}`)

      notifications.success(
        `Created REST datasource from ${template.name} template`
      )
    } catch (error: any) {
      notifications.error(
        `Error creating datasource from template: ${error.message}`
      )
    } finally {
      templateLoading = false
    }
  }
</script>

<CreateInternalTableModal bind:this={internalTableModal} />

<CreateExternalDatasourceModal
  bind:loading={externalDatasourceLoading}
  bind:this={externalDatasourceModal}
/>

<RestTemplateModal
  bind:this={restTemplateModal}
  onSelect={handleTemplateSelection}
  onCancel={() => {}}
/>

<CreationPage
  showClose={hasData($datasources, $tables)}
  onClose={() => $goto("./table")}
  heading="Add new data source"
>
  <div class="subHeading">
    <Body>Get started with our Budibase DB</Body>
    <AbsTooltip text="Budibase DB is built with CouchDB">
      <Icon name="info" size="S" />
    </AbsTooltip>
  </div>

  <div class="options bb-options">
    <div class="ai-generation">
      <AiTableGeneration />
    </div>
    <DatasourceOption
      on:click={() => internalTableModal.show()}
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
      on:click={() => internalTableModal.show({ promptUpload: true })}
      title="Upload CSV / JSON"
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
    <DatasourceOption
      on:click={() => restTemplateModal.show()}
      title="REST Template"
      description="API"
      {disabled}
    >
      <svelte:component this={ICONS.REST_TEMPLATE} height="20" width="20" />
    </DatasourceOption>
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
</CreationPage>

<style>
  .subHeading {
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 24px;
    gap: 8px;
  }
  .subHeading :global(p) {
    color: var(--spectrum-global-color-gray-600) !important;
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
  .bb-options {
    max-width: calc(3 * 235px + 2 * 24px); /* 3 columns + 2 gaps */
  }
  .options .ai-generation {
    grid-column: 1 / -1;
  }
</style>
