<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  export let disabled = false

  const { rows, tableId, tableType } = getContext("grid")
</script>

<ImportButton
  {disabled}
  tableId={$tableId}
  {tableType}
  on:importrows={rows.actions.refreshData}
/>
