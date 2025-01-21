<script>
  import { Select } from "@budibase/bbui"
  import { builderStore } from "stores"

  export let prop
  export let options
  export let label
  export let component
  export let disabled = false

  $: currentValue = component?.[prop]
</script>

<div>
  <Select
    quiet
    autoWidth
    placeholder={label}
    {options}
    {disabled}
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
