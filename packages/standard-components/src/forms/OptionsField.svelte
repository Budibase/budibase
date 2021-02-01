<script>
  import "@spectrum-css/picker/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import SpectrumField from "./SpectrumField.svelte"
  import Picker from "./Picker.svelte"

  export let field
  export let label
  export let placeholder

  let fieldState
  let fieldApi
  let fieldSchema

  // Picker state
  let open = false
  $: options = fieldSchema?.constraints?.inclusion ?? []
  $: placeholderText = placeholder || "Choose an option"
  $: isNull = $fieldState?.value == null || $fieldState?.value === ""
  $: fieldText = isNull ? placeholderText : $fieldState?.value

  const selectOption = value => {
    fieldApi.setValue(value)
    open = false
  }
</script>

<SpectrumField {field} {label} bind:fieldState bind:fieldApi bind:fieldSchema>
  {#if fieldState}
    <Picker
      bind:open
      {fieldState}
      {fieldText}
      {options}
      isPlaceholder={isNull}
      placeholderOption={placeholderText}
      isOptionSelected={option => option === $fieldState.value}
      onSelectOption={selectOption} />
  {/if}
</SpectrumField>
