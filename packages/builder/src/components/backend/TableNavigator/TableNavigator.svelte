<script>
  import TableNavItem from "./TableNavItem/TableNavItem.svelte"

  export let tables
  export let selectTable

  $: sortedTables = tables.sort(alphabetical)

  const alphabetical = (a, b) => {
    return a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
  }
</script>

<div class="hierarchy-items-container">
  {#each sortedTables as table, idx}
    <TableNavItem {table} {idx} on:click={() => selectTable(table._id)} />
  {/each}
</div>
