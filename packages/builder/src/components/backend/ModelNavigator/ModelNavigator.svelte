<script>
  import { getContext } from "svelte"
  import { slide } from "svelte/transition"
  import { Switcher } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { store, backendUiStore } from "builderStore"
  import ListItem from "./ListItem.svelte"
  import { Button } from "@budibase/bbui"
  import CreateTablePopover from "./CreateTable.svelte"
  import EditTablePopover from "./EditTable.svelte"
  import EditViewPopover from "./EditView.svelte"

  const { open, close } = getContext("simple-modal")

  $: selectedView =
    $backendUiStore.selectedView && $backendUiStore.selectedView.name

  function selectModel(model) {
    backendUiStore.actions.models.select(model)
    $goto(`./model/${model._id}`)
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
        <h5>Tables</h5>
        <CreateTablePopover />
        <div class="hierarchy-items-container">
          {#each $backendUiStore.models as model}
            <ListItem
              selected={selectedView === `all_${model._id}`}
              title={model.name}
              icon="ri-table-fill"
              on:click={() => selectModel(model)}>
              <EditTablePopover table={model} />
            </ListItem>
            {#each Object.keys(model.views || {}) as viewName}
              <ListItem
                indented
                selected={selectedView === viewName}
                title={viewName}
                icon="ri-eye-line"
                on:click={() => (selectedView === viewName ? {} : selectView({
                        name: viewName,
                        ...model.views[viewName],
                      }))}>
                <EditViewPopover
                  view={{ name: viewName, ...model.views[viewName] }} />
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
