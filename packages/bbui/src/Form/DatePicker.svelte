<script lang="ts" generics="V">
  import Field from "./Field.svelte"
  import DatePicker from "./Core/DatePicker/DatePicker.svelte"
  import { createEventDispatcher } from "svelte"
  import type { LabelPosition } from "../types"
  import { resolveTranslationGroup } from "@budibase/shared-core"

  export let value: V | null = null
  export let label = undefined
  export let labelPosition: LabelPosition = "above"
  export let disabled = false
  export let readonly = false
  export let error = undefined
  export let enableTime = true
  export let timeOnly = false
  export let placeholder: string | null = null
  export let appendTo = undefined
  export let ignoreTimezones = false
  export let helpText = undefined
  export let calendarLabels = resolveTranslationGroup("calendar")

  const dispatch = createEventDispatcher()

  const onChange = (e: CustomEvent) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <DatePicker
    {error}
    {disabled}
    {readonly}
    {value}
    {placeholder}
    {enableTime}
    {timeOnly}
    {appendTo}
    {ignoreTimezones}
    {calendarLabels}
    on:change={onChange}
  />
</Field>
