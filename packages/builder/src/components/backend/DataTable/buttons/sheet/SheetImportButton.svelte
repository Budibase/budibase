<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  const { rows, tableId } = getContext("sheet")
</script>

<ImportButton tableId={$tableId} on:importrows={rows.actions.refreshData} />
