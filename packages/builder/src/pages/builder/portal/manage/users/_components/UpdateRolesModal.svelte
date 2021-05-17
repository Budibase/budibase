<script>
  import { Body, Select, ModalContent, notifications } from "@budibase/bbui"
  import { fetchData } from "helpers"
  import { users } from "stores/portal"

  export let app
  export let user

  const roles = fetchData(`/api/admin/roles/${app._id}`)
  $: options = $roles?.data?.roles?.map(role => role._id)
  let selectedRole

  function updateUserRoles() {
    users.updateRoles({
      ...user,
      roles: {
        ...user.roles,
        [app._id]: selectedRole,
      },
    })
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
  <Select
    placeholder={null}
    bind:value={selectedRole}
    on:change
    {options}
    label="Select roles:"
  />
</ModalContent>
