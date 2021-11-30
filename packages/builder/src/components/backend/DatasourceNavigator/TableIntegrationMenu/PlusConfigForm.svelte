<script>
  import {
    Button,
    Heading,
    Body,
    Divider,
    InlineAlert,
    ActionButton,
    notifications,
    Modal,
  } from "@budibase/bbui"
  import { datasources, integrations, tables } from "stores/backend"
  import CreateEditRelationship from "components/backend/Datasources/CreateEditRelationship.svelte"
  import CreateExternalTableModal from "./CreateExternalTableModal.svelte"
  import { goto } from "@roxi/routify"

  export let datasource
  export let save

  let relationshipModal
  let createExternalTableModal
  let selectedFromRelationship, selectedToRelationship

  $: integration = datasource && $integrations[datasource.source]
  $: plusTables = datasource?.plus
    ? Object.values(datasource?.entities || {})
    : []
  $: relationships = getRelationships(plusTables)
  $: schemaError = $datasources.schemaError

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

  async function updateDatasourceSchema() {
    try {
      await datasources.updateSchema(datasource)
      notifications.success(`Datasource ${name} tables updated successfully.`)
      await tables.fetch()
    } catch (err) {
      notifications.error(`Error updating datasource schema: ${err}`)
    }
  }

  function onClickTable(table) {
    tables.select(table)
    $goto(`../../table/${table._id}`)
  }

  function openRelationshipModal(fromRelationship, toRelationship) {
    selectedFromRelationship = fromRelationship || {}
    selectedToRelationship = toRelationship || {}
    relationshipModal.show()
  }

  function createNewTable() {
    createExternalTableModal.show()
  }
</script>

<Modal bind:this={relationshipModal}>
  <CreateEditRelationship
    {datasource}
    {save}
    close={relationshipModal.hide}
    {plusTables}
    fromRelationship={selectedFromRelationship}
    toRelationship={selectedToRelationship}
  />
</Modal>

<Modal bind:this={createExternalTableModal}>
  <CreateExternalTableModal {datasource} />
</Modal>

<Divider />
<div class="query-header">
  <Heading size="S">Tables</Heading>
  <div class="table-buttons">
    <div>
      <ActionButton
        size="S"
        quiet
        icon="DataRefresh"
        on:click={updateDatasourceSchema}
      >
        Fetch tables from database
      </ActionButton>
    </div>
  </div>
</div>
<Body>
  This datasource can determine tables automatically. Budibase can fetch your
  tables directly from the database and you can use them without having to write
  any queries at all.
</Body>
{#if schemaError}
  <InlineAlert
    type="error"
    header="Error fetching tables"
    message={schemaError}
    onConfirm={datasources.removeSchemaError}
  />
{/if}
<div class="query-list">
  {#each plusTables as table}
    <div class="query-list-item" on:click={() => onClickTable(table)}>
      <p class="query-name">{table.name}</p>
      <p>Primary Key: {table.primary}</p>
      <p>→</p>
    </div>
  {/each}
  <div class="add-table">
    <Button cta on:click={createNewTable}>Create new table</Button>
  </div>
</div>
{#if plusTables?.length !== 0}
  <Divider />
  <div class="query-header">
    <Heading size="S">Relationships</Heading>
    <ActionButton
      icon="DataCorrelated"
      primary
      size="S"
      quiet
      on:click={openRelationshipModal}
    >
      Define existing relationship
    </ActionButton>
  </div>
  <Body>
    Tell budibase how your tables are related to get even more smart features.
  </Body>
{/if}
<div class="query-list">
  {#each Object.values(relationships) as relationship}
    <div
      class="query-list-item"
      on:click={() => openRelationshipModal(relationship.from, relationship.to)}
    >
      <p class="query-name">
        {buildRelationshipDisplayString(relationship.from, relationship.to)}
      </p>
      <p>{relationship.from?.name} to {relationship.to?.name}</p>
      <p>→</p>
    </div>
  {/each}
</div>

<style>
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
    grid-template-columns: 1fr 1fr;
  }

  .table-buttons div {
    grid-column-end: -1;
  }

  .add-table {
    margin-top: var(--spacing-m);
  }
</style>
