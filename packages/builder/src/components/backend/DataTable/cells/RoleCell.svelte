<script>
  import { roles } from "stores/backend"
  import { _ as t } from "svelte-i18n"

  export let value

  $: role = $roles.find(role => role._id === value)
  $: roleName = role?.name ?? $t("unknown-role")
</script>

{roleName}
