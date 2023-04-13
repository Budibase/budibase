<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  const { rows, tableId, loaded } = getContext("sheet")
</script>

<ImportButton
  tableId={$tableId}
  on:importrows={rows.actions.refreshData}
  disabled={!$loaded}
/>
