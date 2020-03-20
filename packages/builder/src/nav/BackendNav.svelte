<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "../builderStore"
  import HierarchyRow from "./HierarchyRow.svelte"
  import DatabasesList from "./DatabasesList.svelte"
  import UsersList from "./UsersList.svelte"
  import { hierarchy as hierarchyFunctions } from "../../../core/src"
  import NavItem from "./NavItem.svelte"
  import getIcon from "../common/icon"

  const newDatabase = () => {
    store.update(state => {})
  }

  const databaseManagementActions = [
    {
      label: "New Database",
      onclick: newDatabase,
    },
  ]
</script>

<div class="items-root">
  <div class="hierarchy">
    <div class="components-list-container">
      <div class="nav-group-header">
        <div class="hierarchy-title">Databases</div>
        <i class="ri-add-line hoverable" on:click={() => backendUiStore.actions.modals.show("DATABASE")} />
      </div>
    </div>

    <div class="hierarchy-items-container">
      <DatabasesList />
    </div>
  </div>
  <hr />
  <div class="hierarchy">
    <div class="components-list-container">
      <div class="nav-group-header">
        <div class="hierarchy-title">Users</div>
        <i class="ri-add-line" />
      </div>
    </div>

    <div class="hierarchy-items-container">
      <UsersList />
    </div>

    <NavItem name="ACCESS_LEVELS" label="User Levels" />
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
