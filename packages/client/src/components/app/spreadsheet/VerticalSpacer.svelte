<script>
  import { getContext } from "svelte"

  const { selectedCellId, hoveredRowId } = getContext("spreadsheet")
</script>

<div
  on:click={() => ($selectedCellId = null)}
  on:mouseenter={() => ($hoveredRowId = null)}
/>

<style>
  div {
    grid-column: 1/-1;
    height: 180px;
  }
</style>
