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
  import SettingsPanel from "./_components/panels/Settings.svelte"
  import { helpers } from "@budibase/shared-core"
  import { admin } from "@/stores/portal"
  import { IntegrationTypes } from "@/constants/backend"
  import Tooltip from "./_components/panels/Tooltip.svelte"

  const REST_PANEL_SECTIONS = [
    { title: "", component: QueriesPanel },
    {
      title: "Headers",
      component: RestHeadersPanel,
      tooltip: {
        title: "REST Headers",
        href: "https://docs.budibase.com/docs/rest-queries#headers",
      },
    },
    {
      title: "Authentication",
      component: RestAuthenticationPanel,
      tooltip: {
        title: "REST Authentication",
        href: "https://docs.budibase.com/docs/rest-authentication",
      },
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

  let selectedPanel = $params.tab ?? null
  let panelOptions = []

  $: datasource = $datasources.selected
  $: templateIcon = datasource?.restTemplate
    ? $restTemplates.templates.find(
        template => template.name === datasource.restTemplate
      )?.icon
    : undefined

  $: isCloud = $admin.cloud
  $: isPostgres = datasource?.source === IntegrationTypes.POSTGRES
  $: isRestDatasource = datasource?.source === IntegrationTypes.REST
  $: getOptions(datasource)

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
    // always the last option for SQL
    if (!isRestDatasource && helpers.isSQL(datasource)) {
      if (isCloud && isPostgres) {
        // We don't show the settings panel for Postgres on Budicloud because
        // it requires pg_dump to work and we don't want to enable shell injection
        // attacks.
      } else {
        panelOptions.push("Settings")
      }
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
            <svelte:component this={restPanel.component} {datasource} />
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
      {:else if selectedPanel === "Settings"}
        <SettingsPanel {datasource} />
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

  .rest-section__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    margin-bottom: var(--spacing-m);
  }
</style>
