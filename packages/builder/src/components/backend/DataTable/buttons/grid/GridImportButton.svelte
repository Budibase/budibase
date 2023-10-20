<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  export let disabled = false

  const { rows, datasource, definition } = getContext("grid")
</script>

<ImportButton
  {disabled}
  tableId={$datasource?.tableId}
  tableType={$definition?.type}
  on:importrows={rows.actions.refreshData}
/>
