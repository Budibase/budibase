<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import ListItem from "./ListItem.svelte"
  import CreateTableModal from "./modals/CreateTableModal.svelte"
  import EditTablePopover from "./popovers/EditTablePopover.svelte"
  import EditViewPopover from "./popovers/EditViewPopover.svelte"
  import { Modal } from "@budibase/bbui"
  import NavItem from "components/common/NavItem.svelte"

  let modal

  $: selectedView =
    $backendUiStore.selectedView && $backendUiStore.selectedView.name

  function selectTable(table) {
    backendUiStore.actions.tables.select(table)
    $goto(`./table/${table._id}`)
  }

  function selectView(view) {
    backendUiStore.actions.views.select(view)
    $goto(`./view/${view.name}`)
  }

  function onClickView(table, viewName) {
    if (selectedView === viewName) {
      return
    }
    selectView({
      name: viewName,
      ...table.views[viewName],
    })
  }
</script>

{#if $backendUiStore.selectedDatabase && $backendUiStore.selectedDatabase._id}
  <div class="title">
    <h1>Tables</h1>
    <i data-cy="new-table" on:click={modal.show} class="ri-add-circle-fill" />
  </div>
  <div class="hierarchy-items-container">
    {#each $backendUiStore.tables as table, idx}
      <NavItem
        border={idx > 0}
        icon={table.integration?.type ? 'ri-database-2-line' : 'ri-table-line'}
        text={table.name}
        selected={selectedView === `all_${table._id}`}
        on:click={() => selectTable(table)}>
        <EditTablePopover {table} />
      </NavItem>
      {#each Object.keys(table.views || {}) as viewName}
        <NavItem
          indentLevel={1}
          icon="ri-eye-line"
          text={viewName}
          selected={selectedView === viewName}
          on:click={() => onClickView(table, viewName)}>
          <EditViewPopover
            view={{ name: viewName, ...table.views[viewName] }} />
        </NavItem>
      {/each}
    {/each}
  </div>
{/if}
<Modal bind:this={modal}>
  <CreateTableModal />
</Modal>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .title h1 {
    font-size: var(--font-size-m);
    font-weight: 500;
    margin: 0;
  }
  .title i {
    font-size: 20px;
  }
  .title i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>
