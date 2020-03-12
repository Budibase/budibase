<script>
  import { store } from "../builderStore"
  import HierarchyRow from "./HierarchyRow.svelte"
  import DropdownButton from "../common/DropdownButton.svelte"
  import { hierarchy as hierarchyFunctions } from "../../../core/src"
  import NavItem from "./NavItem.svelte"
  import getIcon from "../common/icon"

  const newRootRecord = () => {
    store.newRootRecord()
  }

  const newRootIndex = () => {
    store.newRootIndex()
  }

  const newChildRecord = () => {
    store.newChildRecord()
  }

  const newChildIndex = () => {
    store.newChildIndex()
  }

  const defaultNewChildActions = [
    {
      label: "New Root Record",
      onclick: newRootRecord,
    },
    {
      label: "New Root Index",
      onclick: newRootIndex,
    },
  ]

  let newChildActions = defaultNewChildActions

  const setActiveNav = name => () => {
    store.setActiveNav(name)
  }

  store.subscribe(db => {
    if (!db.currentNode || hierarchyFunctions.isIndex(db.currentNode)) {
      newChildActions = defaultNewChildActions
    } else {
      newChildActions = [
        {
          label: "New Root Record",
          onclick: newRootRecord,
        },
        {
          label: "New Root Index",
          onclick: newRootIndex,
        },
        {
          label: `New Child Record of ${db.currentNode.name}`,
          onclick: newChildRecord,
        },
        {
          label: `New Index on ${db.currentNode.name}`,
          onclick: newChildIndex,
        },
      ]
    }
  })
</script>

<div class="items-root">
  <div class="hierarchy">
    <div class="components-list-container">
      <div class="nav-group-header">
        <div class="hierarchy-title">Schema</div>
        <div class="uk-inline">
          <i class="ri-add-line" />
          <div uk-dropdown="mode: click">
            <ul class="uk-nav uk-dropdown-nav">
              <li>
                Model
              </li>
              <li>
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
