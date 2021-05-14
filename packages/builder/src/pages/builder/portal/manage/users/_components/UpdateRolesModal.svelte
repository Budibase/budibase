<script>
  import { Body, Multiselect, ModalContent } from "@budibase/bbui"
  import { users } from "stores/portal"

  export let app
  export let user
  let roles = app.roles

  const options = ["READ", "WRITE", "ADMIN", "PUBLIC"]

  function updateUserRoles() {
    users.updateRoles({ ...user, roles: { ...user.roles, [app._id]: roles } })
    console.log("updating roles!")
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
    >Select the roles that this user should use for the {app.name}.</Body
  >
  <Multiselect
    placeholder={null}
    bind:value={roles}
    on:change
    {options}
    label="Select roles:"
  />
</ModalContent>
