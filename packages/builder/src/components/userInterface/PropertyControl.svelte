<script>
  import { onMount, getContext } from "svelte"

  export let label = ""
  export let control = null
  export let key = ""
  export let value = ""
  export let valueType = ""
  export let props = {}
  export let onChange = () => {}

  function handleChange(key, v) {
    !!v.target
      ? onChange(name, key, valueType ? v.target[valueType] : v.target.value)
      : onChange(name, key, v)
  }

  const handleValueType = value =>
    valueType ? { [valueType]: value } : { value }
</script>

<div class="property-control">
  <div class="label">{label}</div>
  <div class="control">
    <svelte:component
      this={control}
      {...handleValueType(value)}
      on:change={val => handleChange(key, val)}
      onChange={val => handleChange(key, val)}
      {...props} />
  </div>
</div>

<style>
  .property-control {
    display: flex;
    flex-flow: row nowrap;
    margin: 8px 0px;
  }

  .label {
    flex: 0 0 50px;
    padding: 0px 5px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12px;
    text-align: left;
  }

  .control {
    flex: 1;
    padding-left: 5px;
  }
</style>
