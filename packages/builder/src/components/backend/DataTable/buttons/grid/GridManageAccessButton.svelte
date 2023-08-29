<script>
  import { licensing } from "stores/portal"
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

  $: disabled =
    $datasource.type === "viewV2" && !$licensing.isViewPermissionsEnabled
</script>

<ManageAccessButton {resourceId} {disabled} />
