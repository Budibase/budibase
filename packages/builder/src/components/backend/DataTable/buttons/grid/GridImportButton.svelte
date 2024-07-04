<script>
import { getContext } from "svelte"
import ImportButton from "../ImportButton.svelte"

export let disabled = false

const { rows, datasource, definition } = getContext("grid")
</script>

<ImportButton
  {disabled}
  tableId={$datasource?.tableId}
  tableType={$definition?.sourceType}
  on:importrows={rows.actions.refreshData}
/>
