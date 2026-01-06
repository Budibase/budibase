<script lang="ts">
  import { Banner, Button, notifications } from "@budibase/bbui"
  import {
    datasources,
    tables,
    integrations,
    appStore,
    rowActions,
    roles,
    dataEnvironmentStore,
    dataAPI,
    deploymentStore,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import { themeStore, admin, licensing } from "@/stores/portal"
  import { TableNames } from "@/constants"
  import { Grid, gridClipboard } from "@budibase/frontend-core"
  import type { Store as GridStore } from "@budibase/frontend-core/src/components/grid/stores"
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
  import GridDevProdSwitcher from "@/components/backend/DataTable/buttons/grid/GridDevProdSwitcher.svelte"
  import GridDevWarning from "@/components/backend/DataTable/alert/grid/GridDevWarning.svelte"
  import ProductionBlankState from "@/components/backend/DataTable/blankstates/ProductionBlankState.svelte"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"
  import { getContext } from "svelte"
  import { onDestroy } from "svelte"
  import { productionAPI } from "@/api"
  import { publishTableToProduction } from "@/utils/publishTableToProduction"
  import {
    DataEnvironmentMode,
    type Table,
    type Row,
    type Datasource,
    type UIDatasource,
    type UIInternalDatasource,
    FieldType,
    FormulaType,
  } from "@budibase/types"

  let generateButton: GridGenerateButton
  let grid: Grid
  let gridContext: GridStore | undefined
  let lastPublishCount = 0
  let missingProductionDefinition = false
  let previousTableId: string | undefined
  let tablePublishing = false
  let prodRefreshKey = 0
  let productionEmpty = false
  let productionHasRows = true
  let productionRowUnsubscribe: (() => void) | null = null

  const dataLayoutContext = getContext("data-layout") as {
    registerGridDispatch?: Function
  }

  // Register grid dispatch with data layout when grid is ready
  $: {
    if (grid) {
      gridContext = grid.getContext()
      if (dataLayoutContext?.registerGridDispatch) {
        dataLayoutContext.registerGridDispatch(gridContext.dispatch)
      }
    }
  }

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
  $: invalidColumnText = duplicates.map((entry: any) => {
    return `${entry.name} (${entry.subtype})`
  })
  $: id = $tables.selected?._id!
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
  $: canSwitchToProduction = isInternal
  $: isProductionMode =
    $dataEnvironmentStore.mode === DataEnvironmentMode.PRODUCTION
  $: isDeployed =
    isInternal && id ? $workspaceDeploymentStore.tables[id]?.published : false
  $: productionUnavailable =
    isInternal &&
    isProductionMode &&
    (!isDeployed || missingProductionDefinition)
  $: if (!isProductionMode) {
    missingProductionDefinition = false
  }
  $: if (id !== previousTableId) {
    missingProductionDefinition = false
    previousTableId = id
  }
  $: hasStaticFormulas = Object.values($tables.selected?.schema || {}).some(
    field =>
      field.type === FieldType.FORMULA &&
      field.formulaType === FormulaType.STATIC
  )
  $: externalClipboardData = {
    clipboard: gridClipboard,
    tableId: id,
    onCopy: (data: any) => {
      gridClipboard.copy(
        data.value,
        data.multiCellCopy,
        data.tableId,
        data.viewId
      )
    },
  }

  const syncProductionRowSubscription = (
    shouldSubscribe: boolean,
    context?: GridStore
  ) => {
    productionRowUnsubscribe?.()
    productionRowUnsubscribe = null
    if (!shouldSubscribe) {
      productionHasRows = false
      return
    }
    productionHasRows = true
    if (context?.rowCount?.subscribe) {
      const triggerCheck = () => {
        productionHasRows = true
        checkProductionRowPresence()
      }
      productionRowUnsubscribe = context.rowCount.subscribe(triggerCheck)
    } else {
      checkProductionRowPresence()
    }
  }

  $: syncProductionRowSubscription(
    isInternal &&
      isProductionMode &&
      isDeployed &&
      !missingProductionDefinition &&
      Boolean(id),
    gridContext
  )

  $: productionEmpty =
    isInternal &&
    isProductionMode &&
    isDeployed &&
    !productionHasRows &&
    !missingProductionDefinition

  const makeRowActionButtons = (actions: any[]) => {
    return (actions || [])
      .filter(action => action.allowedSources?.includes(id))
      .map(action => ({
        text: action.name,
        onClick: async (row: Row) => {
          await rowActions.trigger(id, action.id, row._id!)
          notifications.success("Row action triggered successfully")
        },
      }))
  }

  $: {
    const publishCount = $deploymentStore.publishCount
    if (publishCount > lastPublishCount) {
      lastPublishCount = publishCount
      if (
        $dataEnvironmentStore.mode === DataEnvironmentMode.PRODUCTION &&
        hasStaticFormulas &&
        gridContext?.rows?.actions?.refreshData
      ) {
        gridContext.rows.actions.refreshData().catch(() => {})
      }
    }
  }

  const relationshipSupport = (
    datasource?: Datasource | UIDatasource | UIInternalDatasource
  ) => {
    if (!datasource || !("source" in datasource)) {
      return false
    }
    const integration = $integrations[datasource?.source]
    return !isInternal && integration?.relationships !== false
  }

  const handleGridTableUpdate = async (e: any) => {
    tables.replaceTable(id, e.detail)

    // We need to refresh datasources when an external table changes.
    if (e.detail?.sourceType === DB_TYPE_EXTERNAL) {
      await datasources.fetch()
    }
  }

  const verifyAutocolumns = (table?: Table) => {
    // Check for duplicates
    return Object.values(table?.schema || {}).reduce(
      (acc, fieldSchema) => {
        if (!fieldSchema.autocolumn || !fieldSchema.subtype) {
          return acc
        }
        let fieldKey: string =
          "tableId" in fieldSchema
            ? `${fieldSchema.tableId}-${fieldSchema.subtype}`
            : (fieldSchema.subtype as string)
        acc[fieldKey] = acc[fieldKey] || []
        acc[fieldKey].push(fieldSchema)
        return acc
      },
      {} as Record<string, any>
    )
  }

  const handleDefinitionMissing = () => {
    if (isProductionMode) {
      missingProductionDefinition = true
    }
  }

  const publishProductionTable = async (seedProductionTables: boolean) => {
    if (tablePublishing) {
      return
    }
    tablePublishing = true
    const label = seedProductionTables
      ? "Error seeding and publishing table"
      : "Error publishing table"
    try {
      await publishTableToProduction(id, seedProductionTables)
      if (isProductionMode && gridContext?.rows?.actions?.refreshData) {
        await gridContext.rows.actions.refreshData()
      }
      prodRefreshKey += 1
      missingProductionDefinition = false
      notifications.success("Table published to production")
    } catch (error: any) {
      notifications.error(error?.message || label)
    }
    tablePublishing = false
  }

  const checkProductionRowPresence = async () => {
    const tableId = id
    if (!tableId) {
      return
    }
    try {
      const res = await productionAPI.searchTable(tableId, {
        query: {},
        limit: 1,
        paginate: true,
      })
      if (tableId === id) {
        productionHasRows = Boolean(res?.rows?.length)
      }
    } catch (error) {
      if (tableId === id) {
        productionHasRows = true
      }
    }
  }

  onDestroy(() => {
    productionRowUnsubscribe?.()
  })
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
  <!-- re-render the grid if the data environment changes -->
  {#key `${$dataEnvironmentStore.mode}-${prodRefreshKey}`}
    <div class="grid-blank-wrapper">
      <Grid
        bind:this={grid}
        API={$dataAPI}
        {darkMode}
        datasource={gridDatasource}
        canAddRows={!isUsersTable}
        canDeleteRows={!isUsersTable}
        canEditRows={!isUsersTable || !$appStore.features.disableUserMetadata}
        canEditColumns={!isProductionMode &&
          (!isUsersTable || !$appStore.features.disableUserMetadata)}
        canSaveSchema={!isProductionMode}
        schemaOverrides={isUsersTable ? userSchemaOverrides : null}
        showAvatars={false}
        isCloud={$admin.cloud}
        aiEnabled={$licensing.customAIConfigsEnabled ||
          $licensing.budibaseAIEnabled}
        {buttons}
        buttonsCollapsed
        canHideColumns={false}
        externalClipboard={externalClipboardData}
        on:updatedatasource={handleGridTableUpdate}
        on:definitionMissing={handleDefinitionMissing}
      >
        <!-- Controls -->
        <svelte:fragment slot="controls">
          {#if !isProductionMode}
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
              <GridAutomationsButton
                on:generate={() => generateButton?.show()}
              />
              <GridGenerateButton bind:this={generateButton} />
            {/if}
          {:else if !isUsersTable}
            <GridImportButton />
            <GridExportButton />
            {#if productionEmpty}
              <Button
                secondary
                disabled={tablePublishing}
                on:click={() => publishProductionTable(true)}
              >
                Seed from Dev
              </Button>
            {/if}
          {/if}
        </svelte:fragment>
        <svelte:fragment slot="controls-right">
          <GridDevProdSwitcher />
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
        {#if !isProductionMode && canSwitchToProduction}
          <GridDevWarning />
        {/if}
      </Grid>
      {#if productionUnavailable}
        <ProductionBlankState
          publishing={tablePublishing}
          canSeed={isInternal}
          on:publish={() => publishProductionTable(false)}
          on:seedPublish={() => publishProductionTable(true)}
        />
      {/if}
    </div>
  {/key}
{:else}
  <i>Create your first table to start building</i>
{/if}

<style>
  .grid-blank-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1 1 auto;
  }
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
