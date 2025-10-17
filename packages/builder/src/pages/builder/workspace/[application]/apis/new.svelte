<script lang="ts">
  import CreateExternalDatasourceModal from "../data/_components/CreateExternalDatasourceModal/index.svelte"
  import DatasourceOption from "../data/_components/DatasourceOption.svelte"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import {
    sortedIntegrations as integrations,
    datasources,
  } from "@/stores/builder"
  import { IntegrationTypes } from "@/constants/backend"
  import { goto } from "@roxi/routify"

  let externalDatasourceModal: CreateExternalDatasourceModal
  let externalDatasourceLoading = false

  $: restIntegration = ($integrations || []).find(
    integration => integration.name === IntegrationTypes.REST
  )

  $: restDatasources = ($datasources.list || []).filter(
    datasource => datasource.source === IntegrationTypes.REST
  )
  $: hasRestDatasources = restDatasources.length > 0

  $: disabled = externalDatasourceLoading

  const openRestModal = () => {
    if (!restIntegration) {
      return
    }
    externalDatasourceModal.show(restIntegration)
  }

  const close = () => {
    if (restDatasources.length) {
      $goto(`./datasource/${restDatasources[0]._id}`)
    } else {
      $goto("../")
    }
  }
</script>

<CreateExternalDatasourceModal
  bind:loading={externalDatasourceLoading}
  bind:this={externalDatasourceModal}
/>

<CreationPage
  showClose={hasRestDatasources}
  onClose={close}
  heading="Add new API"
>
  {#if restIntegration}
    <div class="options">
      <DatasourceOption
        on:click={openRestModal}
        title="REST API"
        description={restIntegration.type}
        {disabled}
      >
        <IntegrationIcon
          integrationType={restIntegration.name}
          schema={restIntegration}
        />
      </DatasourceOption>
    </div>
  {:else}
    <p class="empty-state">REST API integration is unavailable.</p>
  {/if}
</CreationPage>

<style>
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

  .empty-state {
    text-align: center;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
