<script>
  import { onMount } from "svelte"
  import { fetchTableDefinition } from "@budibase/component-sdk"

  export let _bb
  export let table

  let row = {}

  $: {
    row.tableId = table
  }

  let target

  onMount(async () => {
    if (table && typeof table === "string") {
      const tableObj = await fetchTableDefinition(table)
      row.tableId = table
      row._table = tableObj
      _bb.attachChildren(target, {
        context: row,
      })
    } else {
      _bb.attachChildren(target, {
        context: {},
      })
    }
  })
</script>

<section bind:this={target} />
