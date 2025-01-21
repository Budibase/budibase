<script>
  import { Tooltip, StatusLight } from "@budibase/bbui"
  import { roles } from "@/stores/builder"
  import { Roles } from "@/constants/backend"

  export let roleId

  let showTooltip = false

  $: role = $roles.find(role => role._id === roleId)
  $: color =
    role?.uiMetadata.color || "var(--spectrum-global-color-static-magenta-400)"
  $: tooltip =
    roleId === Roles.PUBLIC
      ? "Open to the public"
      : `Requires ${role?.uiMetadata.displayName || "Unknown role"} access`
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="container"
  on:mouseover={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
  on:focus
  style="--color: {color};"
>
  <StatusLight square {color} />
  {#if showTooltip}
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
</style>
