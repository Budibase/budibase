<script>
  import { onMount, getContext } from "svelte"

  export let label = ""
  export let control = null
  export let key = ""
  export let value
  export let props = {}
  export let onChange = () => {}

  function handleChange(key, v) {
    if (v.target) {
      let val = props.valueKey ? v.target[props.valueKey] : v.target.value
      onChange(key, val)
    }else if(v.detail) {
      onChange(key, v.detail)
    } else {
      onChange(key, v)
    }
  }

  const safeValue = () => {
    return value === undefined && props.defaultValue !== undefined
      ? props.defaultValue
      : value
  }

  //Incase the component has a different value key name
  const handlevalueKey = value =>
    props.valueKey ? { [props.valueKey]: safeValue() } : { value: safeValue() }
</script>

<div class="property-control">
  <div class="label">{label}</div>
  <div class="control">
    <svelte:component
      this={control}
      {...handlevalueKey(value)}
      on:change={val => handleChange(key, val)}
      onChange={val => handleChange(key, val)}
      {...props}
      name={key} />
  </div>
</div>

<style>
  .property-control {
    display: flex;
    flex-flow: row;
    margin: 8px 0px;
    align-items: center;
  }

  .label {
    flex: 0 0 50px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    text-align: left;
    color: var(--ink);
    margin-right: auto;
    text-transform: capitalize;
  }

  .control {
    flex: 1;
    display: flex;
    padding-left: 2px;
    max-width: 164px;
  }
</style>
