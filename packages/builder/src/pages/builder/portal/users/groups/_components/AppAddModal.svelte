<script>
  import { Body, ModalContent, Select } from "@budibase/bbui"
  import { apps, groups } from "stores/portal"
  import { roles } from "stores/backend"
  import RoleSelect from "components/common/RoleSelect.svelte"

  import { _ } from "../../../../../../../lang/i18n"

  export let group

  $: appOptions = $apps.map(app => ({
    label: app.name,
    value: app,
  }))
  $: confirmDisabled =
    (!selectingRole && !selectedApp) || (selectingRole && !selectedRoleId)
  let selectedApp, selectedRoleId
  let selectingRole = false

  async function appSelected() {
    const prodAppId = apps.getProdAppID(selectedApp.devId)
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
  title={$_(
    "pages.builder.portal.users.groups._components.AppAddModal.Add_group"
  )}
  confirmText={selectingRole
    ? $_("pages.builder.portal.users.groups._components.AppAddModal.Confirm")
    : $_("pages.builder.portal.users.groups._components.AppAddModal.Next")}
  showSecondaryButton={selectingRole}
  secondaryButtonText={$_(
    "pages.builder.portal.users.groups._components.AppAddModal.Back"
  )}
  secondaryAction={() => (selectingRole = false)}
  disabled={confirmDisabled}
>
  {#if !selectingRole}
    <Body
      >{$_(
        "pages.builder.portal.users.groups._components.AppAddModal.Select_roles"
      )}
      <i>"{group.name}"</i></Body
    >
    <Select bind:value={selectedApp} options={appOptions} />
  {:else}
    <Body
      >{$_(
        "pages.builder.portal.users.groups._components.AppAddModal.Select_role"
      )} "<i>{group.name}</i>" {$_(
        "pages.builder.portal.users.groups._components.AppAddModal.will_for"
      )}
      <i>"{selectedApp.name}"</i></Body
    >
    <RoleSelect allowPublic={false} bind:value={selectedRoleId} />
  {/if}
</ModalContent>
