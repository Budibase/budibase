<script>
  import { DropdownMenu } from "@budibase/bbui"
  import BindingDropdown from "components/userInterface/BindingDropdown.svelte"
  import { onMount, getContext } from "svelte"

  export let label = ""
  export let control = null
  export let key = ""
  export let value
  export let props = {}
  export let onChange = () => {}
  let anchor
  let dropdown

  function handleChange(key, v) {
    let innerVal = v
    if (typeof v === "object") {
      if ("detail" in v) {
        innerVal = v.detail
      } else if ("target" in v) {
        innerVal = props.valueKey ? v.target[props.valueKey] : v.target.value
      }
    }
    onChange(key, innerVal)
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
  <div data-cy={`${key}-prop-control`} class="control">
    <svelte:component
      this={control}
      {...handlevalueKey(value)}
      on:change={val => handleChange(key, val)}
      onChange={val => handleChange(key, val)}
      {...props}
      name={key} />
  </div>
  <div bind:this={anchor}>
    <button on:click={dropdown.show}>Dropdown</button>
  </div>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="right">
  <BindingDropdown />
</DropdownMenu>

<style>
  .property-control {
    display: flex;
    flex-flow: row;
    width: 260px;
    margin: 8px 0px;
    align-items: center;
  }

  .label {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    width: 100px;
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
