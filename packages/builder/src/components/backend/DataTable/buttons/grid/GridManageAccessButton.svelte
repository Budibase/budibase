<script>
  import { licensing, admin } from "stores/portal"
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

  var requiresLicence
  $: {
    if ($datasource.type === "viewV2" && !$licensing.isViewPermissionsEnabled) {
      const requiredLicense = $admin?.cloud ? "Premium" : "Business"
      requiresLicence = {
        tier: requiredLicense,
        message: `A ${requiredLicense} subscription is required to specify access level role for this view.`,
      }
    }
  }
</script>

<ManageAccessButton {resourceId} {requiresLicence} />
