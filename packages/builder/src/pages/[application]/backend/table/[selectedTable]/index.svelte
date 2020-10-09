<script>
  import TableDataTable from "components/backend/DataTable/DataTable.svelte"
  import { backendUiStore } from "builderStore"

  $: selectedTable = $backendUiStore.selectedTable
</script>

{#if $backendUiStore.selectedDatabase._id && selectedTable.name}
  <TableDataTable />
{:else}
  <i>Create your first table to start building</i>
{/if}

<style>
  i {
    font-size: var(--font-size-xl);
    color: var(--grey-4);
  }
</style>
