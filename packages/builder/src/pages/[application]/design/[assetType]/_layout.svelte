<script>
  import {
    store,
    backendUiStore,
    currentAsset,
    selectedComponent,
  } from "builderStore"
  import { onMount } from "svelte"
  import CurrentItemPreview from "components/userInterface/AppPreview"
  import ComponentPropertiesPanel from "components/userInterface/PropertiesPanel/ComponentPropertiesPanel.svelte"
  import ComponentSelectionList from "components/userInterface/AppPreview/ComponentSelectionList.svelte"
  import FrontendNavigatePane from "components/userInterface/NavigationPanel/FrontendNavigatePane.svelte"

  $: instance = $store.appInstance

  async function selectDatabase(database) {
    backendUiStore.actions.database.select(database)
  }

  onMount(async () => {
    if ($store.appInstance && !$backendUiStore.database) {
      await selectDatabase($store.appInstance)
    }
  })

  let confirmDeleteDialog
  let componentToDelete = ""

  let settingsView
  const settings = () => {
    settingsView.show()
  }
</script>

<!-- routify:options index=1 -->
<div class="root">
  <div class="ui-nav">
    <FrontendNavigatePane />
  </div>

  <div class="preview-pane">
    {#if $currentAsset}
      <ComponentSelectionList />
      <div class="preview-content">
        <CurrentItemPreview />
      </div>
    {/if}
  </div>

  {#if $selectedComponent != null}
    <div class="components-pane">
      <ComponentPropertiesPanel />
    </div>
  {/if}
</div>

<slot />

<style>
  .root {
    display: grid;
    grid-template-columns: 260px 1fr 260px;
    background: var(--grey-2);
    align-items: stretch;
    height: calc(100vh - 60px);
  }

  .ui-nav {
    grid-column: 1;
    background-color: var(--background);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding: var(--spacing-l) var(--spacing-xl) 60px var(--spacing-xl);
    overflow-y: auto;
  }

  .preview-pane {
    grid-column: 2;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    padding: var(--spacing-l) 40px var(--spacing-xl) 40px;
  }
  .preview-content {
    background: var(--background);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
    flex: 1 1 auto;
  }

  .components-pane {
    grid-column: 3;
    background-color: var(--background);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    padding: var(--spacing-l) var(--spacing-xl);
  }

  .nav-group-header > div:nth-child(1) {
    padding: 0rem 0.5rem 0rem 0rem;
    vertical-align: bottom;
    grid-column-start: icon;
    margin-right: 5px;
  }

  .nav-group-header > div:nth-child(3) {
    vertical-align: bottom;
    grid-column-start: button;
    cursor: pointer;
    color: var(--blue);
  }

  .nav-group-header > div:nth-child(3):hover {
    color: var(--blue);
  }
</style>
