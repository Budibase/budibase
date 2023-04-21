<script>
  import ManageAccessButton from "../ManageAccessButton.svelte"
  import { getContext } from "svelte"

  const { config } = getContext("grid")
</script>

<ManageAccessButton resourceId={$config.tableId} />
