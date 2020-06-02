<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import HierarchyRow from "./HierarchyRow.svelte"
  import DatabasesList from "./DatabasesList.svelte"
  import UsersList from "./UsersList.svelte"
  import NavItem from "./NavItem.svelte"
  import getIcon from "components/common/icon"
  import {
    CreateDatabaseModal,
    CreateUserModal,
  } from "components/database/ModelDataTable/modals"
  const { open, close } = getContext("simple-modal")

  const openDatabaseCreator = () => {
    open(
      CreateDatabaseModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }
  const openUserCreator = () => {
    open(
      CreateUserModal,
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
        <div class="hierarchy-title">Databases</div>
        <i class="ri-add-line hoverable" on:click={openDatabaseCreator} />
      </div>
    </div>

    <div class="hierarchy-items-container">
      <DatabasesList />
    </div>
  </div>
  {#if $backendUiStore.selectedDatabase._id}
    <div class="hierarchy">
      <div class="components-list-container">
        <div class="nav-group-header">
          <div class="hierarchy-title">Users</div>
          <i class="ri-add-line hoverable" on:click={openUserCreator} />
        </div>
      </div>

      <div class="hierarchy-items-container">
        <UsersList />
      </div>

    </div>
  {/if}
</div>

<style>
  .items-root {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
    background: var(--white);
  }

  .nav-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 10px 20px;
  }

  .hierarchy-title {
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    text-rendering: optimizeLegibility;
    color: var(--ink);
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
