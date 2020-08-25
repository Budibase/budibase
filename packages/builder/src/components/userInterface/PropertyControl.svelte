<script>
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import { DropdownMenu } from "@budibase/bbui"
  import BindingDropdown from "components/userInterface/BindingDropdown.svelte"
  import { onMount, getContext } from "svelte"

  export let label = ""
  export let control = null
  export let key = ""
  export let value
  export let props = {}
  export let onChange = () => {}

  let bindableProperties

  let anchor
  let dropdown

  $: console.log()

  async function getBindableProperties() {
    // Get all bindableProperties
    bindableProperties = fetchBindableProperties({
      componentInstanceId: $store.currentComponentInfo._id,
      components: $store.components,
      screen: $store.currentPreviewItem,
      models: $backendUiStore.models,
    })
  }

  async function replaceBindings(val) {
    getBindableProperties()
    // Find all instances of mustasche
    const boundValues = val.match(/{{([^}]+)}}/g)

    // Replace with names:
    boundValues &&
      boundValues.forEach(v => {
        const binding = bindableProperties.find(({ readableBinding }) => {
          return v === `{{ ${readableBinding} }}`
        })
        if (binding) {
          val = val.replace(v, `{{ ${binding.runtimeBinding} }}`)
        }
      })
    onChange(key, val)
  }

  function handleChange(key, v) {
    let innerVal = v
    if (typeof v === "object") {
      if ("detail" in v) {
        innerVal = v.detail
      } else if ("target" in v) {
        innerVal = props.valueKey ? v.target[props.valueKey] : v.target.value
      }
    }
    replaceBindings(innerVal)
  }

  const safeValue = () => {
    getBindableProperties()
    let temp = value
    const boundValues = (value && value.match(/{{([^}]+)}}/g)) || []
    console.log(boundValues)

    // Replace with names:
    boundValues.forEach(v => {
      const { readableBinding } = bindableProperties.find(
        ({ runtimeBinding }) => {
          return v === `{{ ${runtimeBinding} }}`
        }
      )
      if (readableBinding) {
        temp = temp.replace(v, `{{ ${readableBinding} }}`)
      }
    })
    // console.log(temp)
    return value === undefined && props.defaultValue !== undefined
      ? props.defaultValue
      : temp
  }

  //Incase the component has a different value key name
  const handlevalueKey = value =>
    props.valueKey ? { [props.valueKey]: safeValue() } : { value: safeValue() }
</script>

<div class="property-control" bind:this={anchor}>
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
  <button on:click={dropdown.show}>O</button>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="right">
  <BindingDropdown
    {...handlevalueKey(value)}
    on:update={e => handleChange(key, e.detail)}
    {bindableProperties} />
</DropdownMenu>

<style>
  .property-control {
    position: relative;
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
  button {
    position: absolute;
    background: none;
    border: none;
    right: 0px;
    top: 0;
    bottom: 0;
  }
</style>
