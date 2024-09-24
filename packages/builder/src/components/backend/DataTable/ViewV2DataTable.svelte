<script>
  import { viewsV2 } from "stores/builder"
  import { admin } from "stores/portal"
  import { Grid } from "@budibase/frontend-core"
  import { API } from "api"
  import GridCreateEditRowModal from "components/backend/DataTable/modals/grid/GridCreateEditRowModal.svelte"
  import GridFilterButton from "components/backend/DataTable/buttons/grid/GridFilterButton.svelte"
  import GridManageAccessButton from "components/backend/DataTable/buttons/grid/GridManageAccessButton.svelte"
  import { isEnabled } from "helpers/featureFlags"
  import { FeatureFlag } from "@budibase/types"

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

<div class="wrapper">
  <Grid
    {API}
    {datasource}
    allowAddRows
    allowDeleteRows
    showAvatars={false}
    on:updatedatasource={handleGridViewUpdate}
    isCloud={$admin.cloud}
    canSetRelationshipSchemas={isEnabled(FeatureFlag.ENRICHED_RELATIONSHIPS)}
  >
    <svelte:fragment slot="filter">
      <GridFilterButton />
    </svelte:fragment>
    <svelte:fragment slot="controls">
      <GridCreateEditRowModal />
      <GridManageAccessButton />
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
    overflow: hidden;
  }
</style>
