<script>
  import { datasources, tables, integrations, appStore } from "stores/builder"
  import { themeStore, admin } from "stores/portal"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import { TableNames } from "constants"
  import { Grid } from "@budibase/frontend-core"
  import { API } from "api"
  import GridCreateAutomationButton from "./buttons/grid/GridCreateAutomationButton.svelte"
  import GridAddColumnModal from "components/backend/DataTable/modals/grid/GridCreateColumnModal.svelte"
  import GridCreateEditRowModal from "components/backend/DataTable/modals/grid/GridCreateEditRowModal.svelte"
  import GridEditUserModal from "components/backend/DataTable/modals/grid/GridEditUserModal.svelte"
  import GridCreateViewButton from "components/backend/DataTable/buttons/grid/GridCreateViewButton.svelte"
  import GridImportButton from "components/backend/DataTable/buttons/grid/GridImportButton.svelte"
  import GridExportButton from "components/backend/DataTable/buttons/grid/GridExportButton.svelte"
  import GridFilterButton from "components/backend/DataTable/buttons/grid/GridFilterButton.svelte"
  import GridManageAccessButton from "components/backend/DataTable/buttons/grid/GridManageAccessButton.svelte"
  import GridRelationshipButton from "components/backend/DataTable/buttons/grid/GridRelationshipButton.svelte"
  import GridEditColumnModal from "components/backend/DataTable/modals/grid/GridEditColumnModal.svelte"
  import GridUsersTableButton from "components/backend/DataTable/modals/grid/GridUsersTableButton.svelte"
  import { DB_TYPE_EXTERNAL } from "constants/backend"

  const userSchemaOverrides = {
    firstName: { displayName: "First name", disabled: true },
    lastName: { displayName: "Last name", disabled: true },
    email: { displayName: "Email", disabled: true },
    roleId: { displayName: "Role", disabled: true },
    status: { displayName: "Status", disabled: true },
  }

  $: id = $tables.selected?._id
  $: isUsersTable = id === TableNames.USERS
  $: isInternal = $tables.selected?.sourceType !== DB_TYPE_EXTERNAL
  $: gridDatasource = {
    type: "table",
    tableId: id,
  }
  $: tableDatasource = $datasources.list.find(datasource => {
    return datasource._id === $tables.selected?.sourceId
  })
  $: relationshipsEnabled = relationshipSupport(tableDatasource)

  $: currentTheme = $themeStore?.theme
  $: darkMode = !currentTheme.includes("light")

  const relationshipSupport = datasource => {
    const integration = $integrations[datasource?.source]
    return !isInternal && integration?.relationships !== false
  }

  const handleGridTableUpdate = async e => {
    tables.replaceTable(id, e.detail)

    // We need to refresh datasources when an external table changes.
    if (e.detail?.sourceType === DB_TYPE_EXTERNAL) {
      await datasources.fetch()
    }
  }
</script>

<div class="wrapper">
  <Grid
    {API}
    {darkMode}
    datasource={gridDatasource}
    canAddRows={!isUsersTable}
    canDeleteRows={!isUsersTable}
    canEditRows={!isUsersTable || !$appStore.features.disableUserMetadata}
    canEditColumns={!isUsersTable || !$appStore.features.disableUserMetadata}
    schemaOverrides={isUsersTable ? userSchemaOverrides : null}
    showAvatars={false}
    on:updatedatasource={handleGridTableUpdate}
    isCloud={$admin.cloud}
  >
    <svelte:fragment slot="filter">
      {#if isUsersTable && $appStore.features.disableUserMetadata}
        <GridUsersTableButton />
      {/if}
      <GridFilterButton />
    </svelte:fragment>
    <svelte:fragment slot="controls">
      {#if !isUsersTable}
        <GridCreateViewButton />
      {/if}
      <GridManageAccessButton />
      {#if !isUsersTable}
        <GridCreateAutomationButton />
      {/if}
      {#if relationshipsEnabled}
        <GridRelationshipButton />
      {/if}
      {#if isUsersTable}
        <EditRolesButton />
      {:else}
        <GridImportButton />
      {/if}
      <GridExportButton />
      {#if isUsersTable}
        <GridEditUserModal />
      {:else}
        <GridCreateEditRowModal />
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="edit-column">
      <GridEditColumnModal />
    </svelte:fragment>
    <svelte:fragment slot="add-column">
      <GridAddColumnModal />
    </svelte:fragment>
  </Grid>
</div>

<style>
  .wrapper {
    flex: 1 1 auto;
    margin: -28px -40px -40px -40px;
    display: flex;
    flex-direction: column;
    background: var(--background);
  }
</style>
