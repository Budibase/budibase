<script>
  import { roles } from 'stores/backend/'

  export let roleId

  $: role = $roles.find(role => role._id === roleId)
  $: roleName = role?.name ?? "Unknown role"
</script>

<div>{roleName}</div>
