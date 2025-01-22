<script lang="ts">
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = ""
  export let placeholder: string | undefined = undefined
  export let disabled = false
  export let readonly = false
  export let id: string | undefined = undefined
  export let height: number | string | undefined = undefined
  export let minHeight: number | string | undefined = undefined
  export const getCaretPosition = () => ({
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  })
  export let align = null

  let focus = false
  let textarea: HTMLTextAreaElement
  const dispatch = createEventDispatcher()
  const onChange = (event: FocusEvent) => {
    const target: HTMLTextAreaElement | null =
      event.target as HTMLTextAreaElement
    dispatch("change", target?.value)
    focus = false
  }

  const getStyleString = (
    attribute: string,
    value?: number | string
  ): string => {
    if (!attribute || value == null) {
      return ""
    }
    if (typeof value === "number" && isNaN(value)) {
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
  class:is-focused={focus}
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
