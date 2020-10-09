<script>
  import OptionSelect from "./OptionSelect.svelte"
  import { backendUiStore } from "builderStore"
  import { onMount } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let onChange = (val = {})

  const tables = $backendUiStore.tables

  let options = []

  $: table = componentInstance.datasource
    ? tables.find(m => m._id === componentInstance.datasource.tableId)
    : null

  $: if (table) {
    options = componentInstance.datasource.isTable
      ? Object.keys(table.schema)
      : Object.keys(table.views[componentInstance.datasource.name].schema)
  }
</script>

<OptionSelect {value} {onChange} {options} />
