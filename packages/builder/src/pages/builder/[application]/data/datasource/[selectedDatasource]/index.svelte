<script>
  import { goto, beforeUrlChange } from "@roxi/routify"
  import { Button, Heading, Body, Spacer, Divider } from "@budibase/bbui"
  import { datasources, integrations, queries } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import { capitalise } from "../../../../../../helpers"

  let unsaved = false

  $: datasource = $datasources.list.find(ds => ds._id === $datasources.selected)
  $: integration = datasource && $integrations[datasource.source]

  async function saveDatasource() {
    // Create datasource
    await datasources.save(datasource)
    notifications.success(`Datasource ${name} saved successfully.`)
    unsaved = false
  }

  function onClickQuery(query) {
    queries.select(query)
    $goto(`./${query._id}`)
  }

  function setUnsaved() {
    unsaved = true
  }

  $beforeUrlChange((event, store) => {
    if (unsaved) {
      notifications.error(
        "Unsaved changes. Please save your datasource configuration before leaving."
      )
      return false
    }
    return true
  })
</script>

{#if datasource}
  <section>
    <Spacer extraLarge />
    <header>
      <svelte:component
        this={ICONS[datasource.source]}
        height="26"
        width="26" />
      <Heading l>{datasource.name}</Heading>
    </header>
    <Body small grey lh>{integration.description}</Body>
    <Spacer extraLarge />
    <Divider />
    <Spacer extraLarge />
    <div class="container">
      <div class="config-header">
        <Heading>Configuration</Heading>
        <Button secondary on:click={saveDatasource}>Save</Button>
      </div>
      <Body small grey>
        Connect your database to Budibase using the config below.
      </Body>
      <Spacer extraLarge />
      <IntegrationConfigForm
        schema={integration.datasource}
        integration={datasource.config}
        on:change={setUnsaved} />
      <Spacer extraLarge />
      <Divider />
      <Spacer extraLarge />
      <div class="query-header">
        <Heading>Queries</Heading>
        <Button secondary on:click={() => $goto('./new')}>Add Query</Button>
      </div>
      <Spacer extraLarge />
      <div class="query-list">
        {#each $queries.list.filter(query => query.datasourceId === datasource._id) as query}
          <div class="query-list-item" on:click={() => onClickQuery(query)}>
            <p class="query-name">{query.name}</p>
            <p>{capitalise(query.queryVerb)}</p>
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
    font-size: 24px;
  }

  section {
    margin: 0 auto;
    width: 640px;
  }

  header {
    margin: 0 0 var(--spacing-xs) 0;
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
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
    border: var(--border-dark);
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
