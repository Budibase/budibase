<script>
  import { API } from "api"
  import { Grid } from "@budibase/frontend-core"
  import { views } from "stores/backend"

  $: selectedView = $views.selected
</script>

<div class="wrapper">
  <Grid
    {API}
    tableId={selectedView?._id}
    datasourceType="viewV2"
    showAvatars={false}
    showControls={false}
  />
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
