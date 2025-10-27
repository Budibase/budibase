<script lang="ts">
  import { Checkbox, Input, Select, TextArea, Toggle } from "@budibase/bbui"
  import type { ComponentPayload } from "@budibase/types"

  export let data: ComponentPayload

  const props = (data?.props as Record<string, unknown>) ?? {}

  const labelText =
    data.slot && typeof data.slot === "string" && data.slot.trim().length > 0
      ? data.slot
      : ((props.label as string | undefined) ?? "")

  const allowedPropMap: Record<string, Set<string>> = {
    Input: new Set([
      "placeholder",
      "disabled",
      "readonly",
      "type",
      "size",
      "icon",
      "helpText",
      "error",
    ]),
    TextArea: new Set([
      "placeholder",
      "disabled",
      "readonly",
      "rows",
      "resize",
      "helpText",
      "error",
    ]),
    Select: new Set([
      "placeholder",
      "disabled",
      "options",
      "clearable",
      "creatable",
      "searchable",
      "helpText",
      "error",
    ]),
    Checkbox: new Set(["disabled", "helpText", "error"]),
    Toggle: new Set(["disabled", "helpText", "error"]),
  }

  const pickProps = () => {
    const allowed = allowedPropMap[data.name]
    if (!allowed) {
      return {}
    }
    return Object.fromEntries(
      Object.entries(props).filter(([key]) => allowed.has(key))
    )
  }

  const fieldProps = pickProps()

  const initialValue =
    typeof props.value === "string" || typeof props.value === "number"
      ? props.value
      : ""
  const initialChecked =
    typeof props.checked === "boolean"
      ? props.checked
      : typeof props.value === "boolean"
        ? props.value
        : false

  const helpText = typeof props.helpText === "string" ? props.helpText : ""
  const errorText = typeof props.error === "string" ? props.error : ""
</script>

<div class="form-field">
  {#if labelText}
    <label class="form-field__label">{labelText}</label>
  {/if}

  {#if data.name === "Input"}
    <Input
      {...fieldProps}
      value={initialValue}
      readonly
      disabled={fieldProps.disabled ?? false}
    />
  {:else if data.name === "TextArea"}
    <TextArea
      {...fieldProps}
      value={initialValue}
      readonly
      disabled={fieldProps.disabled ?? false}
    />
  {:else if data.name === "Select"}
    <Select
      {...fieldProps}
      value={initialValue}
      disabled={fieldProps.disabled ?? false}
    />
  {:else if data.name === "Checkbox"}
    <Checkbox
      {...fieldProps}
      checked={initialChecked}
      disabled={fieldProps.disabled ?? false}
    />
  {:else if data.name === "Toggle"}
    <Toggle
      {...fieldProps}
      checked={initialChecked}
      disabled={fieldProps.disabled ?? false}
    />
  {:else}
    <p class="unsupported">Unsupported field: {data.name}</p>
  {/if}

  {#if helpText}
    <p class="form-field__help">{helpText}</p>
  {/if}
  {#if errorText}
    <p class="form-field__error">{errorText}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s, 8px);
  }

  .form-field__label {
    margin: 0;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-700);
  }

  .form-field__help {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .form-field__error {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-red-600);
  }

  .unsupported {
    margin: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-700);
  }
</style>
