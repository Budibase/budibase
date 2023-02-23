<script>
  import SpreadsheetCell from "./SpreadsheetCell.svelte"
  import { getContext } from "svelte"

  const { selectedCellId, hoveredRowId } = getContext("spreadsheet")
</script>

<SpreadsheetCell
  {...$$props}
  spacer
  on:click={() => ($selectedCellId = null)}
  on:mouseenter={() => ($hoveredRowId = null)}
/>
