<script>
  import { createEventDispatcher } from "svelte"
  import { Body, Select, ModalContent, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"

  export let app
  export let user

  const dispatch = createEventDispatcher()

  const roles = app.roles
  let options = roles
    .map(role => ({ value: role._id, label: role.name }))
    .filter(role => role.value !== "PUBLIC")
  let selectedRole = user?.roles?.[app?._id]

  async function updateUserRoles() {
    const res = await users.save({
      ...user,
      roles: {
        ...user.roles,
        [app._id]: selectedRole,
      },
    })
    if (res.status === 400) {
      notifications.error("Failed to update role")
    } else {
      notifications.success("Role updated")
      dispatch("update")
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
  />
</ModalContent>
