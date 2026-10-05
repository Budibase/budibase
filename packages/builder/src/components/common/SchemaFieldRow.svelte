<script lang="ts" generics="T extends string">
  import { Input, Select } from "@budibase/bbui"

  export interface Props<T extends string> {
    name: string
    type: T
    options: { label: string; value: T }[]
    placeholder?: string
    removeLabel?: string
    disabled?: boolean
    updateOnChange?: boolean
    onNameChange: (_name: string) => void
    onTypeChange: (_type: T) => void
    onRemove: () => void
  }

  let {
    name,
    type,
    options,
    placeholder = "Enter field name",
    removeLabel = "Remove field",
    disabled = false,
    updateOnChange = false,
    onNameChange,
    onTypeChange,
    onRemove,
  }: Props<T> = $props()
</script>

<div class="field">
  <Input
    value={name}
    {placeholder}
    {disabled}
    {updateOnChange}
    on:change={event => onNameChange(event.detail)}
  />
  <Select
    value={type}
    {options}
    {disabled}
    placeholder={false}
    on:change={event => onTypeChange(event.detail)}
  />
  <button
    type="button"
    class="remove-field"
    aria-label={removeLabel}
    title={removeLabel}
    {disabled}
    onclick={onRemove}
  >
    <i class="ri-delete-bin-line" aria-hidden="true"></i>
  </button>
</div>

<style>
  .field {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-m);
    min-width: 0;
  }

  .remove-field {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .remove-field:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .remove-field:disabled {
    cursor: default;
    opacity: 0.5;
  }
</style>
