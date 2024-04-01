<script>
  import { createEventDispatcher } from "svelte"
  import Multiselect from "./Core/Multiselect.svelte"
  import Field from "./Field.svelte"

  export let value = []
  export let label = null
  export let disabled = false
  export let readonly = false
  export let labelPosition = "above"
  export let error = null
  export let placeholder = null
  export let options = []
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let getOptionIcon = () => null
  export let getOptionIconTooltip = () => null
  export let getOptionTooltip = () => null
  export let isOptionEnabled = () => true
  export let sort = false
  export let autoWidth = false
  export let autocomplete = false
  export let searchTerm = null
  export let customPopoverHeight
  export let helpText = null
  export let align

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Multiselect
    {isOptionEnabled}
    {getOptionIcon}
    {getOptionIconTooltip}
  {getOptionTooltip}
    {error}
    {disabled}
    {readonly}
    {value}
    {options}
    {placeholder}
    {sort}
    {getOptionLabel}
    {getOptionValue}
    {autoWidth}
    {autocomplete}
    {customPopoverHeight}
    {align}
    bind:searchTerm
    on:change={onChange}
    on:click
  />
</Field>
