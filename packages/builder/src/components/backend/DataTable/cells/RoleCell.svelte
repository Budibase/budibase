<script>
  import { roles } from 'builderStore/store/backend/'

  export let roleId

  $: role = $roles.find(role => role._id === roleId)
  $: roleName = role?.name ?? "Unknown role"
</script>

<div>{roleName}</div>
