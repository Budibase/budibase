<script>
  import { ColorPicker } from "@budibase/bbui"
  import { builderStore } from "../../store"

  export let prop

  $: currentValue = $builderStore.selectedComponent?.[prop]
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
