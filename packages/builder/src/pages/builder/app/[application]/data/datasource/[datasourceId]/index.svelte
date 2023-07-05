<script>
  import { Tabs, Tab, Heading, Body, Layout } from "@budibase/bbui"
  import { datasources, integrations } from "stores/backend"
  import ICONS from "components/backend/DatasourceNavigator/icons"
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

  let selectedPanel = null
  let panelOptions = []

  // datasources.selected can return null temporarily on datasource deletion
  $: datasource = $datasources.selected || {}

  $: getOptions(datasource)

  const getOptions = datasource => {
    if (datasource.plus) {
      // Google Sheets' integration definition specifies `relationships: false` as it doesn't support relationships like other plus datasources
      panelOptions =
        $integrations[datasource.source].relationships === false
          ? ["Tables", "Queries"]
          : ["Tables", "Relationships", "Queries"]
      selectedPanel = panelOptions.includes(selectedPanel)
        ? selectedPanel
        : "Tables"
    } else if (datasource.source === "REST") {
      panelOptions = ["Queries", "Headers", "Authentication", "Variables"]
      selectedPanel = panelOptions.includes(selectedPanel)
        ? selectedPanel
        : "Queries"
    } else {
      panelOptions = ["Queries"]
      selectedPanel = "Queries"
    }
    // always the last option for SQL
    if (helpers.isSQL(datasource)) {
      panelOptions.push("Settings")
    }
  }
</script>

<PromptQueryModal />

<section>
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <header>
        <svelte:component
          this={ICONS[datasource.source]}
          height="26"
          width="26"
        />
        <Heading size="M">{$datasources.selected?.name}</Heading>
      </header>
    </Layout>
    <EditDatasourceConfig {datasource} />
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
    {:else if selectedPanel === "Headers"}
      <RestHeadersPanel {datasource} />
    {:else if selectedPanel === "Authentication"}
      <RestAuthenticationPanel {datasource} />
    {:else if selectedPanel === "Variables"}
      <RestVariablesPanel {datasource} />
    {:else if selectedPanel === "Settings"}
      <SettingsPanel {datasource} />
    {:else}
      <Body>Something went wrong</Body>
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

  .tabs {
  }
</style>
