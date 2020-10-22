<script>
  import { store, backendUiStore } from "builderStore"
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"
  import ComponentsHierarchyChildren from "components/userInterface/ComponentsHierarchyChildren.svelte"
  import CurrentItemPreview from "components/userInterface/AppPreview"
  import ComponentPropertiesPanel from "components/userInterface/ComponentPropertiesPanel.svelte"
  import ComponentSelectionList from "components/userInterface/ComponentSelectionList.svelte"
  import Switcher from "components/common/Switcher.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { last } from "lodash/fp"
  import { AddIcon } from "components/common/Icons"
  import FrontendNavigatePane from "components/userInterface/FrontendNavigatePane.svelte"

  $: instances = $store.appInstances

  async function selectDatabase(database) {
    backendUiStore.actions.database.select(database)
  }

  onMount(async () => {
    if ($store.appInstances.length > 0 && !$backendUiStore.database) {
      await selectDatabase($store.appInstances[0])
    }
  })

  let confirmDeleteDialog
  let componentToDelete = ""

  let settingsView
  const settings = () => {
    settingsView.show()
  }

  const lastPartOfName = (c) => (c ? last(c.split("/")) : "")
</script>

<!-- routify:options index=1 -->
<div class="root">
  <div class="ui-nav">
    <FrontendNavigatePane />
  </div>

  <div class="preview-pane">
    {#if $store.currentPageName && $store.currentPageName.length > 0}
      <ComponentSelectionList />
      <div class="preview-content">
        <CurrentItemPreview />
      </div>
    {/if}
  </div>

  {#if $store.currentFrontEndType === 'screen' || $store.currentFrontEndType === 'page'}
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
    background-color: var(--white);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-xl);
    overflow-y: auto;
    border-right: 1px solid var(--grey-2);
  }

  .preview-pane {
    grid-column: 2;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }
  .preview-content {
    background: #fff;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
    flex: 1 1 auto;
    margin: var(--spacing-xl) 40px;
  }

  .components-pane {
    grid-column: 3;
    background-color: var(--white);
    border-left: 1px solid var(--grey-2);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    padding: var(--spacing-xl);
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
