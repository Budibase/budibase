<script>
  import {
    Body,
    Multiselect,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import { users } from "stores/portal"

  export let app
  export let user
  let roles = app.roles

  const options = ["READ", "WRITE", "ADMIN", "PUBLIC"]

  function updateUserRoles() {
    users.updateRoles({ ...user, roles: { ...user.roles, [app._id]: roles } })
    notifications.success("Roles updated")
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
  <Multiselect
    placeholder={null}
    bind:value={roles}
    on:change
    {options}
    label="Select roles:"
  />
</ModalContent>
