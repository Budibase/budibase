<script>
  import { Select } from "@budibase/bbui"
  import { builderStore, componentStore } from "stores"

  export let prop
  export let options
  export let label

  $: currentValue = $componentStore.selectedComponent?.[prop]
</script>

<div>
  <Select
    quiet
    autoWidth
    placeholder={label}
    {options}
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
