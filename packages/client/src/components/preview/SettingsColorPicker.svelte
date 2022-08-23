<script>
  import { ColorPicker } from "@budibase/bbui"
  import { builderStore, componentStore } from "stores"

  export let prop

  $: currentValue = $componentStore.selectedComponent?.[prop]
</script>

<div>
  <ColorPicker
    size="S"
    value={currentValue}
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
</style>
