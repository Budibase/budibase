<script>
  import ManageAccessButton from "../ManageAccessButton.svelte"
  import { getContext } from "svelte"

  const { config } = getContext("sheet")
</script>

<ManageAccessButton resourceId={$config.tableId} />
