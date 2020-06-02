<script>
  import { store, backendUiStore } from "builderStore"
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"
  import ComponentsHierarchyChildren from "components/userInterface/ComponentsHierarchyChildren.svelte"
  import IconButton from "components/common/IconButton.svelte"
  import CurrentItemPreview from "components/userInterface/AppPreview"
  import PageView from "components/userInterface/PageView.svelte"
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
    background: var(--grey-light);
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
    z-index: 5;
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
    overflow-y: hidden;
  }

  .components-nav-page {
    font-size: 13px;
    color: var(--ink);
    padding-left: 20px;
    margin-top: 20px;
    font-weight: 600;
    opacity: 0.4;
    letter-spacing: 1px;
  }

  .components-nav-header {
    font-size: 13px;
    color: var(--ink);
    margin-top: 20px;
    font-weight: 600;
    opacity: 0.4;
    letter-spacing: 1px;
  }

  .nav-header {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }

  .nav-items-container {
    padding: 1rem 0rem 0rem 0rem;
  }

  .nav-group-header {
    display: flex;
    padding: 0px 20px 0px 20px;
    font-size: 0.9rem;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
    min-height: 0;
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
    color: var(--primary75);
  }

  .nav-group-header > div:nth-child(3):hover {
    color: var(--primary75);
  }
</style>
