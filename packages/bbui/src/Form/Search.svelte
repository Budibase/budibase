<script lang="ts">
  import Field from "./Field.svelte"
  import Search from "./Core/Search.svelte"
  import { createEventDispatcher } from "svelte"
  import type { LabelPosition } from "../types"

  export let value: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition: LabelPosition = "above"
  export let placeholder: string | undefined = undefined
  export let disabled = false
  export let updateOnChange = true
  export let quiet = false
  export let inputRef: HTMLInputElement | undefined = undefined
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent<string>) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition}>
  <Search
    {updateOnChange}
    {disabled}
    {value}
    {placeholder}
    {quiet}
    bind:inputRef
    on:change={onChange}
    on:click
    on:input
    on:focus
    on:blur
  />
</Field>
