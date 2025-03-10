<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = ""
  export let placeholder = null
  export let disabled = false
  export let readonly = false
  export let id = null
  export let height = null
  export let minHeight = null
  export const getCaretPosition = () => ({
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  })
  export let align = null

  let isFocused = false
  let textarea
  const dispatch = createEventDispatcher()
  const onChange = event => {
    dispatch("change", event.target.value)
    isFocused = false
  }

  export function focus() {
    textarea.focus()
  }

  export function contents() {
    return textarea.value
  }

  const getStyleString = (attribute, value) => {
    if (!attribute || value == null) {
      return ""
    }
    if (isNaN(value)) {
      return `${attribute}:${value};`
    }
    return `${attribute}:${value}px;`
  }

  $: heightString = getStyleString("height", height)
  $: minHeightString = getStyleString("min-height", minHeight)
</script>

<div
  style={`${heightString}${minHeightString}`}
  class="spectrum-Textfield spectrum-Textfield--multiline"
  class:is-disabled={disabled}
  class:is-focused={isFocused}
>
  <!-- prettier-ignore -->
  <textarea
    bind:this={textarea}
    placeholder={placeholder || ""}
    class="spectrum-Textfield-input"
    style={align ? `text-align: ${align}` : ""}
    {disabled}
    {readonly}
    {id}
    on:focus={() => (isFocused = true)}
    on:blur={onChange}
    on:keypress
  >{value || ""}</textarea>
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
