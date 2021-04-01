<script>
  import TableDataTable from "components/backend/DataTable/DataTable.svelte"
  import { tables, database } from 'stores/backend/'
</script>

{#if $database?._id && $tables?.selected?.name}
  <TableDataTable />
{:else}<i>Create your first table to start building</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
