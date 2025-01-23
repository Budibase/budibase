<script>
  import { viewsV2, rowActions } from "@/stores/builder"
  import { admin, themeStore, licensing } from "@/stores/portal"
  import { Grid } from "@budibase/frontend-core"
  import { API } from "@/api"
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
  import { ViewV2Type } from "@budibase/types"

  let generateButton

  $: view = $viewsV2.selected
  $: calculation = view?.type === ViewV2Type.CALCULATION
  $: id = view?.id
  $: datasource = {
    type: "viewV2",
    id,
    tableId: view?.tableId,
  }
  $: buttons = makeRowActionButtons($rowActions[id])
  $: rowActions.refreshRowActions(id)
  $: currentTheme = $themeStore?.theme
  $: darkMode = !currentTheme.includes("light")

  const makeRowActionButtons = actions => {
    return (actions || []).map(action => ({
      text: action.name,
      onClick: async row => {
        await rowActions.trigger(id, action.id, row._id)
        notifications.success("Row action triggered successfully")
      },
    }))
  }

  const handleGridViewUpdate = async e => {
    viewsV2.replaceView(id, e.detail)
  }
</script>

<Grid
  {API}
  {darkMode}
  {datasource}
  {buttons}
  allowAddRows
  allowDeleteRows
  aiEnabled={$licensing.customAIConfigsEnabled || $licensing.budibaseAiEnabled}
  showAvatars={false}
  on:updatedatasource={handleGridViewUpdate}
  isCloud={$admin.cloud}
  buttonsCollapsed
>
  <svelte:fragment slot="controls">
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
  </svelte:fragment>
  <GridCreateEditRowModal />
</Grid>
