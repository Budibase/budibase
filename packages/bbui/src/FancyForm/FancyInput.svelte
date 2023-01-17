<script>
  import { createEventDispatcher, getContext, onMount } from "svelte"
  import FancyField from "./FancyField.svelte"

  export let label
  export let value
  export let type = "text"
  export let disabled = false
  export let error = null
  export let validate = null

  const dispatch = createEventDispatcher()
  const formContext = getContext("fancy-form")
  const id = Math.random()

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

  const API = {
    validate: () => {
      if (validate) {
        error = validate(value)
      } else {
        error = null
      }
      return !error
    },
  }

  onMount(() => {
    if (formContext) {
      formContext.registerField(id, API)
    }
    return () => {
      if (formContext) {
        formContext.unregisterField(id)
      }
    }
  })
</script>

<FancyField {error} {disabled} {focused}>
  {#if label}
    <div class="label" class:placeholder>
      {label}
    </div>
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
  .label {
    font-size: 14px;
    font-weight: 500;
    transform: translateY(-12px);
    position: absolute;
    color: var(--spectrum-global-color-gray-600);
    transition: font-size 130ms ease-out, transform 130ms ease-out;
  }
  .label.placeholder {
    font-size: 15px;
    transform: translateY(0);
  }
  input {
    z-index: 1;
    background: transparent;
    font-size: 15px;
    color: var(--spectrum-global-color-gray-900);
    outline: none;
    border: none;
    transition: transform 130ms ease-out;
    width: 100%;
    transform: translateY(9px);
  }
  input.placeholder {
    transform: translateY(0);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
</style>
