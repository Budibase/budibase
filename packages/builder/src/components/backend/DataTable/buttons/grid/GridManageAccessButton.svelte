<script>
  import ManageAccessButton from "../ManageAccessButton.svelte"
  import { getContext } from "svelte"

  const { datasource } = getContext("grid")

  $: ds = $datasource
  $: resourceId = ds?.type === "table" ? ds.tableId : ds?.id
</script>

<ManageAccessButton {resourceId} />
