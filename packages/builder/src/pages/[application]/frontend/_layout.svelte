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

  let leftNavSwitcher

  const lastPartOfName = c => (c ? last(c.split("/")) : "")
</script>

<!-- routify:options index=1 -->
<div class="root">

  <div class="ui-nav">

    <Switcher bind:this={leftNavSwitcher} tabs={['Navigate', 'Add']}>
      <div slot="0">
        <FrontendNavigatePane />
      </div>
      <div slot="1">
        <ComponentSelectionList toggleTab={leftNavSwitcher.selectTab} />
      </div>
    </Switcher>

  </div>

  <div class="preview-pane">
    {#if $store.currentPageName && $store.currentPageName.length > 0}
      <CurrentItemPreview />
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
    grid-template-columns: 300px 1fr 300px;
    width: 100%;
    background: var(--grey-1);
    flex: 1;
    min-height: 0;
    align-items: stretch;
  }

  .ui-nav {
    grid-column: 1;
    background-color: var(--white);
    height: calc(100vh - 69px);
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .preview-pane {
    grid-column: 2;
    margin: 40px;
    background: #fff;
    border-radius: 5px;
  }

  .components-pane {
    grid-column: 3;
    background-color: var(--white);
    min-height: 0px;
    height: calc(100vh - 69px);
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
