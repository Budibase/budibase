<script>
import { Body, ModalContent, Select, keepOpen } from "@budibase/bbui"
import RoleSelect from "components/common/RoleSelect.svelte"
import { roles } from "stores/builder"
import { appsStore, groups } from "stores/portal"

export let group

$: appOptions = $appsStore.apps.map(app => ({
  label: app.name,
  value: app,
}))
$: confirmDisabled =
  (!selectingRole && !selectedApp) || (selectingRole && !selectedRoleId)
let selectedApp, selectedRoleId
let selectingRole = false

async function appSelected() {
  const prodAppId = appsStore.getProdAppID(selectedApp.devId)
  if (!selectingRole) {
    selectingRole = true
    await roles.fetchByAppId(prodAppId)

    return keepOpen
  } else {
    await groups.actions.addApp(group._id, prodAppId, selectedRoleId)
  }
}
</script>

<ModalContent
  onConfirm={appSelected}
  size="M"
  title="Add app to group"
  confirmText={selectingRole ? "Confirm" : "Next"}
  showSecondaryButton={selectingRole}
  secondaryButtonText="Back"
  secondaryAction={() => (selectingRole = false)}
  disabled={confirmDisabled}
>
  {#if !selectingRole}
    <Body
      >Select an app to assign roles for members of <i>"{group.name}"</i></Body
    >
    <Select bind:value={selectedApp} options={appOptions} />
  {:else}
    <Body
      >Select the role that all members of "<i>{group.name}</i>" will have for
      <i>"{selectedApp.name}"</i></Body
    >
    <RoleSelect allowPublic={false} bind:value={selectedRoleId} />
  {/if}
</ModalContent>
