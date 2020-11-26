<script>
  import TableDataTable from "components/backend/DataTable/DataTable.svelte"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"
  import { backendUiStore } from "builderStore"

  $: selectedTable = $backendUiStore.selectedTable
</script>

{#if $backendUiStore.selectedDatabase._id && selectedTable.name}
  {#if selectedTable.integration?.type}
    <ExternalDataSourceTable />
  {:else}
    <TableDataTable />
  {/if}
{:else}
  <i>Create your first table to start building</i>
{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
