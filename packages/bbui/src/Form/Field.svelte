<script lang="ts">
  import "@spectrum-css/fieldlabel/dist/index-vars.css"
  import FieldLabel from "./FieldLabel.svelte"
  import Icon from "../Icon/Icon.svelte"
  import type { LabelPosition } from "../types"

  export let id: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition: LabelPosition = "above"
  export let error: string | undefined | false = undefined
  export let helpText: string | undefined = undefined
  export let tooltip: string | undefined = undefined
</script>

<div class="spectrum-Form-item" class:above={labelPosition === "above"}>
  {#if label}
    <FieldLabel forId={id} {label} position={labelPosition} {tooltip} />
  {/if}
  <div class="spectrum-Form-itemField">
    <slot />
    {#if error}
      <div class="error">{error}</div>
    {:else if helpText}
      <div class="helpText">
        <Icon name="question" /> <span>{helpText}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .spectrum-Form-item.above {
    display: flex;
    flex-direction: column;
  }
  .spectrum-Form-itemField {
    position: relative;
    width: 100%;
  }

  .error {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
    font-size: var(--spectrum-global-dimension-font-size-75);
    margin-top: var(--spectrum-global-dimension-size-75);
  }

  .helpText {
    display: flex;
    margin-top: var(--spectrum-global-dimension-size-75);
    align-items: center;
  }
  .helpText :global(svg) {
    width: 13px;
    color: var(--spectrum-global-color-gray-600);
    margin-right: 6px;
  }
  .helpText span {
    color: var(--spectrum-global-color-gray-800);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }
</style>
