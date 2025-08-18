<script lang="ts">
  import {
    viewsV2,
    rowActions,
    dataEnvironmentStore,
    dataAPI,
    tables,
    datasources,
  } from "@/stores/builder"
  import { gridClipboard } from "@budibase/frontend-core"
  import { admin, themeStore, licensing } from "@/stores/portal"
  import { Grid } from "@budibase/frontend-core"
  import { notifications } from "@budibase/bbui"
  import GridCreateEditRowModal from "@/components/backend/DataTable/modals/grid/GridCreateEditRowModal.svelte"
  import GridFilterButton from "@/components/backend/DataTable/buttons/grid/GridFilterButton.svelte"
  import GridManageAccessButton from "@/components/backend/DataTable/buttons/grid/GridManageAccessButton.svelte"
  import GridSortButton from "@/components/backend/DataTable/buttons/grid/GridSortButton.svelte"
  import GridColumnsSettingButton from "@/components/backend/DataTable/buttons/grid/GridColumnsSettingButton.svelte"
  import GridSizeButton from "@/components/backend/DataTable/buttons/grid/GridSizeButton.svelte"
  import GridGenerateButton from "@/components/backend/DataTable/buttons/grid/GridGenerateButton.svelte"
  import GridScreensButton from "@/components/backend/DataTable/buttons/grid/GridScreensButton.svelte"
  import GridRowActionsButton from "@/components/backend/DataTable/buttons/grid/GridRowActionsButton.svelte"
  import GridViewCalculationButton from "@/components/backend/DataTable/buttons/grid/GridViewCalculationButton.svelte"
  import GridDevProdSwitcher from "@/components/backend/DataTable/buttons/grid/GridDevProdSwitcher.svelte"
  import { ViewV2Type, DataEnvironmentMode, type Row } from "@budibase/types"
  import GridDevWarning from "@/components/backend/DataTable/alert/grid/GridDevWarning.svelte"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  let generateButton: GridGenerateButton

  $: view = $viewsV2.selected
  $: calculation = view?.type === ViewV2Type.CALCULATION
  $: id = view?.id!
  $: datasource = {
    type: "viewV2",
    id,
    tableId: view?.tableId,
  }
  $: isInternal = $tables.selected?.sourceType !== DB_TYPE_EXTERNAL
  $: tableDatasource = $datasources.list.find(datasource => {
    return datasource._id === $tables.selected?.sourceId
  })
  $: buttons = makeRowActionButtons($rowActions[id])
  $: rowActions.refreshRowActions(id)
  $: currentTheme = $themeStore?.theme
  $: darkMode = !currentTheme.includes("light")
  $: canSwitchToProduction =
    isInternal || tableDatasource?.usesEnvironmentVariables
  $: isProductionMode =
    $dataEnvironmentStore.mode === DataEnvironmentMode.PRODUCTION
  $: externalClipboardData = {
    clipboard: gridClipboard,
    tableId: view?.tableId,
    viewId: id,
    onCopy: (data: any) => {
      gridClipboard.copy(
        data.value,
        data.multiCellCopy,
        data.tableId,
        data.viewId
      )
    },
  }

  const makeRowActionButtons = (actions: any[]) => {
    return (actions || []).map(action => ({
      text: action.name,
      onClick: async (row: Row) => {
        await rowActions.trigger(id, action.id, row._id!)
        notifications.success("Row action triggered successfully")
      },
    }))
  }

  const handleGridViewUpdate = async (e: any) => {
    viewsV2.replaceView(id, e.detail)
  }
</script>

{#key $dataEnvironmentStore.mode}
  <Grid
    API={$dataAPI}
    {darkMode}
    {datasource}
    {buttons}
    allowAddRows
    allowDeleteRows
    aiEnabled={$licensing.customAIConfigsEnabled ||
      $licensing.budibaseAIEnabled}
    showAvatars={false}
    externalClipboard={externalClipboardData}
    on:updatedatasource={handleGridViewUpdate}
    on:definitionMissing={() =>
      dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)}
    isCloud={$admin.cloud}
    buttonsCollapsed
  >
    <svelte:fragment slot="controls">
      {#if !isProductionMode}
        <GridManageAccessButton />
        {#if calculation}
          <GridViewCalculationButton />
        {/if}
        <GridFilterButton />
        <GridSortButton />
        <GridSizeButton />
        {#if !calculation}
          <GridColumnsSettingButton />
          <GridRowActionsButton />
          <GridScreensButton on:generate={() => generateButton?.show()} />
        {/if}
        <GridGenerateButton bind:this={generateButton} />
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="controls-right">
      <GridDevProdSwitcher />
    </svelte:fragment>
    <GridCreateEditRowModal />
    {#if !isProductionMode && canSwitchToProduction}
      <GridDevWarning />
    {/if}
  </Grid>
{/key}
