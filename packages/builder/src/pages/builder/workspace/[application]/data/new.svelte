<script lang="ts">
  import { API } from "@/api"
  import {
    tables,
    datasources,
    sortedIntegrations as integrations,
  } from "@/stores/builder"

  import { hasData } from "@/stores/selectors"
  import { notifications, Body, Icon, AbsTooltip } from "@budibase/bbui"
  import {
    beforeUrlChange,
    params as paramsStore,
    goto as gotoStore,
  } from "@roxi/routify"
  import CreateExternalDatasourceModal from "./_components/CreateExternalDatasourceModal/index.svelte"
  import CreateInternalTableModal from "./_components/CreateInternalTableModal.svelte"
  import DatasourceOption from "./_components/DatasourceOption.svelte"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import ICONS from "@/components/backend/DatasourceNavigator/icons/index.js"
  import AiTableGeneration from "./_components/AITableGeneration.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { onMount } from "svelte"

  $beforeUrlChange

  // Capture store values for use in async callbacks (Svelte 5 compatibility)
  $: goto = $gotoStore
  $: params = $paramsStore

  let internalTableModal: CreateInternalTableModal
  let externalDatasourceModal: CreateExternalDatasourceModal

  let sampleDataLoading = false
  let externalDatasourceLoading = false

  $: disabled = sampleDataLoading || externalDatasourceLoading

  const createSampleData = async () => {
    sampleDataLoading = true

    try {
      await API.addSampleData(params.application)
      await tables.fetch()
      await datasources.fetch()
      goto("./table")
    } catch (e) {
      sampleDataLoading = false
      notifications.error("Error creating datasource")
    }
  }

  const consumeCreateParam = (urlString?: string) => {
    if (typeof window === "undefined") {
      return
    }

    const parsed = new URL(urlString ?? window.location.href)
    const create = parsed.searchParams.get("create")
    if (create !== "table") {
      return
    }

    internalTableModal?.show()

    parsed.searchParams.delete("create")
    const query = parsed.searchParams.toString()
    history.replaceState(
      {},
      "",
      `${parsed.pathname}${query ? `?${query}` : ""}`
    )
  }

  $beforeUrlChange((event: { url?: string } | undefined) => {
    if (typeof window === "undefined") {
      return true
    }

    const nextUrl = typeof event?.url === "string" ? event.url : ""
    if (!nextUrl) {
      return true
    }

    const parsed = new URL(nextUrl, window.location.origin)
    if (!parsed.pathname.endsWith("/data/new")) {
      return true
    }

    if (parsed.searchParams.get("create") !== "table") {
      return true
    }

    setTimeout(() => {
      consumeCreateParam(parsed.toString())
    }, 0)

    return true
  })

  onMount(() => {
    consumeCreateParam()
  })
</script>

<CreateInternalTableModal bind:this={internalTableModal} />

<CreateExternalDatasourceModal
  bind:loading={externalDatasourceLoading}
  bind:this={externalDatasourceModal}
/>

<CreationPage
  showClose={hasData($datasources, $tables)}
  onClose={() => goto("./table")}
  heading="Add new data source"
>
  <div class="bb-section">
    <div class="ai-generation">
      <AiTableGeneration />
    </div>
    <div class="subHeading bb-subheading">
      <Body>Get started with our Budibase DB</Body>
      <AbsTooltip text="Budibase DB is built with CouchDB">
        <Icon name="info" size="S" />
      </AbsTooltip>
    </div>
    <div class="options bb-options">
      <DatasourceOption
        on:click={() => internalTableModal.show()}
        title="Create new table"
        {disabled}
      >
        <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
      </DatasourceOption>
      <DatasourceOption
        on:click={createSampleData}
        title="Use sample data"
        disabled={disabled || $datasources.hasDefaultData}
      >
        <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
      </DatasourceOption>
      <DatasourceOption
        on:click={() => internalTableModal.show({ promptUpload: true })}
        title="Upload CSV / JSON"
        {disabled}
      >
        <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
      </DatasourceOption>
    </div>
  </div>

  <div class="subHeading">
    <Body>Or connect to an external datasource</Body>
  </div>

  <div class="options">
    {#each $integrations.filter(integration => integration.name !== IntegrationTypes.REST) as integration}
      <DatasourceOption
        on:click={() => externalDatasourceModal.show(integration)}
        title={integration.friendlyName}
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
  .bb-section {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .bb-options {
    max-width: calc(3 * 235px + 2 * 24px); /* 3 columns + 2 gaps */
  }
  .bb-subheading {
    justify-content: flex-start;
  }
</style>
