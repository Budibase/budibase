<script>
  import { getContext } from "svelte"

  const { totalRows } = getContext("grid")
</script>

<div>
  {$totalRows} row{$totalRows === 1 ? "" : "s"}
</div>
