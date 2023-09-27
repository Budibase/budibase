<script>
  import Table from "components/backend/DataTable/Table.svelte"
  import { cloneDeep } from "lodash/fp"

  export let schema = {}
  export let rows = []

  $: rowsCopy = cloneDeep(rows)

  // Cast field in query preview response to number if specified by schema
  $: {
    for (let i = 0; i < rowsCopy.length; i++) {
      let row = rowsCopy[i]
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
  <Table {schema} data={rowsCopy} type="external" allowEditing={false} />
</div>

<style>
  .table :global(.spectrum-Table-cell) {
    min-width: 100px;
  }
</style>
