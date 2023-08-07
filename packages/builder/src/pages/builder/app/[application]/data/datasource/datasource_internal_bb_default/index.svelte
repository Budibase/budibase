<script>
  import { Button, Heading, Body, Layout, Modal, Divider } from "@budibase/bbui"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import { tables, datasources } from "stores/backend"
  import { goto } from "@roxi/routify"
  import { DEFAULT_BB_DATASOURCE_ID } from "constants/backend"
  import { onMount } from "svelte"
  import { store } from "builderStore"

  let modal

  $: store.actions.websocket.selectResource(DEFAULT_BB_DATASOURCE_ID)
  $: internalTablesBySourceId = $tables.list.filter(
    table =>
      table.type !== "external" && table.sourceId === DEFAULT_BB_DATASOURCE_ID
  )

  onMount(() => {
    datasources.select(DEFAULT_BB_DATASOURCE_ID)
  })
</script>

<Modal bind:this={modal}>
  <CreateTableModal />
</Modal>

<section>
  <Layout>
    <Layout gap="XS" noPadding>
      <header>
        <svelte:component this={ICONS.BUDIBASE} height="26" width="26" />
        <Heading size="M">Sample Data</Heading>
      </header>
      <Body size="M">
        A little something to get you up and running!
        <br />
        If you have no need for this datasource, feel free to delete it.
      </Body>
    </Layout>
    <Divider />
    <Heading size="S">Tables</Heading>
    <div class="table-list">
      <!-- {JSON.stringify($tables.list.map(source => source.sourceId))} -->
      {#each internalTablesBySourceId as table}
        <div
          class="table-list-item"
          on:click={$goto(`../../table/${table._id}`)}
        >
          <Body size="S">{table.name}</Body>
          {#if table.primaryDisplay}
            <Body size="S">Display column: {table.primaryDisplay}</Body>
          {/if}
        </div>
      {/each}
    </div>
    <div>
      <Button cta on:click={modal.show}>Create new table</Button>
    </div>
  </Layout>
</section>

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

  .table-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .table-list-item {
    border-radius: var(--border-radius-m);
    background: var(--background);
    border: var(--border-dark);
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: var(--spacing-m);
    gap: var(--layout-xs);
    transition: 200ms background ease;
  }

  .table-list-item:hover {
    background: var(--grey-1);
    cursor: pointer;
  }
</style>
