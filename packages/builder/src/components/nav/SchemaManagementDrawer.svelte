<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import HierarchyRow from "./HierarchyRow.svelte"
  import DropdownButton from "components/common/DropdownButton.svelte"
  import NavItem from "./NavItem.svelte"
  import getIcon from "components/common/icon"
  import {
    CreateEditModelModal,
    CreateEditViewModal,
  } from "components/database/ModelDataTable/modals"

  const { open, close } = getContext("simple-modal")

  function newModel() {
    if ($store.currentNode) {
      store.newChildRecord()
    } else {
      store.newRootRecord()
    }
    open(
      CreateEditModelModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  function newView() {
    store.newRootIndex()
    open(
      CreateEditViewModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }
</script>

<div class="items-root">
  <div class="hierarchy">
    <div class="components-list-container">
      <div class="nav-group-header">
        <div class="hierarchy-title">Schema</div>
        <div class="uk-inline">
          <i class="ri-add-line hoverable" />
          <div uk-dropdown="mode: click;">
            <ul class="uk-nav uk-dropdown-nav">
              <li class="hoverable" on:click={newModel}>Model</li>
              <li class="hoverable" on:click={newView}>View</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="hierarchy-items-container">
      {#each $store.hierarchy.children as record}
        <HierarchyRow node={record} type="record" />
      {/each}

      {#each $store.hierarchy.indexes as index}
        <HierarchyRow node={index} type="index" />
      {/each}
    </div>
  </div>
</div>

<style>
  .items-root {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
    background-color: var(--white);
  }

  .nav-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 10px 20px;
  }

  .hierarchy-title {
    align-items: center;
    text-transform: uppercase;
    font-size: 13px;
    font-weight: bold;
    opacity: 0.6;
    letter-spacing: 1px;
    text-rendering: optimizeLegibility;
  }

  .hierarchy {
    display: flex;
    flex-direction: column;
  }

  .hierarchy-items-container {
    flex: 1 1 auto;
    overflow-y: auto;
  }
</style>
