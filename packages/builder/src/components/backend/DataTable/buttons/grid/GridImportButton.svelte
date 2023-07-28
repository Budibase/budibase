<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  export let disabled = false

  const { rows, datasource, table } = getContext("grid")
</script>

<ImportButton
  {disabled}
  tableId={$datasource.tableId}
  tableType={$table?.type}
  on:importrows={rows.actions.refreshData}
/>
