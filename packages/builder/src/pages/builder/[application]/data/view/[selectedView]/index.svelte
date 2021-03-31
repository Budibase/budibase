<script>
  import ViewDataTable from "components/backend/DataTable/ViewDataTable.svelte"
  import { backendUiStore } from "builderStore"

  $: selectedView = $backendUiStore.selectedView
</script>

{#if $backendUiStore.selectedDatabase._id && selectedView}
  <ViewDataTable view={selectedView} />
{:else}<i>Create your first table to start building</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-4);
    margin-top: 2px;
  }
</style>
