<script>
  import { params } from "@roxi/routify"
  import { Tabs, Tab, Heading, Body, Layout } from "@budibase/bbui"
  import { datasources, integrations } from "@/stores/builder"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import EditDatasourceConfig from "./_components/EditDatasourceConfig.svelte"
  import TablesPanel from "./_components/panels/Tables/index.svelte"
  import RelationshipsPanel from "./_components/panels/Relationships.svelte"
  import QueriesPanel from "./_components/panels/Queries/index.svelte"
  import RestHeadersPanel from "./_components/panels/Headers.svelte"
  import RestAuthenticationPanel from "./_components/panels/Authentication/index.svelte"
  import RestVariablesPanel from "./_components/panels/Variables/index.svelte"
  import PromptQueryModal from "./_components/PromptQueryModal.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import Tooltip from "./_components/panels/Tooltip.svelte"
  import SaveDatasourceButton from "./_components/panels/SaveDatasourceButton.svelte"
  import { cloneDeep } from "lodash/fp"

  const REST_PANEL_SECTIONS = [
    { title: "", component: QueriesPanel },
    {
      title: "Authentication",
      component: RestAuthenticationPanel,
    },
    {
      title: "Headers",
      component: RestHeadersPanel,
    },
    {
      title: "Variables",
      component: RestVariablesPanel,
      tooltip: {
        title: "REST variables",
        href: "https://docs.budibase.com/docs/rest-variables",
      },
    },
  ]

  $params

  let selectedPanel = $params.tab ?? null
  let panelOptions = []
  let templateIcon

  $: datasource = $datasources.selected
  $: templateIcon =
    datasource?.restTemplate && $restTemplates
      ? restTemplates.getByName(datasource.restTemplate)?.icon
      : undefined

  $: isRestDatasource = datasource?.source === IntegrationTypes.REST
  $: getOptions(datasource)

  // Central updated datasource state for REST config edits
  let updatedDatasource
  let restConfigDirty = false
  $: if (
    datasource &&
    (!updatedDatasource || updatedDatasource._id !== datasource._id)
  ) {
    updatedDatasource = cloneDeep(datasource)
    restConfigDirty = false
  }

  const markDirty = () => {
    if (!updatedDatasource) {
      return
    }
    restConfigDirty = true
    // trigger reactivity for children like Save button
    updatedDatasource = { ...updatedDatasource }
  }

  const handleRestConfigSaved = () => {
    if (!updatedDatasource) {
      return
    }
    restConfigDirty = false
    updatedDatasource = cloneDeep(datasource ?? updatedDatasource)
  }

  const getOptions = datasource => {
    if (!datasource) {
      panelOptions = []
      selectedPanel = null
      return
    }

    if (datasource.plus) {
      // Google Sheets' integration definition specifies `relationships: false` as it doesn't support relationships like other plus datasources
      panelOptions =
        $integrations[datasource.source].relationships === false
          ? ["Tables", "Queries"]
          : ["Tables", "Relationships", "Queries"]
      selectedPanel = panelOptions.includes(selectedPanel)
        ? selectedPanel
        : "Tables"
    } else {
      const isRest = datasource.source === "REST"
      panelOptions = isRest ? [] : ["Queries"]
      selectedPanel = isRest ? null : "Queries"
    }
  }
</script>

<PromptQueryModal />

<section>
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <header>
        <IntegrationIcon
          integrationType={datasource?.source}
          schema={$integrations?.[datasource?.source]}
          iconUrl={templateIcon}
          size="26"
        />
        <Heading size="M">{$datasources.selected?.name}</Heading>
      </header>
    </Layout>
    <EditDatasourceConfig {datasource} />
    {#if isRestDatasource}
      <div class="rest-sections">
        {#each REST_PANEL_SECTIONS as restPanel (restPanel.title)}
          <div class="rest-section">
            {#if restPanel.title}
              <div class="rest-section__title">
                <Heading size="S" class="rest-section__heading">
                  {restPanel.title}
                </Heading>
                {#if restPanel.tooltip}
                  <Tooltip
                    title={restPanel.tooltip.title}
                    href={restPanel.tooltip.href}
                    showLabel={false}
                  />
                {/if}
              </div>
            {/if}
            {#if restPanel.component === QueriesPanel}
              <svelte:component this={restPanel.component} {datasource}>
                <SaveDatasourceButton
                  slot="global-save"
                  {datasource}
                  {updatedDatasource}
                  isDirty={restConfigDirty}
                  onSaved={handleRestConfigSaved}
                />
              </svelte:component>
            {:else}
              <svelte:component
                this={restPanel.component}
                {datasource}
                {updatedDatasource}
                {markDirty}
              />
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="tabs">
        <Tabs size="L" noPadding noHorizPadding selected={selectedPanel}>
          {#each panelOptions as panelOption}
            <Tab
              title={panelOption}
              on:click={() => (selectedPanel = panelOption)}
            />
          {/each}
        </Tabs>
      </div>

      {#if selectedPanel === null}
        <Body>loading...</Body>
      {:else if selectedPanel === "Tables"}
        <TablesPanel {datasource} />
      {:else if selectedPanel === "Relationships"}
        <RelationshipsPanel {datasource} />
      {:else if selectedPanel === "Queries"}
        <QueriesPanel {datasource} />
      {:else}
        <Body>Something went wrong</Body>
      {/if}
    {/if}
  </Layout>
</section>

<style>
  section {
    margin: 0 auto;
    width: 640px;
  }

  header {
    margin-top: 35px;
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
    margin-bottom: 12px;
  }

  .rest-sections {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxl);
    margin-top: var(--spacing-xl);
  }

  .rest-section {
    margin-bottom: 35px;
  }

  .rest-section__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    margin-bottom: var(--spacing-m);
  }
</style>
