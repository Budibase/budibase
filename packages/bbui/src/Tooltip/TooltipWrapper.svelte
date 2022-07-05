<script>
  import Tooltip from "./Tooltip.svelte"
  import Icon from "../Icon/Icon.svelte"

  export let tooltip = ""
  export let size = "M"

  let showTooltip = false
</script>

<div class:container={!!tooltip}>
  <slot />
  {#if tooltip}
    <div class="icon-container">
      <div
        class="icon"
        class:icon-small={size === "M" || size === "S"}
        on:mouseover={() => (showTooltip = true)}
        on:mouseleave={() => (showTooltip = false)}
        on:focus
      >
        <Icon name="InfoOutline" size="S" disabled={true} />
      </div>
      {#if showTooltip}
        <div class="tooltip">
          <Tooltip textWrapping={true} direction={"bottom"} text={tooltip} />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
  }
  .icon-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-left: 5px;
    margin-right: 5px;
  }
  .tooltip {
    position: absolute;
    display: flex;
    justify-content: center;
    top: 15px;
    z-index: 100;
    width: 160px;
  }
  .icon {
    transform: scale(0.75);
  }
  .icon-small {
    margin-top: -2px;
    margin-bottom: -5px;
  }
</style>
