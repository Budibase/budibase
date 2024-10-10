<script>
  import TableNavItem from "./TableNavItem/TableNavItem.svelte"
  import { alphabetical } from "./utils"

  export let tables
  export let selectTable

  $: sortedTables = tables.sort(alphabetical)
</script>

<div class="hierarchy-items-container">
  {#each sortedTables as table, idx}
    <TableNavItem {table} {idx} on:click={() => selectTable(table._id)} />
  {/each}
</div>
