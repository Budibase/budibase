<script>
  import { getContext } from "svelte"

  const { rows } = getContext("grid")
</script>

<div>
  {$rows.length} row{$rows.length === 1 ? "" : "s"}
</div>
