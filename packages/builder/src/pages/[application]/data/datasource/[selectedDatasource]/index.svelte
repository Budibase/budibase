<script>
  import { goto } from "@sveltech/routify"
  import { Button, Heading, Body, Spacer, Icon } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons"

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
      <div class="datasource-icon">
        <svelte:component
          this={ICONS[datasource.source]}
          height="30"
          width="30" />
      </div>
      <h3 class="section-title">{datasource.name}</h3>
    </header>
    <Spacer extraLarge />
    <div class="container">

      <div class="config-header">
        <Heading small>Configuration</Heading>
        <Button secondary on:click={saveDatasource}>Save</Button>
      </div>
      <Body small grey>
        Connect your database to Budibase using the config below.
      </Body>

      <Spacer medium />
      <IntegrationConfigForm integration={datasource.config} />

      <hr />

      <Spacer extraLarge />

      <div class="query-header">
        <Heading small>Queries</Heading>
        <Button secondary on:click={() => $goto('../new')}>Add Query</Button>
      </div>
      <Spacer extraLarge />
      <div class="query-list">
        {#each $backendUiStore.queries.filter(query => query.datasourceId === datasource._id) as query}
          <div class="query-list-item" on:click={() => onClickQuery(query)}>
            <p class="query-name">{query.name}</p>
            <p>{query.queryVerb}</p>
            <p>→</p>
          </div>
        {/each}
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
    display: flex;
    gap: var(--spacing-m);
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
    margin: 0 auto;
  }

  h5 {
    margin: 0 !important;
    font-size: var(--font-size-l);
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
    grid-template-columns: 2fr 0.75fr 20px;
    align-items: center;
    padding-left: var(--spacing-m);
    padding-right: var(--spacing-m);
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
