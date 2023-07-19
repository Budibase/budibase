<script>
  import { views } from "stores/backend"
  import { Grid } from "@budibase/frontend-core"
  import { API } from "api"

  export let id
</script>

<div class="wrapper">
  <Grid
    {API}
    tableId={id}
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
