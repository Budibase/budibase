<script>
  import { Banner, notifications } from "@budibase/bbui"
  import {
    datasources,
    tables,
    integrations,
    appStore,
    rowActions,
    roles,
  } from "@/stores/builder"
  import { themeStore, admin, licensing } from "@/stores/portal"
  import { TableNames } from "@/constants"
  import { Grid } from "@budibase/frontend-core"
  import { API } from "@/api"
  import GridAddColumnModal from "@/components/backend/DataTable/modals/grid/GridCreateColumnModal.svelte"
  import GridCreateEditRowModal from "@/components/backend/DataTable/modals/grid/GridCreateEditRowModal.svelte"
  import GridEditUserModal from "@/components/backend/DataTable/modals/grid/GridEditUserModal.svelte"
  import GridImportButton from "@/components/backend/DataTable/buttons/grid/GridImportButton.svelte"
  import GridExportButton from "@/components/backend/DataTable/buttons/grid/GridExportButton.svelte"
  import GridManageAccessButton from "@/components/backend/DataTable/buttons/grid/GridManageAccessButton.svelte"
  import GridRelationshipButton from "@/components/backend/DataTable/buttons/grid/GridRelationshipButton.svelte"
  import GridEditColumnModal from "@/components/backend/DataTable/modals/grid/GridEditColumnModal.svelte"
  import GridUsersTableButton from "@/components/backend/DataTable/buttons/grid/GridUsersTableButton.svelte"
  import GridGenerateButton from "@/components/backend/DataTable/buttons/grid/GridGenerateButton.svelte"
  import GridScreensButton from "@/components/backend/DataTable/buttons/grid/GridScreensButton.svelte"
  import GridAutomationsButton from "@/components/backend/DataTable/buttons/grid/GridAutomationsButton.svelte"
  import GridRowActionsButton from "@/components/backend/DataTable/buttons/grid/GridRowActionsButton.svelte"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  let generateButton

  $: userSchemaOverrides = {
    firstName: { displayName: "First name", disabled: true },
    lastName: { displayName: "Last name", disabled: true },
    email: { displayName: "Email", disabled: true },
    status: { displayName: "Status", disabled: true },
    roleId: {
      displayName: "Role",
      type: "role",
      disabled: true,
      roles: $roles,
    },
  }
  $: autoColumnStatus = verifyAutocolumns($tables?.selected)
  $: duplicates = Object.values(autoColumnStatus).reduce((acc, status) => {
    if (status.length > 1) {
      acc = [...acc, ...status]
    }
    return acc
  }, [])
  $: invalidColumnText = duplicates.map(entry => {
    return `${entry.name} (${entry.subtype})`
  })
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
  $: buttons = makeRowActionButtons($rowActions[id])
  $: rowActions.refreshRowActions(id)

  const makeRowActionButtons = actions => {
    return (actions || [])
      .filter(action => action.allowedSources?.includes(id))
      .map(action => ({
        text: action.name,
        onClick: async row => {
          await rowActions.trigger(id, action.id, row._id)
          notifications.success("Row action triggered successfully")
        },
      }))
  }

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

  const verifyAutocolumns = table => {
    // Check for duplicates
    return Object.values(table?.schema || {}).reduce((acc, fieldSchema) => {
      if (!fieldSchema.autocolumn || !fieldSchema.subtype) {
        return acc
      }
      let fieldKey = fieldSchema.tableId
        ? `${fieldSchema.tableId}-${fieldSchema.subtype}`
        : fieldSchema.subtype
      acc[fieldKey] = acc[fieldKey] || []
      acc[fieldKey].push(fieldSchema)
      return acc
    }, {})
  }
</script>

{#if $tables?.selected?.name}
  {#if duplicates?.length}
    <div class="alert-wrap">
      <Banner type="warning" showCloseButton={false}>
        {`Schema Invalid - There are duplicate auto column types defined in this schema.
      Please delete the duplicate entries where appropriate: -
      ${invalidColumnText.join(", ")}`}
      </Banner>
    </div>
  {/if}
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
    isCloud={$admin.cloud}
    aiEnabled={$licensing.customAIConfigsEnabled ||
      $licensing.budibaseAIEnabled}
    {buttons}
    buttonsCollapsed
    on:updatedatasource={handleGridTableUpdate}
  >
    <!-- Controls -->
    <svelte:fragment slot="controls">
      {#if isUsersTable && $appStore.features.disableUserMetadata}
        <GridUsersTableButton />
      {/if}
      <GridManageAccessButton />
      {#if relationshipsEnabled}
        <GridRelationshipButton />
      {/if}
      {#if !isUsersTable}
        <GridImportButton />
        <GridExportButton />
        <GridRowActionsButton />
        <GridScreensButton on:generate={() => generateButton?.show()} />
        <GridAutomationsButton on:generate={() => generateButton?.show()} />
        <GridGenerateButton bind:this={generateButton} />
      {/if}
    </svelte:fragment>

    <!-- Content for editing columns -->
    <svelte:fragment slot="edit-column">
      <GridEditColumnModal />
    </svelte:fragment>
    <svelte:fragment slot="add-column">
      <GridAddColumnModal />
    </svelte:fragment>

    <!-- Listening to events for editing rows in modals -->
    {#if isUsersTable}
      <GridEditUserModal />
    {:else}
      <GridCreateEditRowModal />
    {/if}
  </Grid>
{:else}
  <i>Create your first table to start building</i>
{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
  .alert-wrap {
    display: flex;
    flex: 0 0 auto;
    margin: -28px -40px 14px -40px;
  }
  .alert-wrap :global(> *) {
    flex: 1;
  }
</style>
