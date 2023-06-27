<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  export let disabled = false

  const { rows, tableId, table } = getContext("grid")
</script>

<ImportButton
  {disabled}
  tableId={$tableId}
  tableType={$table?.type}
  on:importrows={rows.actions.refreshData}
/>
