<script>
  import "@spectrum-css/picker/dist/index-vars.css"
  import "@spectrum-css/popover/dist/index-vars.css"
  import "@spectrum-css/menu/dist/index-vars.css"
  import { getContext } from "svelte"
  import SpectrumField from "./SpectrumField.svelte"

  export let field
  export let label
  export let placeholder

  // Register this field with its form
  const { formApi } = getContext("form") ?? {}
  const formField = formApi?.registerField(field) ?? {}
  const { fieldApi, fieldState, fieldSchema } = formField

  // Picker state
  let open = false
  $: options = fieldSchema?.constraints?.inclusion ?? []
  $: placeholderText = placeholder || "Choose an option"
  $: isNull = $fieldState.value == null || $fieldState.value === ""

  // Update value on blur only
  const selectOption = value => {
    fieldApi.setValue(value)
    open = false
  }
</script>

<SpectrumField {field} {label}>
  <button
    id={$fieldState.fieldId}
    class="spectrum-Picker"
    class:is-invalid={!$fieldState.valid}
    class:is-open={open}
    aria-haspopup="listbox"
    on:click={() => (open = true)}>
    <span class="spectrum-Picker-label" class:is-placeholder={isNull}>
      {isNull ? placeholderText : $fieldState.value}
    </span>
    {#if !$fieldState.valid}
      <svg
        class="spectrum-Icon spectrum-Icon--sizeM spectrum-Picker-validationIcon"
        focusable="false"
        aria-hidden="true"
        aria-label="Folder">
        <use xlink:href="#spectrum-icon-18-Alert" />
      </svg>
    {/if}
    <svg
      class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon"
      focusable="false"
      aria-hidden="true">
      <use xlink:href="#spectrum-css-icon-Chevron100" />
    </svg>
  </button>
  <div
    class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover"
    class:is-open={open}>
    <ul class="spectrum-Menu" role="listbox">
      <li
        class="spectrum-Menu-item"
        class:is-selected={isNull}
        role="option"
        aria-selected="true"
        tabindex="0"
        on:click={() => selectOption(null)}>
        <span class="spectrum-Menu-itemLabel">{placeholderText}</span>
        <svg
          class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
          focusable="false"
          aria-hidden="true">
          <use xlink:href="#spectrum-css-icon-Checkmark100" />
        </svg>
      </li>
      {#each options as option}
        <li
          class="spectrum-Menu-item"
          class:is-selected={option === $fieldState.value}
          role="option"
          aria-selected="true"
          tabindex="0"
          on:click={() => selectOption(option)}>
          <span class="spectrum-Menu-itemLabel">{option}</span>
          <svg
            class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
            focusable="false"
            aria-hidden="true">
            <use xlink:href="#spectrum-css-icon-Checkmark100" />
          </svg>
        </li>
      {/each}
    </ul>
  </div>
</SpectrumField>
