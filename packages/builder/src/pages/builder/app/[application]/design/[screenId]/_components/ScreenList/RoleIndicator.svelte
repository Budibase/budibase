<script>
  import { RoleUtils } from "@budibase/frontend-core"
  import { Tooltip, StatusLight } from "@budibase/bbui"
  import { roles } from "stores/builder"
  import { Roles } from "constants/backend"

  export let disabled = false;
  export let hideTooltip = false;
  export let roleId
  $: console.log(roleId);

  let showTooltip = false

  $: color = RoleUtils.getRoleColour(roleId)
  $: role = $roles.find(role => role._id === roleId)
  $: tooltip =
    roleId === Roles.PUBLIC
      ? "Open to the public"
      : `Requires ${role?.name} access`
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class:disabled
  class="container"
  on:mouseover={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
  on:focus
  style="--color: {color};"
>
  <StatusLight square {color} />
  {#if !hideTooltip && showTooltip}
    <div class="tooltip">
      <Tooltip textWrapping text={tooltip} direction="right" />
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
    bottom: -5px;
    left: 13px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    pointer-events: none;
  }
  .tooltip :global(.spectrum-Tooltip) {
    background: var(--color);
    color: white;
    font-weight: 600;
    max-width: 200px;
  }
  .tooltip :global(.spectrum-Tooltip-tip) {
    border-top-color: var(--color);
  }

  .disabled {
    filter: grayscale(100%);
  }
</style>
