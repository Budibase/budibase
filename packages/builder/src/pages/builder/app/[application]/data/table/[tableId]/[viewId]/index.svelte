<script>
  import { viewsV2, rowActions } from "stores/builder"
  import { admin } from "stores/portal"
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
  import GridViewCalculationButton from "components/backend/DataTable/buttons/grid/GridViewCalculationButton.svelte"

  let generateButton

  $: view = $viewsV2.selected
  $: id = view?.id
  $: datasource = {
    type: "viewV2",
    id,
    tableId: view?.tableId,
  }
  $: buttons = makeRowActionButtons($rowActions[id])
  $: rowActions.refreshRowActions(id)

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
  {datasource}
  allowAddRows
  allowDeleteRows
  showAvatars={false}
  on:updatedatasource={handleGridViewUpdate}
  isCloud={$admin.cloud}
  {buttons}
  buttonsCollapsed
>
  <svelte:fragment slot="controls">
    {#if view?.calculation}
      <GridViewCalculationButton />
    {/if}
    <GridFilterButton />
    <GridSortButton />
    <GridSizeButton />
    <GridManageAccessButton />
    {#if !view?.calculation}
      <GridColumnsSettingButton />
      <GridRowActionsButton />
      <GridScreensButton on:request-generate={() => generateButton?.show()} />
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="controls-right">
    <GridGenerateButton bind:this={generateButton} />
  </svelte:fragment>
  <GridCreateEditRowModal />
</Grid>
