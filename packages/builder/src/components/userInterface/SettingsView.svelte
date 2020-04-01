<script>
  import { store } from "builderStore"
  import Textbox from "components/common/Textbox.svelte"
  import Button from "components/common/Button.svelte"
  import IconButton from "components/common/IconButton.svelte"
  import { libraryDependencies } from "./pagesParsing/findDependencies"
  import UIkit from "uikit"
  import { libsFromPages } from "builderStore/loadComponentLibraries"
  let addNewLib = ""
  let addNewStylesheet = ""
  let modalElement

  $: components = $store.components

  const removeLibrary = lib => {
    const dependencies = libraryDependencies(components, lib)
    if (dependencies.length > 0) return
    store.removeComponentLibrary(lib)
  }

  const addLib = () => {
    store.addComponentLibrary(addNewLib).then(() => {
      addNewLib = ""
    })
  }

  const removeStylesheet = stylesheet => {
    store.removeStylesheet(stylesheet)
  }

  const addStylesheet = () => {
    if (addNewStylesheet) store.addStylesheet(addNewStylesheet)
  }

  export const close = () => {
    UIkit.modal(modalElement).hide()
  }

  export const show = () => {
    UIkit.modal(modalElement).show()
  }
</script>

<div bind:this={modalElement} id="new-component-modal" uk-modal>
  <div class="uk-modal-dialog">

    <div class="uk-modal-header header">
      <div>Settings</div>
      <div>
        <IconButton icon="x" on:click={close} />
      </div>
    </div>

    <div class="uk-modal-body uk-form-horizontal">

      <div class="section-container">
        <p>
          Component Libraries
          <span>
            <input bind:value={addNewLib} />
            <Button color="primary-outline" on:click={addLib}>Add</Button>
          </span>
        </p>
        {#each $store.pages[$store.currentPageName].componentLibraries as lib}
          <div>
            <span class="row-text">{lib}</span>
            <IconButton icon="x" on:click={() => removeLibrary(lib)} />
          </div>
        {/each}
      </div>

      <div class="section-container">
        <p>
          Stylesheets
          <span>
            <input bind:value={addNewStylesheet} />
            <Button color="primary-outline" on:click={addStylesheet}>
              Add
            </Button>
          </span>
        </p>
        {#each $store.pages[$store.currentPageName].stylesheets as stylesheet}
          <div>
            <span class="row-text">{stylesheet}</span>
            <IconButton
              icon="x"
              on:click={() => removeStylesheet(stylesheet)} />
          </div>
        {/each}
      </div>

    </div>
  </div>
</div>

<style>
  .section-container {
    padding: 15px;
    border-style: dotted;
    border-width: 1px;
    border-color: var(--lightslate);
    border-radius: 2px;
  }

  .section-container:nth-child(1) {
    margin-bottom: 15px;
  }

  .row-text {
    margin-right: 15px;
    color: var(--primary100);
  }

  input {
    margin-right: 15px;
  }

  p > span {
    margin-left: 30px;
  }

  .header {
    display: grid;
    grid-template-columns: [title] 1fr [icon] auto;
  }

  .header > div:nth-child(1) {
    grid-column-start: title;
  }

  .header > div:nth-child(2) {
    grid-column-start: icon;
  }
</style>
