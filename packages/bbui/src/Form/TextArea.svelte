<script lang="ts">
  import Field from "./Field.svelte"
  import TextArea from "./Core/TextArea.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition = "above"
  export let placeholder: string | undefined = undefined
  export let disabled = false
  export let error: string | undefined = undefined
  export let getCaretPosition:
    | (() => { start: number; end: number })
    | undefined = undefined
  export let height: number | string | undefined = undefined
  export let minHeight: number | string | undefined = undefined
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange = (e: { detail: string }) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <TextArea
    bind:getCaretPosition
    {disabled}
    {value}
    {placeholder}
    {height}
    {minHeight}
    on:change={onChange}
  />
</Field>
