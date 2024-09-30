<script>
  import { viewsV2, rowActions } from "stores/builder"
  import { admin, themeStore } from "stores/portal"
  import { Grid } from "@budibase/frontend-core"
  import { API } from "api"
  import GridCreateEditRowModal from "components/backend/DataTable/modals/grid/GridCreateEditRowModal.svelte"
  import GridFilterButton from "components/backend/DataTable/buttons/grid/GridFilterButton.svelte"
  import GridManageAccessButton from "components/backend/DataTable/buttons/grid/GridManageAccessButton.svelte"
  import GridSortButton from "components/backend/DataTable/buttons/grid/GridSortButton.svelte"
  import GridColumnsSettingButton from "components/backend/DataTable/buttons/grid/GridColumnsSettingButton.svelte"
  import GridSizeButton from "components/backend/DataTable/buttons/grid/GridSizeButton.svelte"
  import GridGenerateButton from "components/backend/DataTable/buttons/grid/GridGenerateButton.svelte"
  import GridScreensButton from "components/backend/DataTable/buttons/grid/GridScreensButton.svelte"
  import GridRowActionsButton from "components/backend/DataTable/buttons/grid/GridRowActionsButton.svelte"

  let generateButton

  $: id = $viewsV2.selected?.id
  $: datasource = {
    type: "viewV2",
    id,
    tableId: $viewsV2.selected?.tableId,
  }
  $: buttons = makeRowActionButtons($rowActions[id])
  $: rowActions.refreshRowActions(id)
  $: currentTheme = $themeStore?.theme
  $: darkMode = !currentTheme.includes("light")

  $: currentTheme = $themeStore?.theme
  $: darkMode = !currentTheme.includes("light")

  const makeRowActionButtons = actions => {
    return (actions || []).map(action => ({
      text: action.name,
      onClick: async row => {
        await rowActions.trigger(id, action.id, row._id)
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
  {darkMode}
  allowAddRows
  allowDeleteRows
  showAvatars={false}
  on:updatedatasource={handleGridViewUpdate}
  isCloud={$admin.cloud}
  buttonsCollapsed
>
  <svelte:fragment slot="controls">
    <GridFilterButton />
    <GridSortButton />
    <GridSizeButton />
    <GridColumnsSettingButton />
    <GridManageAccessButton />
    <GridRowActionsButton />
    <GridScreensButton on:request-generate={() => generateButton?.show()} />
  </svelte:fragment>
  <svelte:fragment slot="controls-right">
    <GridGenerateButton bind:this={generateButton} />
  </svelte:fragment>
  <GridCreateEditRowModal />
</Grid>
