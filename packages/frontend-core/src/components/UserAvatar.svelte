<script>
  import { Avatar, Tooltip } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"

  export let user
  export let size
  export let tooltipDirection = "top"
  export let showTooltip = true

  $: tooltipStyle = getTooltipStyle(tooltipDirection)

  const getTooltipStyle = direction => {
    if (!direction) {
      return ""
    }
    if (direction === "top") {
      return "transform: translateX(-50%) translateY(-100%);"
    } else if (direction === "bottom") {
      return "transform: translateX(-50%) translateY(100%);"
    }
  }
</script>

{#if user}
  <div class="user-avatar">
    <Avatar
      {size}
      initials={helpers.getUserInitials(user)}
      color={helpers.getUserColor(user)}
    />
    {#if showTooltip}
      <div class="tooltip" style={tooltipStyle}>
        <Tooltip
          direction={tooltipDirection}
          textWrapping
          text={helpers.getUserLabel(user)}
          size="S"
        />
      </div>
    {/if}
  </div>
{/if}

<style>
  .user-avatar {
    position: relative;
  }
  .tooltip {
    position: absolute;
    top: 0;
    left: 50%;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 130ms ease-out;
  }
  .user-avatar:hover .tooltip {
    opacity: 1;
  }
</style>
