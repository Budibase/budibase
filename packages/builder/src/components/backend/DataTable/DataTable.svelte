<script>
  import { tables } from "stores/backend"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import { TableNames } from "constants"
  import { Sheet } from "@budibase/frontend-core"
  import { API } from "api"

  import SheetAddColumnModal from "components/backend/DataTable/modals/sheet/SheetCreateColumnModal.svelte"
  import SheetCreateEditRowModal from "components/backend/DataTable/modals/sheet/SheetCreateEditRowModal.svelte"
  import SheetEditUserModal from "components/backend/DataTable/modals/sheet/SheetEditUserModal.svelte"
  import SheetCreateViewButton from "components/backend/DataTable/buttons/sheet/SheetCreateViewButton.svelte"
  import SheetImportButton from "components/backend/DataTable/buttons/sheet/SheetImportButton.svelte"
  import SheetExportButton from "components/backend/DataTable/buttons/sheet/SheetExportButton.svelte"
  import SheetFilterButton from "components/backend/DataTable/buttons/sheet/SheetFilterButton.svelte"
  import SheetManageAccessButton from "components/backend/DataTable/buttons/sheet/SheetManageAccessButton.svelte"
  import SheetRelationshipButton from "components/backend/DataTable/buttons/sheet/SheetRelationshipButton.svelte"
  import SheetEditColumnModal from "components/backend/DataTable/modals/sheet/SheetEditColumnModal.svelte"

  $: id = $tables.selected?._id
  $: isUsersTable = id === TableNames.USERS
  $: isInternal = $tables.selected?.type !== "external"
</script>

<div class="wrapper">
  <Sheet
    {API}
    tableId={id}
    allowAddRows={!isUsersTable}
    allowDeleteRows={!isUsersTable}
    on:updatetable={e => tables.updateTable(e.detail)}
  >
    <svelte:fragment slot="controls">
      {#if isInternal}
        <SheetCreateViewButton />
      {/if}
      <SheetManageAccessButton />
      {#if isUsersTable}
        <EditRolesButton />
      {/if}
      {#if !isInternal}
        <SheetRelationshipButton />
      {/if}
      <SheetImportButton disabled={isUsersTable} />
      <SheetExportButton />
      <SheetFilterButton />
      <SheetAddColumnModal />
      <SheetEditColumnModal />
      {#if isUsersTable}
        <SheetEditUserModal />
      {:else}
        <SheetCreateEditRowModal />
      {/if}
    </svelte:fragment>
  </Sheet>
</div>

<style>
  .wrapper {
    flex: 1 1 auto;
    margin: -28px -40px -40px -40px;
    display: flex;
    flex-direction: column;
    background: var(--background);
    overflow: hidden;
  }
</style>
