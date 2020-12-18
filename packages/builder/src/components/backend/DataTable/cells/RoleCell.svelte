<script>
  import { backendUiStore } from "builderStore"

  export let roleId

  $: role = $backendUiStore.roles.find(role => role._id === roleId)
  $: roleName = role?.name ?? "Unknown role"
</script>

<div>{roleName}</div>
