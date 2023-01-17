<script>
  import { createEventDispatcher, getContext, onMount } from "svelte"
  import FancyField from "./FancyField.svelte"
  import Checkbox from "../Form/Core/Checkbox.svelte"

  export let value
  export let text
  export let disabled = false
  export let error = null
  export let validate = null

  const dispatch = createEventDispatcher()
  const formContext = getContext("fancy-form")
  const id = Math.random()

  const onChange = () => {
    const newValue = !value
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

<FancyField {error} {disabled} clickable on:click={onChange}>
  <span>
    <Checkbox {disabled} {value} />
  </span>
  {#if text}
    {text}
  {/if}
  <div>
    <slot />
  </div>
</FancyField>

<style>
  span {
    pointer-events: none;
  }
</style>
