<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  const { rows, config } = getContext("sheet")

  const refresh = () => {
    rows.actions.refreshData()
  }
</script>

<ImportButton tableId={$config.tableId} on:importrows={refresh} />
