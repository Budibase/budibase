<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { CoreRichTextField, CoreTextArea } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder
  export let disabled = false
  export let readonly = false
  export let validation
  export let defaultValue = ""
  export let format = "auto"
  export let onChange
  export let helpText = null

  let fieldState
  let fieldApi
  let fieldSchema

  const context = getContext("context")
  const component = getContext("component")
  const layout = getContext("layout")
  const newContext = writable($component)
  setContext("component", newContext)

  // Determine whether we should use a rich or plain text component.
  // We treat undefined as "auto".
  $: useRichText =
    format === "rich" || (format !== "plain" && fieldSchema?.useRichText)

  // Extract the settings height so we can pass it on to the rich text field.
  // We then wipe the height style so that the field will automatically size
  // itself based on the height of the rich text field.
  let height
  $: {
    height = $component.styles?.normal?.height || "150px"
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

  const handleChange = e => {
    const changed = fieldApi.setValue(e.detail)
    if (onChange && changed) {
      onChange({ value: e.detail })
    }
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {readonly}
  {validation}
  {defaultValue}
  {helpText}
  type="longform"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    {#if useRichText}
      <CoreRichTextField
        value={fieldState.value}
        on:change={handleChange}
        disabled={fieldState.disabled}
        readonly={fieldState.readonly}
        error={fieldState.error}
        id={fieldState.fieldId}
        {placeholder}
        {height}
        fullScreenOffset={{
          x: $layout.screenXOffset,
          y: $layout.screenYOffset,
        }}
        easyMDEOptions={{
          hideIcons: $context.device.mobile ? ["side-by-side", "guide"] : [],
        }}
      />
    {:else}
      <CoreTextArea
        value={fieldState.value}
        on:change={handleChange}
        disabled={fieldState.disabled}
        readonly={fieldState.readonly}
        error={fieldState.error}
        id={fieldState.fieldId}
        {placeholder}
        minHeight={height}
      />
    {/if}
  {/if}
</Field>
