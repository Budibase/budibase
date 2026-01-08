<script lang="ts">
  import Field from "./Field.svelte"
  import { CoreSlider } from "@budibase/bbui"
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

  $: defaultValue = clampValue(
    value != null ? parseValue(value) : min
  )

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
  defaultValue={defaultValue}
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    <CoreSlider
      min={lowerBound}
      max={upperBound}
      step={step}
      value={sliderValue}
      disabled={isDisabled}
      id={fieldState.fieldId}
      on:change={handleChange}
    />
  {/if}
</Field>
