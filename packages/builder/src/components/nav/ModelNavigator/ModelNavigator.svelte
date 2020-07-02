<script>
  import { getContext } from "svelte"
  import { slide } from "svelte/transition"
  import { Switcher } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { store, backendUiStore } from "builderStore"
  import BlockNavigator from "./BlockNavigator.svelte"
  import ListItem from "./ListItem.svelte"
  import { Button } from "@budibase/bbui"

  const { open, close } = getContext("simple-modal")

  let HEADINGS = [
    {
      title: "Navigate",
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

  function setupForNewModel() {
    backendUiStore.update(state => {
      state.selectedModel = {}
      state.draftModel = { schema: {} }
      state.tabs.SETUP_PANEL = "SETUP"
      return state
    })
  }
</script>

<div class="items-root">
  {#if $backendUiStore.selectedDatabase && $backendUiStore.selectedDatabase._id}
    <div class="hierarchy">
      <div class="components-list-container">
        <Switcher
          headings={HEADINGS}
          bind:value={$backendUiStore.tabs.NAVIGATION_PANEL}>
          {#if selectedTab === 'NAVIGATE'}
            <Button purple wide on:click={setupForNewModel}>
              Create New Table
            </Button>
            <div class="hierarchy-items-container">
              {#each $backendUiStore.models as model}
                <ListItem
                  selected={!$backendUiStore.selectedField && model._id === $backendUiStore.selectedModel._id}
                  title={model.name}
                  icon="ri-table-fill"
                  on:click={() => selectModel(model)} />
                {#if model._id === $backendUiStore.selectedModel._id}
                  <div in:slide>
                    {#each Object.keys(model.schema) as fieldName}
                      <ListItem
                        selected={model._id === $backendUiStore.selectedModel._id && fieldName === $backendUiStore.selectedField}
                        indented
                        icon="ri-layout-column-fill"
                        title={model.schema[fieldName].name}
                        on:click={() => selectModel(model, fieldName)} />
                    {/each}
                  </div>
                {/if}
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
