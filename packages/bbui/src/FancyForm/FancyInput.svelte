<script>
  import { createEventDispatcher } from "svelte"
  import FancyField from "./FancyField.svelte"
  import FancyFieldLabel from "./FancyFieldLabel.svelte"

  export let label
  export let value
  export let type = "text"
  export let disabled = false
  export let error = null
  export let validate = null

  const dispatch = createEventDispatcher()

  let focused = false
  $: placeholder = !focused && !value

  const onChange = e => {
    const newValue = e.target.value
    dispatch("change", newValue)
    value = newValue
    if (validate) {
      error = validate(newValue)
    }
  }
</script>

<FancyField {error} {value} {validate} {disabled} {focused}>
  {#if label}
    <FancyFieldLabel {placeholder}>{label}</FancyFieldLabel>
  {/if}
  <input
    {disabled}
    value={value || ""}
    type={type || "text"}
    on:input={onChange}
    on:focus={() => (focused = true)}
    on:blur={() => (focused = false)}
    class:placeholder
  />
</FancyField>

<style>
  input {
    width: 100%;
    transition: transform 130ms ease-out;
    transform: translateY(9px);
    background: transparent;
    font-size: 15px;
    line-height: 17px;
    font-family: var(--font-sans);
    color: var(--spectrum-global-color-gray-900);
    outline: none;
    border: none;
  }
  input.placeholder {
    transform: translateY(0);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
</style>
