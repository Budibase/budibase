<script>
  import { getContext } from "svelte"
  import { Switcher } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { store, backendUiStore } from "builderStore"
  import BlockNavigator from "./BlockNavigator.svelte";
  import SchemaManagementDrawer from "../SchemaManagementDrawer.svelte"
  import HierarchyRow from "../HierarchyRow.svelte"
  import ListItem from "./ListItem.svelte"
  import { Button } from "@budibase/bbui"

  const { open, close } = getContext("simple-modal")

  const HEADINGS = [
    {
      title: "Navigate",
      key: "NAVIGATE",
    },
    {
      title: "Add",
      key: "ADD",
    },
  ]

  let selectedTab = "NAVIGATE"

  function selectModel(model) {
    backendUiStore.actions.models.select(model)
  }

  function selectField() {}
</script>

<div class="items-root">
  {#if $backendUiStore.selectedDatabase._id}
    <div class="hierarchy">
      <div class="components-list-container">
        <Switcher headings={HEADINGS} bind:value={selectedTab}>
          {#if selectedTab === 'NAVIGATE'}
            <Button
              secondary
              wide
              on:click={() => $goto(`./database/${$backendUiStore.selectedDatabase._id}/newmodel`)}>
              Create New Model
            </Button>
            <div class="hierarchy-items-container">
              {#each $backendUiStore.models as model}
                <ListItem
                  selected={model._id === $backendUiStore.selectedModel._id}
                  title={model.name}
                  icon="ri-table-fill"
                  on:click={() => selectModel(model)} />
                {#each Object.keys(model.schema) as field}
                  <ListItem
                    indented
                    icon="ri-layout-column-fill"
                    title={field}
                    on:click={() => selectField(model.schema[field])} />
                {/each}
              {/each}
            </div>
          {:else if selectedTab === 'ADD'}
            <BlockNavigator />
          {/if}
        </Switcher>
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
