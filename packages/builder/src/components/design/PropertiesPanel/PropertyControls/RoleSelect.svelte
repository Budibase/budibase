<script>
  import { Select } from "@budibase/bbui"
  import { roles } from "stores/backend"

  export let value
</script>

<Select
  bind:value
  on:change
  options={$roles}
<<<<<<< HEAD
  getOptionLabel={(role) => role.name}
  getOptionValue={(role) => role._id}
=======
  getOptionLabel={role => role.name}
  getOptionValue={role => role._id}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
/>
