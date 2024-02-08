<script>
  import Table from "components/backend/DataTable/Table.svelte"
  import { cloneDeep } from "lodash/fp"

  export let schema = {}
  export let rows = []
  export let maxRowsToDisplay = 5

  let rowsToDisplay
  $: {
    rowsToDisplay = [
      ...cloneDeep(rows).slice(0, maxRowsToDisplay),
      // { [Object.keys(schema)[0]]: "1" },
    ]

    if (rows.length - maxRowsToDisplay) {
      rowsToDisplay.push({
        [Object.keys(schema)[0]]: `...${
          rows.length - maxRowsToDisplay
        } further items`,
      })
    }
  }
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
</div>

<style>
  .table :global(.spectrum-Table-cell) {
    min-width: 100px;
  }
</style>
