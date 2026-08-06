<script lang="ts">
  import { getContext } from "svelte"
  import { CoreDatePicker } from "@budibase/bbui"
  import {
    FieldType,
    type FieldSchema,
    type UIFieldValidationRule,
  } from "@budibase/types"
  import {
    resolveTranslationGroup,
    resolveWorkspaceTranslations,
  } from "@budibase/shared-core"
  import type { SDK } from "@/index"
  import type { FieldApi, FieldDefaultValue, FieldState } from "@/types"
  import Field from "./Field.svelte"

  type Weekday =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"

  export let field: string | undefined = undefined
  export let label: string | undefined = undefined
  export let placeholder: string | null = null
  export let disabled = false
  export let readonly = false
  export let enableTime = true
  export let timeOnly = false
  export let setTimeTo: string | undefined = undefined
  export let ignoreTimezones = false
  export let startDayOfWeek: Weekday = "Monday"
  export let validation: UIFieldValidationRule[] | undefined = undefined
  export let defaultValue: FieldDefaultValue = undefined
  export let onChange: ((args: { value: string | null }) => void) | undefined =
    undefined
  export let span = 6
  export let helpText: string | undefined = undefined
  export let valueAsTimestamp = false

  let fieldState: FieldState<string | null> | undefined
  let fieldApi: FieldApi | undefined
  let fieldSchema: FieldSchema | undefined
  const { appStore } = getContext<SDK>("sdk")

  $: translationOverrides = resolveWorkspaceTranslations(
    $appStore.application?.translationOverrides
  )
  $: calendarLabels = resolveTranslationGroup("calendar", translationOverrides)

  const handleChange = (e: CustomEvent<string | null>) => {
    let value = e.detail
    if (timeOnly && valueAsTimestamp) {
      if (!isValidDate(value)) {
        // Handle time only fields that are timestamps under the hood
        value = value ? timeToDateISOString(value) : null
      }
    }

    const changed = fieldApi?.setValue(value) ?? false
    if (onChange && changed) {
      onChange({ value })
    }
  }

  const isValidDate = (value: string | null) =>
    value !== null && !isNaN(new Date(value).valueOf())

  const timeToDateISOString = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number)

    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.toISOString()
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {readonly}
  {validation}
  {defaultValue}
  {span}
  {helpText}
  type={FieldType.DATETIME}
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  {#if fieldState}
    <CoreDatePicker
      value={fieldState.value}
      on:change={handleChange}
      disabled={fieldState.disabled}
      readonly={fieldState.readonly}
      error={fieldState.error}
      id={fieldState.fieldId}
      {enableTime}
      {timeOnly}
      {setTimeTo}
      {ignoreTimezones}
      {startDayOfWeek}
      {placeholder}
      {calendarLabels}
    />
  {/if}
</Field>
