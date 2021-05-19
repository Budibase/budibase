<script>
  import { createEventDispatcher } from "svelte"
  import { Body, Select, ModalContent, notifications } from "@budibase/bbui"
  import { fetchData } from "helpers"
  import { users } from "stores/portal"

  export let app
  export let user

  const dispatch = createEventDispatcher()

  const roles = app.roles
  let options = roles.map(role => role._id)
  let selectedRole

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
      notifications.success("Roles updated")
      dispatch("update")
    }
  }
</script>

<ModalContent
  onConfirm={updateUserRoles}
  title="Update App Roles"
  confirmText="Update roles"
  cancelText="Cancel"
  size="M"
  showCloseIcon={false}
>
  <Body noPadding
    >Update {user.email}'s roles for <strong>{app.name}</strong>.</Body
  >
  <Select
    placeholder={null}
    bind:value={selectedRole}
    on:change
    {options}
    label="Select roles:"
  />
</ModalContent>
