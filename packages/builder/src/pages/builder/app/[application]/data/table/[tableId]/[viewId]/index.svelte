<script>
  import { viewsV2 } from "stores/builder"
  import { admin, licensing } from "stores/portal"
  import { Grid } from "@budibase/frontend-core"
  import { API } from "api"
  import GridCreateEditRowModal from "components/backend/DataTable/modals/grid/GridCreateEditRowModal.svelte"
  import GridFilterButton from "components/backend/DataTable/buttons/grid/GridFilterButton.svelte"
  import GridManageAccessButton from "components/backend/DataTable/buttons/grid/GridManageAccessButton.svelte"
  import GridSortButton from "components/backend/DataTable/buttons/grid/GridSortButton.svelte"
  import GridColumnsSettingButton from "components/backend/DataTable/buttons/grid/GridColumnsSettingButton.svelte"
  import GridSizeButton from "components/backend/DataTable/buttons/grid/GridSizeButton.svelte"
  import GridGenerateButton from "components/backend/DataTable/buttons/grid/GridGenerateButton.svelte"

  $: id = $viewsV2.selected?.id
  $: datasource = {
    type: "viewV2",
    id,
    tableId: $viewsV2.selected?.tableId,
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
  allowViewReadonlyColumns={$licensing.isViewReadonlyColumnsEnabled}
>
  <svelte:fragment slot="controls">
    <GridFilterButton />
    <GridSortButton />
    <GridSizeButton />
    <GridColumnsSettingButton />
    <GridManageAccessButton />
  </svelte:fragment>
  <svelte:fragment slot="controls-right">
    <GridGenerateButton />
  </svelte:fragment>
  <GridCreateEditRowModal />
</Grid>
