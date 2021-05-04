<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"
  import FieldLabel from "./FieldLabel.svelte"

  export let id = null
  export let label = null
  export let labelPosition = "above"
  export let disabled = false
  export let error = null
</script>

<div class="spectrum-Form-item" class:above={labelPosition === "above"}>
  {#if label}
    <FieldLabel forId={id} {label} position={labelPosition} />
  {/if}
  <div class="spectrum-Form-itemField">
    <slot />
    {#if error}
      <div class="error">{error}</div>
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
</style>
