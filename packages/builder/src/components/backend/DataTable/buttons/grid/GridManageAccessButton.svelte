<script>
  import ManageAccessButton from "../ManageAccessButton.svelte"
  import { getContext } from "svelte"

  const { datasource } = getContext("grid")
</script>

<ManageAccessButton resourceId={$datasource?.tableId} />
