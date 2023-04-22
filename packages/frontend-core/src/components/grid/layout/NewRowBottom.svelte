<script>
  import NewRow from "./NewRow.svelte"
  import { getContext } from "svelte"
  import { DefaultRowHeight } from "../lib/constants"

  const { rows, renderedRows, scrollTop, rowHeight } = getContext("grid")

  $: top =
    $renderedRows.length * $rowHeight -
    ($scrollTop % $rowHeight) +
    DefaultRowHeight
</script>

<div class="new-row-bottom" style="top:{top}px;">
  <NewRow rowIdx={$rows.length} />
</div>

<style>
  .new-row-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100px;
  }
</style>
