<script>
  import ManageAccessButton from "../ManageAccessButton.svelte"
  import { getContext } from "svelte"

  const { tableId } = getContext("grid")
</script>

<ManageAccessButton resourceId={$tableId} />
