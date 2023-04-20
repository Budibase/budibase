<script>
  import ImportButton from "../ImportButton.svelte"
  import { getContext } from "svelte"

  export let disabled = false

  const { rows, tableId } = getContext("grid")
</script>

<ImportButton
  {disabled}
  tableId={$tableId}
  on:importrows={rows.actions.refreshData}
/>
