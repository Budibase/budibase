<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = ""
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let id = null
  export let height = null
  export let minHeight = null
  export const getCaretPosition = () => ({
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  })
  export let align = null

  let focus = false
  let textarea
  const dispatch = createEventDispatcher()
  const onChange = event => {
    dispatch("change", event.target.value)
    focus = false
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
  class:is-invalid={!!error}
  class:is-disabled={disabled}
  class:is-focused={focus}
>
  {#if error}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM
      spectrum-Textfield-validationIcon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-icon-18-Alert" />
    </svg>
  {/if}
  <!-- prettier-ignore -->
  <textarea
    bind:this={textarea}
    placeholder={placeholder || ""}
    class="spectrum-Textfield-input"
    style={align ? `text-align: ${align}` : ""}
    {disabled}
    {id}
    on:focus={() => (focus = true)}
    on:blur={onChange}
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
