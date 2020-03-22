<script>
  import { store, backendUiStore } from "../builderStore"
  import HierarchyRow from "./HierarchyRow.svelte"
  import DropdownButton from "../common/DropdownButton.svelte"
  import { hierarchy as hierarchyFunctions } from "../../../core/src"
  import NavItem from "./NavItem.svelte"
  import getIcon from "../common/icon"

  function newModel() {
    if ($store.currentNode) {
      store.newChildRecord()
    } else {
      store.newRootRecord()
    }
    backendUiStore.actions.modals.show("MODEL")
  }

  function newView() {
    store.newRootIndex()
    backendUiStore.actions.modals.show("VIEW")
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
              <li
                class="hoverable"
                on:click={newModel}>
                Model
              </li>
              <li
                class="hoverable"
                on:click={newView}>
                View
              </li>
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
    background-color: var(--secondary5);
  }

  .nav-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 1rem 1rem 1rem;
  }

  .hierarchy-title {
    align-items: center;
    text-transform: uppercase;
    font-size: 0.85em;
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
