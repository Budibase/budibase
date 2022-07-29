<script>
  import { Button, Heading, Body, Layout, Modal, Divider } from "@budibase/bbui"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import { tables } from "stores/backend"
  import { goto } from "@roxi/routify"

  let modal
</script>

<Modal bind:this={modal}>
  <CreateTableModal />
</Modal>

<section>
  <Layout>
    <Layout gap="XS" noPadding>
      <header>
        <svelte:component this={ICONS.BUDIBASE} height="26" width="26" />
        <Heading size="M">Budibase DB</Heading>
      </header>
      <Body size="M">
        Budibase internal tables are part of your app, so the data will be
        stored in your apps context.
      </Body>
    </Layout>
    <Divider />
    <Heading size="S">Tables</Heading>
    <div class="table-list">
      {#each $tables.list.filter(table => table.type !== "external") as table}
        <div
          class="table-list-item"
          on:click={$goto(`../../table/${table._id}`)}
        >
          <Heading size="XXS">{table.name}</Heading>
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
    margin: var(--spacing-l) 0;
  }

  .table-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .table-list-item {
    border-radius: var(--border-radius-s);
    background: var(--background);
    border: var(--border-dark);
    display: grid;
    grid-template-columns: 2fr 0.75fr 20px;
    align-items: center;
    padding: var(--spacing-m) var(--spacing-xl);
    gap: var(--layout-xs);
    transition: 200ms background ease;
  }

  .table-list-item:hover {
    background: var(--grey-1);
    cursor: pointer;
  }
</style>
