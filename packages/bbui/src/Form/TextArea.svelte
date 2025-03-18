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
  export let height: number | undefined = undefined
  export let minHeight: number | undefined = undefined
  export let helpText: string | undefined = undefined

  let textarea: TextArea
  export function focus() {
    textarea.focus()
  }

  export function contents() {
    return textarea.contents()
  }

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent<string>) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <TextArea
    bind:this={textarea}
    {disabled}
    {value}
    {placeholder}
    {height}
    {minHeight}
    on:change={onChange}
    on:keypress
  />
</Field>
