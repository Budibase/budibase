<script>
  import Icon from "../Icon/Icon.svelte"
  import AbsTooltip from "./AbsTooltip.svelte"

  export let tooltip = ""
  export let size = "M"
  export let disabled = true
</script>

<div class:container={!!tooltip}>
  <slot />
  {#if tooltip}
    <div class="icon-container">
      <AbsTooltip text={tooltip}>
        <div
          class="icon"
          class:icon-small={size === "M" || size === "S"}
          on:focus
        >
          <Icon name="InfoOutline" size="S" {disabled} hoverable />
        </div>
      </AbsTooltip>
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
  .icon {
    transform: scale(0.75);
  }
  .icon-small {
    margin-bottom: -2px;
  }
</style>
