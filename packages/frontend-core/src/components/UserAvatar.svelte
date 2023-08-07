<script>
  import { Avatar, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"

  export let user
  export let size = "S"
  export let tooltipPosition = TooltipPosition.Top
  export let showTooltip = true
</script>

{#if user}
  <AbsTooltip
    text={showTooltip ? helpers.getUserLabel(user) : null}
    position={tooltipPosition}
    color={helpers.getUserColor(user)}
  >
    <Avatar
      {size}
      initials={helpers.getUserInitials(user)}
      color={helpers.getUserColor(user)}
    />
  </AbsTooltip>
{/if}
