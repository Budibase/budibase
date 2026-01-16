<script lang="ts">
  import Field from "./Field.svelte"
  import { CoreSlider, Icon } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import type { FieldSchema, UIFieldValidationRule } from "@budibase/types"
  import type { FieldApi, FieldState } from "@/types"

  export let field: string
  export let label: string
  export let min = 0
  export let max = 100
  export let step = 1
  export let value: number | undefined = undefined
  export let disabled = false
  export let readonly = false
  export let validation: UIFieldValidationRule[] | undefined
  export let onChange: ((_event: { value: number }) => void) | undefined
  export let span = 6
  export let helpText: string | undefined = undefined
  export let iconLeft: string | undefined
  export let iconRight: string | undefined
  export let iconLeftSize:
    | "XXS"
    | "XS"
    | "S"
    | "M"
    | "L"
    | "XL"
    | "XXL"
    | "XXXL" = "M"
  export let iconRightSize:
    | "XXS"
    | "XS"
    | "S"
    | "M"
    | "L"
    | "XL"
    | "XXL"
    | "XXXL" = "M"

  let fieldState: FieldState<number>
  let fieldApi: FieldApi
  let fieldSchema: FieldSchema
  let lowerBound = min
  let upperBound = max

  $: {
    lowerBound = Math.min(min, max)
    upperBound = Math.max(min, max)
  }

  const parseValue = (input: unknown): number => {
    if (typeof input === "number" && !Number.isNaN(input)) {
      return input
    }
    if (typeof input === "string") {
      const parsed = Number(input)
      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }
    return lowerBound
  }

  const clampValue = (val: number) => {
    if (val < lowerBound) {
      return lowerBound
    }
    if (val > upperBound) {
      return upperBound
    }
    return val
  }

  $: defaultValue = clampValue(value != null ? parseValue(value) : min)

  $: sliderValue = fieldState
    ? clampValue(parseValue(fieldState.value ?? defaultValue))
    : defaultValue

  $: isDisabled = Boolean(fieldState?.disabled || fieldState?.readonly)

  const handleChange = (event: CustomEvent<string | number>) => {
    const nextValue = clampValue(parseValue(event.detail))
    const changed = fieldApi?.setValue(nextValue)
    if (onChange && changed) {
      onChange({ value: nextValue })
    }
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {readonly}
  {validation}
  {span}
  {helpText}
  type={FieldType.NUMBER}
  {defaultValue}
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  <div class="field">
    {#if iconLeft}
      <Icon name={iconLeft} size={iconLeftSize}></Icon>
    {/if}
    {#if fieldState}
      <div class="slider">
        <CoreSlider
          min={lowerBound}
          max={upperBound}
          {step}
          value={sliderValue}
          disabled={isDisabled}
          id={fieldState.fieldId}
          on:change={handleChange}
        />
      </div>
    {/if}
    {#if iconRight}
      <Icon name={iconRight} size={iconRightSize}></Icon>
    {/if}
  </div>
</Field>

<style>
  .field {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .slider {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 10px;
  }
</style>
