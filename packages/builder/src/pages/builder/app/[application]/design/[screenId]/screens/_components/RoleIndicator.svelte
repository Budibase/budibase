<script>
  import { RoleUtils } from "@budibase/frontend-core"
  import { Tooltip, StatusLight } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { Roles } from "constants/backend"

  export let roleId

  let showTooltip = false

  $: color = RoleUtils.getRoleColour(roleId)
  $: role = $roles.find(role => role._id === roleId)
  $: tooltip =
    roleId === Roles.PUBLIC
      ? "This screen is open to the public"
      : `Requires at least ${role?.name} access`
</script>

<div
  class="container"
  on:mouseover={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
  style="--color: {color};"
>
  <StatusLight square {color} />
  {#if showTooltip}
    <div class="tooltip">
      <Tooltip textWrapping text={tooltip} direction="left" />
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
  }
  .tooltip {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: calc(50% - 8px);
    transform: translateX(-100%) translateY(-50%);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 130px;
    pointer-events: none;
  }
  .tooltip :global(.spectrum-Tooltip) {
    background: var(--color);
    color: white;
    font-weight: 600;
    max-width: 130px;
  }
  .tooltip :global(.spectrum-Tooltip-tip) {
    border-top-color: var(--color);
  }
</style>
