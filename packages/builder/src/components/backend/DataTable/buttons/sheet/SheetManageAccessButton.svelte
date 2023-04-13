<script>
  import ManageAccessButton from "../ManageAccessButton.svelte"
  import { getContext } from "svelte"

  const { config, loaded } = getContext("sheet")
</script>

<ManageAccessButton disabled={!$loaded} resourceId={$config.tableId} />
