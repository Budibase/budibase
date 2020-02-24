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
        <div>
          {@html getIcon('database', '18')}
        </div>
        <div class="hierarchy-title">Database</div>
        <DropdownButton iconName="plus" actions={newChildActions} />
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

  <NavItem name="actions" label="Actions & Triggers" />
  <NavItem name="access levels" label="User Levels" />

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
    display: grid;
    grid-template-columns: [icon] auto [title] 1fr [button] auto;
    padding: 2rem 1rem 1rem 1rem;
    font-size: 0.9rem;
  }

  .nav-group-header > div:nth-child(1) {
    padding: 0rem 0.7rem 0rem 0rem;
    vertical-align: bottom;
    grid-column-start: icon;
    margin-right: 5px;
  }

  .nav-group-header > div:nth-child(2) {
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

  .hierarchy-title {
    flex: auto 1 1;
    text-transform: uppercase;
  }

  .hierarchy {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    height: 100px;
  }

  .hierarchy-items-container {
    flex: 1 1 auto;
    overflow-y: auto;
  }
</style>
