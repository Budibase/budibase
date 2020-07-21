<script>
  import { MoreIcon } from "components/common/Icons"
  import { store } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UIkit from "uikit"
  import api from "builderStore/api"

  export let screen

  let confirmDeleteDialog
  let dropdownEl

  $: dropdown = UIkit.dropdown(dropdownEl, {
    mode: "click",
    offset: 0,
    pos: "bottom-right",
    "delay-hide": 0,
    animation: false,
  })
  $: dropdown && UIkit.util.on(dropdown, "shown", () => (hidden = false))

  const hideDropdown = () => {
    dropdown.hide()
  }

  const deleteScreen = () => {
    store.update(s => {
      const screens = s.screens.filter(c => c.name !== screen.name)
      s.screens = screens
      if (s.currentPreviewItem.name === screen.name) {
        s.currentPreviewItem = s.pages[s.currentPageName]
        s.currentFrontEndType = "page"
      }

      api.delete(
        `/_builder/api/pages/${s.currentPageName}/screens/${screen.name}`
      )

      return s
    })
  }
</script>

<div class="root boundary" on:click|stopPropagation={() => {}}>
  <button>
    <MoreIcon />
  </button>
  <ul class="menu" bind:this={dropdownEl} on:click={hideDropdown}>
    <li class="item" on:click={() => confirmDeleteDialog.show()}>
      <i class="icon ri-delete-bin-2-line" />
      Delete
    </li>
  </ul>
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
    padding: 5px;
    background: transparent;
    cursor: pointer;
    color: var(--ink);
    outline: none;
  }

  .menu {
    z-index: 100000;
    overflow: visible;
    padding: 12px 0px;
    border-radius: 5px;
  }

  .menu li {
    border-style: none;
    background-color: transparent;
    list-style-type: none;
    padding: 4px 16px;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .item {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .icon {
    margin-right: 8px;
  }

  .menu li:not(.disabled) {
    cursor: pointer;
    color: var(--grey-7);
  }

  .menu li:not(.disabled):hover {
    color: var(--ink);
    background-color: var(--grey-1);
  }
</style>
