<script lang="ts">
  import { Avatar, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"

  export let user: helpers.UserDisplayInfo | undefined
  export let size: "XS" | "S" | "M" = "S"
  export let tooltipPosition: TooltipPosition = TooltipPosition.Top
  export let showTooltip: boolean = true
</script>

{#if user}
  <AbsTooltip
    text={showTooltip ? helpers.getUserLabel(user) : ""}
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
