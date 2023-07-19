<script>
  import { createEventDispatcher } from "svelte"
  import { Body, Select, ModalContent, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"
  import { sdk } from "@budibase/shared-core"

  export let app
  export let user

  const NO_ACCESS = "NO_ACCESS"

  const dispatch = createEventDispatcher()

  const roles = app.roles
  let options = roles
    .filter(role => role._id !== "PUBLIC")
    .map(role => ({ value: role._id, label: role.name }))

  if (!sdk.users.isBuilder(user, app?.appId)) {
    options.push({ value: NO_ACCESS, label: "No Access" })
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
      notifications.success("Role updated")
      dispatch("update")
    } catch (error) {
      notifications.error("Failed to update role")
    }
  }
</script>

<ModalContent
  onConfirm={updateUserRoles}
  title="Update App Role"
  confirmText="Update role"
  cancelText="Cancel"
  size="M"
  showCloseIcon={false}
>
  <Body>
    Update {user.email}'s role for <strong>{app.name}</strong>.
  </Body>
  <Select
    placeholder={null}
    bind:value={selectedRole}
    on:change
    {options}
    label="Role"
    getOptionLabel={role => role.label}
    getOptionValue={role => role.value}
  />
</ModalContent>
