<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import Icon from "../Icon/Icon.svelte"

  export let size = "M"
  export let tooltip = ""
  export let showTooltip = false
</script>

{#if tooltip}
  <div class="container">
    <label
      for=""
      class={`spectrum-FieldLabel spectrum-FieldLabel--size${size}`}
    >
      <slot />
    </label>
    <div class="icon-container">
      <div
        class="icon"
        on:mouseover={() => (showTooltip = true)}
        on:mouseleave={() => (showTooltip = false)}
      >
        <Icon name="InfoOutline" size="S" disabled={true} />
      </div>
      {#if showTooltip}
        <div class="tooltip">
          <Tooltip textWrapping={true} direction={"bottom"} text={tooltip} />
        </div>
      {/if}
    </div>
  </div>
{:else}
  <label for="" class={`spectrum-FieldLabel spectrum-FieldLabel--size${size}`}>
    <slot />
  </label>
{/if}

<style>
  label {
    padding: 0;
    white-space: nowrap;
  }
  .container {
    display: flex;
  }
  .icon-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 1px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .tooltip {
    position: absolute;
    display: flex;
    justify-content: center;
    top: 15px;
    z-index: 1;
    width: 160px;
  }
  .icon {
    transform: scale(0.75);
  }
</style>
