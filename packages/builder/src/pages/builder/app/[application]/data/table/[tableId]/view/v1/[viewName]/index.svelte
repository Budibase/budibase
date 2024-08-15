<script>
  import ViewDataTable from "components/backend/DataTable/ViewDataTable.svelte"
  import { views } from "stores/builder"

  $: selectedView = $views.selected
</script>

{#if selectedView}
  <ViewDataTable view={selectedView} />
{:else}<i>Create your first table to start building</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-4);
    margin-top: 2px;
  }
</style>
