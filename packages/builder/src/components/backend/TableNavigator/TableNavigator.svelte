<script>
  import { goto } from "@roxi/routify"
  import TableNavItem from "./TableNavItem/TableNavItem.svelte"
  import ViewNavItem from "./ViewNavItem/ViewNavItem.svelte"

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
    {#each [...Object.entries(table.views || {})].sort() as [name, view], idx (idx)}
      <ViewNavItem
        {view}
        {name}
        on:click={() => {
          if (view.version === 2) {
            $goto(`./view/v2/${encodeURIComponent(view.id)}`)
          } else {
            $goto(`./view/v1/${encodeURIComponent(name)}`)
          }
        }}
      />
    {/each}
  {/each}
</div>
