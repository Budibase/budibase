<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import ListItem from "./ListItem.svelte"
  import CreateTableModal from "./modals/CreateTableModal.svelte"
  import EditTablePopover from "./popovers/EditTablePopover.svelte"
  import EditViewPopover from "./popovers/EditViewPopover.svelte"
  import { Heading } from "@budibase/bbui"
  import { Spacer } from "@budibase/bbui"

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
</script>

<div class="items-root">
  {#if $backendUiStore.selectedDatabase && $backendUiStore.selectedDatabase._id}
    <div class="hierarchy">
      <div class="components-list-container">
        <Heading small>Tables</Heading>
        <Spacer medium />
        <CreateTableModal />
        <div class="hierarchy-items-container">
          {#each $backendUiStore.tables as table}
            <ListItem
              selected={selectedView === `all_${table._id}`}
              title={table.name}
              icon="ri-table-fill"
              on:click={() => selectTable(table)}>
              <EditTablePopover table={table} />
            </ListItem>
            {#each Object.keys(table.views || {}) as viewName}
              <ListItem
                indented
                selected={selectedView === viewName}
                title={viewName}
                icon="ri-eye-line"
                on:click={() => (selectedView === viewName ? {} : selectView({
                        name: viewName,
                        ...table.views[viewName],
                      }))}>
                <EditViewPopover
                  view={{ name: viewName, ...table.views[viewName] }} />
              </ListItem>
            {/each}
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  h5 {
    font-size: 18px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: var(--spacing-xl);
  }

  .items-root {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  .hierarchy {
    display: flex;
    flex-direction: column;
  }

  .hierarchy-items-container {
    margin-top: var(--spacing-xl);
    flex: 1 1 auto;
  }
</style>
