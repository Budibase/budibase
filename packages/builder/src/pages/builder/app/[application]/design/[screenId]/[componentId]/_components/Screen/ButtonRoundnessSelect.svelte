<script>
  import { createEventDispatcher } from "svelte"
  import { Slider, Button } from "@budibase/bbui"

  export let customTheme

  const dispatch = createEventDispatcher()
  const options = ["0", "4px", "8px", "16px"]

  $: index = options.indexOf(customTheme.buttonBorderRadius) ?? 2

  const onChange = async e => {
    dispatch("change", options[e.detail])
  }
</script>

<div class="container">
  <Slider min={0} max={3} step={1} value={index} on:change={onChange} />
  <div class="button" style="--radius: {customTheme.buttonBorderRadius};">
    <Button primary>Button</Button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .container :global(.spectrum-Form-item) {
    flex: 1 1 auto;
  }
  .button :global(.spectrum-Button) {
    border-radius: var(--radius) !important;
  }
</style>
