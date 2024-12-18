<script>
  import { roles } from "@/stores/builder"

  export let value

  $: role = $roles.find(role => role._id === value)
  $: roleName = role?.name ?? "Unknown role"
</script>

{roleName}
