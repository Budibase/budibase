<script>
  import { notifications, Select } from "@budibase/bbui"
  import { users } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  export let row
  $: value = users.getUserRole(row)

  async function updateUserRole({ detail }) {
    if (detail === "developer") {
      toggleFlags({ admin: { global: false }, builder: { global: true } })
    } else if (detail === "admin") {
      toggleFlags({ admin: { global: true }, builder: { global: false } })
    } else if (detail === "appUser") {
      toggleFlags({ admin: { global: false }, builder: { global: false } })
    }
  }
  async function toggleFlags(roleFlags) {
    try {
      await users.save({ ...(await users.get(row._id)), ...roleFlags })
    } catch (error) {
      notifications.error("Error updating user")
    }
  }
</script>

<div on:click|stopPropagation>
  <Select
    {value}
    options={Constants.BbRoles}
    autoWidth
    quiet
    on:change={updateUserRole}
  />
</div>

<style>
</style>
