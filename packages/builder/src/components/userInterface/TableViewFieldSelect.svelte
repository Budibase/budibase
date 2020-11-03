<script>
  import OptionSelect from "./OptionSelect.svelte"
  import { backendUiStore } from "builderStore"
  import MultiOptionSelect from "./MultiOptionSelect.svelte"

  export let componentInstance = {}
  export let value = ""
  export let onChange = () => {}
  export let multiselect = false

  const tables = $backendUiStore.tables

  let options = []

  $: table = componentInstance.datasource
    ? tables.find(m => m._id === componentInstance.datasource.tableId)
    : null

  $: type = componentInstance.datasource.type
  $: if (table) {
    options =
      type === "table" || type === "link"
        ? Object.keys(table.schema)
        : Object.keys(table.views[componentInstance.datasource.name].schema)
  }
</script>

{#if multiselect}
  <MultiOptionSelect {value} {onChange} {options} />
{:else}
  <OptionSelect {value} {onChange} {options} />
{/if}
