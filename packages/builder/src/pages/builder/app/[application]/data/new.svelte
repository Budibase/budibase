<script lang="ts">
  import { API } from "@/api"
  import {
    tables,
    datasources,
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
  import { featureFlags } from "@/stores/portal"

  let internalTableModal: CreateInternalTableModal
  let externalDatasourceModal: CreateExternalDatasourceModal

  let sampleDataLoading = false
  let externalDatasourceLoading = false

  $: disabled = sampleDataLoading || externalDatasourceLoading
  $: aiTableGenerationEnabled = $featureFlags.AI_TABLE_GENERATION

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
</script>

<CreateInternalTableModal bind:this={internalTableModal} />

<CreateExternalDatasourceModal
  bind:loading={externalDatasourceLoading}
  bind:this={externalDatasourceModal}
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
    {#if aiTableGenerationEnabled}
      <div class="ai-generation">
        <AiTableGeneration />
      </div>
    {/if}
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
