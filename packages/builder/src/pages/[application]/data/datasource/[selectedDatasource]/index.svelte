<script>
  import { goto } from "@sveltech/routify"
  import { Button, Spacer, Icon } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"

  $: datasource = $backendUiStore.datasources.find(
    ds => ds._id === $backendUiStore.selectedDatasourceId
  )

  async function saveDatasource() {
    // Create datasource
    await backendUiStore.actions.datasources.save(datasource)
    notifier.success(`Datasource ${name} saved successfully.`)
  }

  function onClickQuery(query) {
    if ($backendUiStore.selectedQueryId === query._id) {
      return
    }
    backendUiStore.actions.queries.select(query)
    $goto(`../${query._id}`)
  }
</script>

{#if datasource}
  <section>
    <Spacer medium />
    <header>
      <h3 class="section-title">{datasource.name}</h3>
    </header>
    <Spacer extraLarge />
    <div class="container">
      <div class="config-header">
        <h5>Configuration</h5>
        <Button secondary on:click={saveDatasource}>Save</Button>
      </div>
      <Spacer medium />
      <IntegrationConfigForm integration={datasource.config} />
    </div>
    <Spacer extraLarge />
    <div class="container">
      <div class="query-header">
        <h5>Queries</h5>
        <Button blue on:click={() => $goto('../new')}>Create Query</Button>
      </div>
      <Spacer extraLarge />
      <div class="query-list">
        {#each $backendUiStore.queries.filter(query => query.datasourceId === datasource._id) as query}
          <div class="query-list-item" on:click={() => onClickQuery(query)}>
            <p class="query-name">{query.name}</p>
            <p>{query.queryVerb}</p>
            <p>4000 records</p>
            <p>→</p>
          </div>
        {/each}
        <Spacer medium />
      </div>
    </div>
  </section>

{/if}

<style>
  h3 {
    margin: 0;
  }
  section {
    margin: 0 auto;
    width: 800px;
  }

  header {
    margin: 0 0 var(--spacing-xs) 0;
  }

  .section-title {
    text-transform: capitalize;
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    margin: 0 0 var(--spacing-xs) 0;
  }

  .container {
    border-radius: var(--border-radius-m);
    background: var(--background);
    padding: var(--layout-s);
    margin: 0 auto;
  }

  h5 {
    margin: 0 !important;
  }

  .query-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 var(--spacing-s) 0;
  }

  .query-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .query-list-item {
    border-radius: var(--border-radius-m);
    background: var(--background);
    border: var(--border-grey);
    display: grid;
    grid-template-columns: 2fr 0.75fr 0.75fr 1fr 20px;
    align-items: center;
    padding: var(--spacing-m) var(--layout-xs);
    gap: var(--layout-xs);
    transition: 200ms background ease;
  }

  .query-list-item:hover {
    background: var(--grey-1);
    cursor: pointer;
  }

  p {
    font-size: var(--font-size-xs);
    color: var(--grey-8);
  }

  .query-name {
    color: var(--ink);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: var(--font-size-s);
  }
</style>
