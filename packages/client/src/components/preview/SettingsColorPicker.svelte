<script>
  import { ColorPicker } from "@budibase/bbui"
  import { builderStore } from "stores"

  export let prop
  export let component
  export let disabled = false

  $: currentValue = component?.[prop]
</script>

<div class:disabled>
  <ColorPicker
    size="S"
    value={disabled ? null : currentValue}
    on:change={e => {
      if (prop) {
        builderStore.actions.updateProp(prop, e.detail)
      }
    }}
  />
</div>

<style>
  div {
    padding: 0 4px;
  }
  div.disabled {
    pointer-events: none;
  }
</style>
