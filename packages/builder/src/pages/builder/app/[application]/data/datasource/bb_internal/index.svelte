<script>
  import { Button, Heading, Body, Layout, Modal, Divider } from "@budibase/bbui"
  import CreateTableModal from "@/components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import ICONS from "@/components/backend/DatasourceNavigator/icons"
  import { tables, datasources, builderStore } from "@/stores/builder"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    DB_TYPE_EXTERNAL,
  } from "@/constants/backend"
  import { TableNames } from "@/constants"

  let modal

  $: builderStore.selectResource(BUDIBASE_INTERNAL_DB_ID)
  $: internalTablesBySourceId = $tables.list.filter(
    table =>
      table.sourceType !== DB_TYPE_EXTERNAL &&
      table.sourceId === BUDIBASE_INTERNAL_DB_ID &&
      table._id !== TableNames.USERS
  )

  onMount(() => {
    datasources.select(BUDIBASE_INTERNAL_DB_ID)
  })
</script>

<Modal bind:this={modal}>
  <CreateTableModal />
</Modal>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<section>
  <Layout>
    <Layout gap="XS" noPadding>
      <header>
        <svelte:component this={ICONS.BUDIBASE} height="26" width="26" />
        <Heading size="M">Budibase Internal</Heading>
      </header>
      <Body size="M">
        Budibase internal tables are part of your app, so the data will be
        stored in your app's context.
      </Body>
    </Layout>
    <Divider />
    <Heading size="S">Tables</Heading>
    <div class="table-list">
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
