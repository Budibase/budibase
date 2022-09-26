<script>
  import { Body, ModalContent, Select } from "@budibase/bbui"
  import { apps, groups } from "stores/portal"
  import { roles } from "stores/backend"
  import RoleSelect from "components/common/RoleSelect.svelte"

  export let group

  $: appOptions = $apps.map(app => ({
    label: app.name,
    value: app,
  }))
  $: prodAppId = selectedApp ? apps.getProdAppID(selectedApp.appId) : ""
  $: confirmDisabled =
    (!selectingRole && !selectedApp) || (selectingRole && !selectedRoleId)
  let selectedApp, selectedRoleId
  let selectingRole = false

  async function appSelected() {
    if (!selectingRole) {
      selectingRole = true
      await roles.fetchByAppId(prodAppId)
      // return false to stop closing modal
      return false
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
    <Body>Select the app to add to the <i>"{group.name}"</i> group.</Body>
    <Select bind:value={selectedApp} options={appOptions} />
  {:else}
    <Body
      >Pick the role this group will appear as in the <i>"{selectedApp.name}"</i
      > app.</Body
    >
    <RoleSelect allowPublic={false} bind:value={selectedRoleId} />
  {/if}
</ModalContent>
