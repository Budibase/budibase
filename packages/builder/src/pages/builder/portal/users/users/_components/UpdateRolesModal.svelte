<script>
  import { createEventDispatcher } from "svelte"
  import { Body, Select, ModalContent, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"

  import { _ } from "../../../../../../../lang/i18n"

  export let app
  export let user

  const NO_ACCESS = "NO_ACCESS"

  const dispatch = createEventDispatcher()

  const roles = app.roles
  let options = roles
    .filter(role => role._id !== "PUBLIC")
    .map(role => ({ value: role._id, label: role.name }))

  if (!user?.builder?.global) {
    options.push({
      value: NO_ACCESS,
      label: $_(
        "pages.builder.portal.users.users._components.UpdateRolesModal.No_Access"
      ),
    })
  }
  let selectedRole = user?.roles?.[app?._id]

  async function updateUserRoles() {
    try {
      if (selectedRole === NO_ACCESS) {
        // Remove the user role
        const filteredRoles = { ...user.roles }
        delete filteredRoles[app?._id]
        await users.save({
          ...user,
          roles: {
            ...filteredRoles,
          },
        })
      } else {
        // Add the user role
        await users.save({
          ...user,
          roles: {
            ...user.roles,
            [app._id]: selectedRole,
          },
        })
      }
      notifications.success(
        $_(
          "pages.builder.portal.users.users._components.UpdateRolesModal.Role_updated"
        )
      )
      dispatch("update")
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.portal.users.users._components.UpdateRolesModal.Failed_update"
        )
      )
    }
  }
</script>

<ModalContent
  onConfirm={updateUserRoles}
  title={$_(
    "pages.builder.portal.users.users._components.UpdateRolesModal.Update_Role"
  )}
  confirmText={$_(
    "pages.builder.portal.users.users._components.UpdateRolesModal.Update_role"
  )}
  cancelText={$_(
    "pages.builder.portal.users.users._components.UpdateRolesModal.Cancel"
  )}
  size="M"
  showCloseIcon={false}
>
  <Body>
    {$_("pages.builder.portal.users.users._components.UpdateRolesModal.Update")}
    {user.email}{$_(
      "pages.builder.portal.users.users._components.UpdateRolesModal.role_for"
    )} <strong>{app.name}</strong>.
  </Body>
  <Select
    placeholder={null}
    bind:value={selectedRole}
    on:change
    {options}
    label={$_(
      "pages.builder.portal.users.users._components.UpdateRolesModal.Role"
    )}
    getOptionLabel={role => role.label}
    getOptionValue={role => role.value}
  />
</ModalContent>
