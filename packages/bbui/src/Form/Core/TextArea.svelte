<script lang="ts">
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value: string | undefined = ""
  export let placeholder: string | undefined = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let id: string | undefined = undefined
  export let height: string | number | undefined = undefined
  export let minHeight: string | number | undefined = undefined
  export let align = null
  export let updateOnChange: boolean = false

  export const getCaretPosition = () => ({
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  })

  const dispatch = createEventDispatcher()

  let isFocused = false
  let textarea: HTMLTextAreaElement
  let scrollable = false

  $: heightString = getStyleString("height", height)
  $: minHeightString = getStyleString("min-height", minHeight)
  $: dispatch("scrollable", scrollable)

  export function focus() {
    textarea.focus()
  }

  export function contents() {
    return textarea.value
  }

  const onBlur = () => {
    isFocused = false
    updateValue()
  }

  const onChange = () => {
    scrollable = textarea.clientHeight < textarea.scrollHeight
    if (!updateOnChange) {
      return
    }
    updateValue()
  }

  const updateValue = () => {
    if (readonly || disabled) {
      return
    }
    dispatch("change", textarea.value)
  }

  const getStyleString = (
    attribute: string,
    value: string | number | undefined
  ) => {
    if (value == null) {
      return ""
    }
    if (typeof value !== "number" || isNaN(value)) {
      return `${attribute}:${value};`
    }
    return `${attribute}:${value}px;`
  }
</script>

<div
  style={`${heightString}${minHeightString}`}
  class="spectrum-Textfield spectrum-Textfield--multiline"
  class:is-disabled={disabled}
  class:is-focused={isFocused}
>
  <!-- We need to ignore prettier here as we want no whitespace -->
  <!-- prettier-ignore -->
  <textarea
    bind:this={textarea}
    placeholder={placeholder || ""}
    class="spectrum-Textfield-input"
    style={align ? `text-align: ${align}` : ""}
    {disabled}
    {readonly}
    {id}
    on:input={onChange}
    on:focus={() => (isFocused = true)}
    on:blur={onBlur}
    on:blur
    on:keypress
  >{value || ""}</textarea>
  <slot />
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }
  textarea {
    resize: vertical;
    min-height: 80px !important;
  }
</style>
