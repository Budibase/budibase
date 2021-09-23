<script>
  import CreateDatasourceModal from "components/backend/DatasourceNavigator/modals/CreateDatasourceModal.svelte"
  import { datasources } from "stores/backend"

  $: setupComplete =
    $datasources.list.find(x => (x._id = "bb_internal")).entities.length > 1 ||
    $datasources.list > 1
</script>

{#if !setupComplete}
  <CreateDatasourceModal />
{/if}
<!-- routify:options index=false -->
