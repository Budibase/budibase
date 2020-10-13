<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import api from "builderStore/api"
  import Portal from "svelte-portal"
  import { DropdownMenu } from "@budibase/bbui"

  export let screen

  let confirmDeleteDialog
  let dropdown
  let anchor

  const hideDropdown = () => {
    dropdown.hide()
  }

  const deleteScreen = () => {
    store.update(state => {
      // Remove screen from screens
      const screens = state.screens.filter(c => c.name !== screen.name)
      state.screens = screens

      // Remove screen from current page as well
      const pageScreens = state.pages[state.currentPageName]._screens.filter(
        scr => scr.name !== screen.name
      )
      state.pages[state.currentPageName]._screens = pageScreens

      if (state.currentPreviewItem.name === screen.name) {
        store.setCurrentPage($store.currentPageName)
        $goto(`./:page/page-layout`)
      }

      api.delete(
        `/_builder/api/pages/${state.currentPageName}/screens/${screen.name}`
      )

      return state
    })
  }
</script>

<div
  bind:this={anchor}
  class="root boundary"
  on:click|stopPropagation={() => {}}>
  <div class="icon" on:click={() => dropdown.show()}>
    <i class="ri-more-line" />
  </div>
  <DropdownMenu bind:this={dropdown} {anchor} align="left">
    <ul on:click={hideDropdown}>
      <li on:click={() => confirmDeleteDialog.show()}>
        <i class="ri-delete-bin-2-line" />
        Delete
      </li>
    </ul>
  </DropdownMenu>
</div>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete the screen '${screen.props._instanceName}' ?`}
  okText="Delete Screen"
  onOk={deleteScreen} />

<style>
  .root {
    overflow: hidden;
    z-index: 9;
  }

  .root button {
    border-style: none;
    border-radius: 2px;
    padding: 0;
    background: transparent;
    cursor: pointer;
    color: var(--ink);
    outline: none;
  }

  ul {
    z-index: 100000;
    overflow: visible;
    margin: var(--spacing-s) 0;
    border-radius: var(--border-radius-s);
    padding: 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0;
    align-items: center;
    cursor: pointer;
  }
  li:not(.disabled):hover {
    background-color: var(--grey-2);
  }
  li:active {
    color: var(--blue);
  }
  li i {
    margin-right: 8px;
    font-size: var(--font-size-s);
  }
  li.disabled {
    color: var(--grey-4);
    cursor: default;
  }

  .icon i {
    font-size: 16px;
  }
</style>
