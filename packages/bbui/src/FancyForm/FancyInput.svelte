<script lang="ts">
  import type { UIEvent } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"
  import { fade } from "svelte/transition"
  import FancyField from "./FancyField.svelte"
  import FancyFieldLabel from "./FancyFieldLabel.svelte"

  export let label: string
  export let value: string
  export let type: string = "text"
  export let disabled: boolean = false
  export let error: string | null = null
  export let validate: ((_value: string | undefined) => string | null) | null =
    null
  export let suffix: string | null = null
  export let validateOn: "change" | "blur" = "change"

  const dispatch = createEventDispatcher()

  let ref: HTMLInputElement
  let focused = false
  let autofilled = false

  $: placeholder = !autofilled && !focused && !value

  const onChange = (e: UIEvent) => {
    const newValue = e.target.value
    dispatch("change", newValue)
    value = newValue
    if (validate && (error || validateOn === "change")) {
      error = validate(newValue)
    }
  }

  const onBlur = (e: UIEvent) => {
    focused = false
    const newValue = e.target.value
    dispatch("blur", newValue)
    if (validate && validateOn === "blur") {
      error = validate(newValue)
    }
  }

  onMount(() => {
    // Start watching for autofill every 100ms
    const interval = setInterval(() => {
      autofilled = ref?.matches(":-webkit-autofill")
      if (autofilled) {
        clearInterval(interval)
      }
    }, 100)

    // Give up after 2 seconds and assume autofill has not been used
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 2000)

    // Cleanup
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  })
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
    on:blur={onBlur}
    class:placeholder
    bind:this={ref}
  />
  {#if suffix && !placeholder}
    <div in:fade|local={{ duration: 130 }} class="suffix">{suffix}</div>
  {/if}
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
    padding: 0;
    margin: 0;
  }
  input.placeholder {
    transform: translateY(0);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
  .suffix {
    color: var(--spectrum-global-color-gray-600);
    transform: translateY(9px);
    font-size: 15px;
    line-height: 17px;
    font-family: var(--font-sans);
  }
  input:-webkit-autofill {
    border-radius: 2px;
    -webkit-box-shadow: 0 0 0 100px var(--spectrum-global-color-gray-300) inset;
    -webkit-text-fill-color: var(--spectrum-global-color-gray-900);
    transition:
      -webkit-box-shadow 130ms 200ms,
      background-color 0s 86400s;
    padding: 3px 8px 4px 8px;
  }
</style>
