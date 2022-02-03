<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { CoreRichTextField } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let validation
  export let defaultValue = ""

  let fieldState
  let fieldApi

  const component = getContext("component")
  const newContext = writable($component)
  setContext("component", newContext)

  // Extract the settings height so we can pass it on to the rich text field.
  // We then wipe the height style so that the field will automatically size
  // itself based on the height of the rich text field.
  let height
  $: {
    height = $component.styles?.normal?.height
    newContext.set({
      ...$component,
      styles: {
        ...$component.styles,
        normal: {
          ...$component.styles.normal,
          height: undefined,
        },
      },
    })
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  {defaultValue}
  type="longform"
  bind:fieldState
  bind:fieldApi
>
  {#if fieldState}
    <CoreRichTextField
      value={fieldState.value}
      on:change={e => fieldApi.setValue(e.detail)}
      disabled={fieldState.disabled}
      error={fieldState.error}
      id={fieldState.fieldId}
      {placeholder}
      {height}
    />
  {/if}
</Field>
