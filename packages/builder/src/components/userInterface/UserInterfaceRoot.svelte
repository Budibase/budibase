<script>
  import ComponentsHierarchy from "./ComponentsHierarchy.svelte"
  import ComponentsHierarchyChildren from "./ComponentsHierarchyChildren.svelte"
  import MasterLayout from "./MasterLayout.svelte"
  import PagesList from "./PagesList.svelte"
  import { store } from "builderStore"
  import IconButton from "components/common/IconButton.svelte"
  import Modal from "components/common/Modal.svelte"
  import NewScreen from "./NewScreen.svelte"
  import CurrentItemPreview from "./CurrentItemPreview.svelte"
  import SettingsView from "./SettingsView.svelte"
  import PageView from "./PageView.svelte"
  import ComponentsPaneSwitcher from "./ComponentsPaneSwitcher.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { last } from "lodash/fp"
  import { AddIcon } from "components/common/Icons"

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
        <span class="navigator-title">Navigator</span>
        <div class="border-line" />

        <span class="components-nav-page">Pages</span>
      </div>

      <div class="nav-items-container">
        <PagesList />
      </div>
    </div>

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
        <MasterLayout layout={$store.pages[$store.currentPageName]} />
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
<SettingsView bind:this={settingsView} />

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete this '${lastPartOfName(componentToDelete)}' component`}
  okText="Delete Component"
  onOk={() => store.deleteComponent(componentToDelete)} />

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
    height: 100%;
    width: 100%;
    background: #fafafa;
  }

  @media only screen and (min-width: 1800px) {
    .root {
      display: grid;
      grid-template-columns: 300px 1fr 300px;
      height: 100%;
      width: 100%;
      background: #fafafa;
    }
  }

  .ui-nav {
    grid-column: 1;
    background-color: var(--white);
    height: calc(100vh - 49px);
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .preview-pane {
    grid-column: 2;
    margin: 40px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.05);
  }

  .components-pane {
    grid-column: 3;
    background-color: var(--white);
    min-height: 0px;
    overflow-y: hidden;
  }

  .components-nav-page {
    font-size: 12px;
    color: #000333;
    text-transform: uppercase;
    padding-left: 20px;
    margin-top: 20px;
    font-weight: 600;
    opacity: 0.4;
    letter-spacing: 1px;
  }

  .components-nav-header {
    font-size: 12px;
    color: #000333;
    text-transform: uppercase;
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
    font-size: 14px;
    color: var(--secondary100);
    font-weight: 600;
    text-transform: uppercase;
    padding: 0 20px 20px 20px;
    line-height: 1rem !important;
    letter-spacing: 1px;
  }

  .border-line {
    border-bottom: 1px solid #d8d8d8;
  }

  .components-list-container {
    overflow: auto;
    padding: 20px 0px 0 0;
  }
</style>
