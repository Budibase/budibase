<script>
  import { goto, beforeUrlChange } from "@roxi/routify"
  import { Button, Heading, Body, Divider, Layout, Modal } from "@budibase/bbui"
  import { datasources, integrations, queries, tables } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import CreateEditRelationship from "./CreateEditRelationship/CreateEditRelationship.svelte"
  import DisplayColumnModal from "./modals/EditDisplayColumnsModal.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import { capitalise } from "helpers"

  let unsaved = false
  let relationshipModal
  let displayColumnModal
  let selectedFromRelationship, selectedToRelationship

  $: datasource = $datasources.list.find(ds => ds._id === $datasources.selected)
  $: integration = datasource && $integrations[datasource.source]
  $: plusTables = datasource?.plus
    ? Object.values(datasource.entities || {})
    : []
  $: relationships = getRelationships(plusTables)

  function getRelationships(tables) {
    if (!tables || !Array.isArray(tables)) {
      return {}
    }
    let pairs = {}
    for (let table of tables) {
      for (let column of Object.values(table.schema)) {
        if (column.type !== "link") {
          continue
        }
        // these relationships have an id to pair them to each other
        // one has a main for the from side
        const key = column.main ? "from" : "to"
        pairs[column._id] = {
          ...pairs[column._id],
          [key]: column,
        }
      }
    }
    return pairs
  }

  function buildRelationshipDisplayString(fromCol, toCol) {
    function getTableName(tableId) {
      if (!tableId || typeof tableId !== "string") {
        return null
      }
      return plusTables.find(table => table._id === tableId)?.name || "Unknown"
    }
    if (!toCol || !fromCol) {
      return "Cannot build name"
    }
    const fromTableName = getTableName(toCol.tableId)
    const toTableName = getTableName(fromCol.tableId)
    const throughTableName = getTableName(fromCol.through)

    let displayString
    if (throughTableName) {
      displayString = `${fromTableName} through ${throughTableName} → ${toTableName}`
    } else {
      displayString = `${fromTableName} → ${toTableName}`
    }
    return displayString
  }

  async function saveDatasource() {
    try {
      // Create datasource
      await datasources.save(datasource)
      notifications.success(`Datasource ${name} updated successfully.`)
      unsaved = false
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
    }
  }

  async function updateDatasourceSchema() {
    try {
      await datasources.updateSchema(datasource)
      notifications.success(`Datasource ${name} tables updated successfully.`)
      unsaved = false
      await tables.fetch()
    } catch (err) {
      notifications.error(`Error updating datasource schema: ${err}`)
    }
  }

  function onClickQuery(query) {
    queries.select(query)
    $goto(`./${query._id}`)
  }

  function onClickTable(table) {
    tables.select(table)
    $goto(`../../table/${table._id}`)
  }

  function setUnsaved() {
    unsaved = true
  }

  function openRelationshipModal(fromRelationship, toRelationship) {
    selectedFromRelationship = fromRelationship || {}
    selectedToRelationship = toRelationship || {}
    relationshipModal.show()
  }

  function openDisplayColumnModal() {
    displayColumnModal.show()
  }

  $beforeUrlChange(() => {
    if (unsaved) {
      notifications.error(
        "Unsaved changes. Please save your datasource configuration before leaving."
      )
      return false
    }
    return true
  })
</script>

<Modal bind:this={relationshipModal}>
  <CreateEditRelationship
    {datasource}
    save={saveDatasource}
    close={relationshipModal.hide}
    {plusTables}
    fromRelationship={selectedFromRelationship}
    toRelationship={selectedToRelationship}
  />
</Modal>

<Modal bind:this={displayColumnModal}>
  <DisplayColumnModal {datasource} {plusTables} save={saveDatasource} />
</Modal>

{#if datasource && integration}
  <section>
    <Layout>
      <Layout gap="XS" noPadding>
        <header>
          <svelte:component
            this={ICONS[datasource.source]}
            height="26"
            width="26"
          />
          <Heading size="M">{datasource.name}</Heading>
        </header>
        <Body size="M">{integration.description}</Body>
      </Layout>
      <Divider />
      <div class="container">
        <div class="config-header">
          <Heading size="S">Configuration</Heading>
          <Button secondary on:click={saveDatasource}>Save</Button>
        </div>
        <Body size="S">
          Connect your database to Budibase using the config below.
        </Body>
        <IntegrationConfigForm
          schema={integration.datasource}
          integration={datasource.config}
          on:change={setUnsaved}
        />
      </div>
      {#if datasource.plus}
        <Divider />
        <div class="query-header">
          <Heading size="S">Tables</Heading>
          <div class="table-buttons">
            {#if plusTables && plusTables.length !== 0}
              <Button primary on:click={openDisplayColumnModal}>
                Update display columns
              </Button>
            {/if}
            <div>
              <Button primary on:click={updateDatasourceSchema}>
                Fetch tables from database
              </Button>
            </div>
          </div>
        </div>
        <Body>
          This datasource can determine tables automatically. Budibase can fetch
          your tables directly from the database and you can use them without
          having to write any queries at all.
        </Body>
        <div class="query-list">
          {#each plusTables as table}
            <div class="query-list-item" on:click={() => onClickTable(table)}>
              <p class="query-name">{table.name}</p>
              <p>Primary Key: {table.primary}</p>
              <p>→</p>
            </div>
          {/each}
        </div>
        {#if plusTables?.length !== 0}
          <Divider />
          <div class="query-header">
            <Heading size="S">Relationships</Heading>
            <Button primary on:click={() => openRelationshipModal()}
              >Create relationship</Button
            >
          </div>
          <Body>
            Tell budibase how your tables are related to get even more smart
            features.
          </Body>
        {/if}
        <div class="query-list">
          {#each Object.values(relationships) as relationship}
            <div
              class="query-list-item"
              on:click={() =>
                openRelationshipModal(relationship.from, relationship.to)}
            >
              <p class="query-name">
                {buildRelationshipDisplayString(
                  relationship.from,
                  relationship.to
                )}
              </p>
              <p>{relationship.from?.name} to {relationship.to?.name}</p>
              <p>→</p>
            </div>
          {/each}
        </div>
      {/if}
      <Divider />
      <div class="query-header">
        <Heading size="S">Queries</Heading>
        <Button secondary on:click={() => $goto("./new")}>Add Query</Button>
      </div>
      <div class="query-list">
        {#each $queries.list.filter(query => query.datasourceId === datasource._id) as query}
          <div class="query-list-item" on:click={() => onClickQuery(query)}>
            <p class="query-name">{query.name}</p>
            <p>{capitalise(query.queryVerb)}</p>
            <p>→</p>
          </div>
        {/each}
      </div>
    </Layout>
  </section>
{/if}

<style>
  section {
    margin: 0 auto;
    width: 640px;
  }

  header {
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
    width: 100%;
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

  .table-buttons {
    display: grid;
    grid-gap: var(--spacing-l);
    grid-template-columns: 1fr 1fr;
  }

  .table-buttons div {
    grid-column-end: -1;
  }
</style>
