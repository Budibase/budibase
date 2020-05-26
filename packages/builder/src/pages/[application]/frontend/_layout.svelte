<script>
  import { store, backendUiStore } from "builderStore"
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"
  import ComponentsHierarchy from "components/userInterface/ComponentsHierarchy.svelte"
  import ComponentsHierarchyChildren from "components/userInterface/ComponentsHierarchyChildren.svelte"
  import PageLayout from "components/userInterface/PageLayout.svelte"
  import PagesList from "components/userInterface/PagesList.svelte"
  import IconButton from "components/common/IconButton.svelte"
  import NewScreen from "components/userInterface/NewScreen.svelte"
  import CurrentItemPreview from "components/userInterface/AppPreview"
  import PageView from "components/userInterface/PageView.svelte"
  import ComponentsPaneSwitcher from "components/userInterface/ComponentsPaneSwitcher.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { last } from "lodash/fp"
  import { AddIcon } from "components/common/Icons"

  $: instances = $store.appInstances

  async function selectDatabase(database) {
    backendUiStore.actions.database.select(database)
  }

  onMount(async () => {
    if ($store.appInstances.length > 0 && !$backendUiStore.database) {
      await selectDatabase($store.appInstances[0])
    }
  })

  let newScreenPicker
  let confirmDeleteDialog
  let componentToDelete = ""

  const newScreen = () => {
    newScreenPicker.show()
  }

  let settingsView
  const settings = () => {
    settingsView.show()
  }

  const confirmDeleteComponent = component => {
    componentToDelete = component
    confirmDeleteDialog.show()
  }

  const lastPartOfName = c => (c ? last(c.split("/")) : "")
</script>

<div class="root">

  <div class="ui-nav">

    <div class="pages-list-container">
      <div class="nav-header">
        <span class="navigator-title">Navigate</span>
        <span class="components-nav-page">Pages</span>
      </div>

      <div class="nav-items-container">
        <PagesList />
      </div>
    </div>

    <div class="border-line" />

    <PageLayout layout={$store.pages[$store.currentPageName]} />

    <div class="border-line" />

    <div class="components-list-container">
      <div class="nav-group-header">
        <span class="components-nav-header" style="margin-top: 0;">
          Screens
        </span>
        <div>
          <button on:click={newScreen}>
            <AddIcon />
          </button>
        </div>
      </div>
      <div class="nav-items-container">
        <ComponentsHierarchy screens={$store.screens} />
      </div>
    </div>

  </div>

  <div class="preview-pane">
    <CurrentItemPreview />
  </div>

  {#if $store.currentFrontEndType === 'screen' || $store.currentFrontEndType === 'page'}
    <div class="components-pane">
      <ComponentsPaneSwitcher />
    </div>
  {/if}

</div>

<NewScreen bind:this={newScreenPicker} />

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete this '${lastPartOfName(componentToDelete)}' component`}
  okText="Delete Component"
  onOk={() => store.deleteComponent(componentToDelete)} />

<slot />

<style>
  button {
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 5px;
    width: 20px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .root {
    display: grid;
    grid-template-columns: 275px 1fr 275px;
    width: 100%;
    background: var(--grey-light);
  }

  @media only screen and (min-width: 1800px) {
    .root {
      display: grid;
      grid-template-columns: 300px 1fr 300px;
      width: 100%;
      background: var(--grey-light);
    }
  }

  .ui-nav {
    grid-column: 1;
    background-color: var(--white);
    height: calc(100vh - 49px);
    padding: 0;
    overflow: scroll;
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
  }

  .nav-group-header > div:nth-child(1) {
    padding: 0rem 0.5rem 0rem 0rem;
    vertical-align: bottom;
    grid-column-start: icon;
    margin-right: 5px;
  }

  .nav-group-header > span:nth-child(3) {
    margin-left: 5px;
    vertical-align: bottom;
    grid-column-start: title;
    margin-top: auto;
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

  .navigator-title {
    font-size: 18px;
    color: var(--ink);
    font-weight: bold;
    padding: 0 20px 20px 20px;
  }

  .border-line {
    border-bottom: 1px solid #d8d8d8;
  }

  .components-list-container {
    padding: 20px 0px 0 0;
  }
</style>
