<script>
  import Table from "@/components/backend/DataTable/Table.svelte"
  import { cloneDeep } from "lodash/fp"

  export let schema = {}
  export let rows = []
  export let maxRowsToDisplay = 5

  let rowsToDisplay
  $: rowsToDisplay = [...cloneDeep(rows).slice(0, maxRowsToDisplay)]

  $: additionalRows = rows.length - maxRowsToDisplay

  // Cast field in query preview response to number if specified by schema
  $: {
    for (let i = 0; i < rowsToDisplay.length; i++) {
      let row = rowsToDisplay[i]
      for (let fieldName of Object.keys(schema)) {
        if (schema[fieldName] === "number" && !isNaN(Number(row[fieldName]))) {
          row[fieldName] = Number(row[fieldName])
        } else {
          row[fieldName] = row[fieldName]?.toString()
        }
      }
    }
  }
</script>

<div class="table">
  <Table {schema} data={rowsToDisplay} allowEditing={false} />
  {#if additionalRows > 0}
    <div class="show-more">
      ...{additionalRows} further items
    </div>
  {/if}
</div>

<style>
  .table :global(.spectrum-Table-cell),
  .show-more {
    min-width: 100px;
  }

  .show-more {
    display: flex;
    padding: 16px;
    justify-content: center;

    background-color: var(--spectrum-global-color-gray-50);
    border: 1px solid var(--spectrum-alias-border-color-mid);
    border-top: 0;
  }
</style>
