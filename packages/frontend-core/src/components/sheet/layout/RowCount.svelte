<script>
  import { getContext } from "svelte"

  const { rows } = getContext("sheet")
</script>

<div>
  {$rows.length} row{$rows.length === 1 ? "" : "s"}
</div>
