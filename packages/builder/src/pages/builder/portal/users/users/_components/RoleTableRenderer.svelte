<script>
  import { ExtendedBudibaseRoleOptions } from "@/constants"
  import { users } from "@/stores/portal"

  export let row

  $: role = ExtendedBudibaseRoleOptions.find(
    x => x.value === users.getUserRole(row)
  )
  $: value = role?.label || "Not available"
  $: tooltip = role?.subtitle || ""
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation title={tooltip}>
  {value}
</div>
