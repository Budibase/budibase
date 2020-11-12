<script>
  import { onMount } from "svelte"
  import {
    fetchTableDefinition,
    fetchRelationshipData,
  } from "../../../../component-sdk"

  export let columnName
  export let row

  $: count =
    row && columnName && Array.isArray(row[columnName])
      ? row[columnName].length
      : 0
  let linkedRows = []
  let displayColumn

  onMount(async () => {
    linkedRows = await fetchLinkedRowsData(row, columnName)
    if (linkedRows && linkedRows.length) {
      const table = await fetchTableDefinition(linkedRows[0].tableId)
      if (table && table.primaryDisplay) {
        displayColumn = table.primaryDisplay
      }
    }
  })

  async function fetchLinkedRowsData(row, columnName) {
    if (!row || !row._id) {
      return []
    }
    return await fetchRelationshipData({
      tableId: row.tableId,
      rowId: row._id,
      fieldName: columnName,
    })
  }
</script>

<div class="container">
  {#if linkedRows && linkedRows.length && displayColumn}
    {#each linkedRows as linkedRow}
      {#if linkedRow[displayColumn] != null && linkedRow[displayColumn] !== ''}
        <div class="linked-row">{linkedRow[displayColumn]}</div>
      {/if}
    {/each}
  {:else}{count} related row(s){/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    width: 100%;
  }

  /* This styling is opinionated to ensure these always look consistent */
  .linked-row {
    color: white;
    background-color: #616161;
    border-radius: var(--border-radius-xs);
    padding: var(--spacing-xs) var(--spacing-s) calc(var(--spacing-xs) + 1px)
      var(--spacing-s);
    line-height: 1;
    font-size: 0.8em;
    font-family: var(--font-sans);
    font-weight: 500;
  }
</style>
