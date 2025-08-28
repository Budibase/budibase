<script lang="ts">
  import { StatusLight, AbsTooltip } from "@budibase/bbui"
  import { roles } from "@/stores/builder"
  import { Roles } from "@/constants/backend"

  export let roleId: string

  $: role = $roles.find(role => role._id === roleId)
  $: color =
    role?.uiMetadata?.color || "var(--spectrum-global-color-static-magenta-400)"
  $: tooltip =
    roleId === Roles.PUBLIC
      ? "Open to the public"
      : `Requires ${role?.uiMetadata?.displayName || "Unknown role"} access`
</script>

<AbsTooltip text={tooltip} {color}>
  <StatusLight square {color} />
</AbsTooltip>
