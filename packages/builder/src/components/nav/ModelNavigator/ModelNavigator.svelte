<script>
  import { getContext } from "svelte"
  import { slide } from "svelte/transition"
  import { Switcher } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { store, backendUiStore } from "builderStore"
  import ListItem from "./ListItem.svelte"
  import { Button } from "@budibase/bbui"
  import CreateTablePopover from "./CreateEditTable.svelte"

  const { open, close } = getContext("simple-modal")

  let HEADINGS = [
    {
      title: "Tables",
      key: "TABLES",
    },
    {
      title: "Tables",
      key: "NAVIGATE",
    },
    {
      title: "Add",
      key: "ADD",
    },
  ]

  $: selectedTab = $backendUiStore.tabs.NAVIGATION_PANEL

  function selectModel(model, fieldId) {
    backendUiStore.actions.models.select(model)
    $goto(`./model/${model._id}`)
    if (fieldId) {
      backendUiStore.update(state => {
        state.selectedField = fieldId
        return state
      })
    }
  }
</script>

<div class="items-root">
  {#if $backendUiStore.selectedDatabase && $backendUiStore.selectedDatabase._id}
    <div class="hierarchy">
      <div class="components-list-container">
        <h3>Tables</h3>
        <CreateTablePopover />
        <div class="hierarchy-items-container">
          {#each $backendUiStore.models as model}
            <ListItem
              selected={!$backendUiStore.selectedField && model._id === $backendUiStore.selectedModel._id}
              title={model.name}
              icon="ri-table-fill"
              on:click={() => selectModel(model)}>

              </ListItem>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .items-root {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
    background: var(--white);
    padding: 20px;
  }

  .hierarchy {
    display: flex;
    flex-direction: column;
  }

  .hierarchy-items-container {
    margin-top: 20px;
    flex: 1 1 auto;
  }
</style>
