<script>
  import ManageAccessButton from "../ManageAccessButton.svelte"
  import { getContext } from "svelte"

  const { datasource } = getContext("grid")

  $: resourceId = getResourceID($datasource)

  const getResourceID = datasource => {
    if (!datasource) {
      return null
    }
    return datasource.type === "table" ? datasource.tableId : datasource.id
  }
</script>

<ManageAccessButton {resourceId} />
