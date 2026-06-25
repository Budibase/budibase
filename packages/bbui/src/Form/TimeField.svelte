<script lang="ts" module>
  import type { LabelPosition } from "../types"

  export type TimeFieldValue = string | null | undefined

  export interface Props {
    value?: TimeFieldValue
    label?: string
    labelPosition?: LabelPosition
    disabled?: boolean
    readonly?: boolean
    error?: string | undefined | false
    placeholder?: string | null
    helpText?: string
    required?: boolean
    id?: string
    name?: string
    disableClearing?: boolean
    onchange?: (value: string | undefined) => void
  }
</script>

<script lang="ts">
  import dayjs from "dayjs"
  import type { Dayjs } from "dayjs"
  import TimePicker from "./Core/DatePicker/TimePicker.svelte"
  import Field from "./Field.svelte"

  let {
    value = $bindable<TimeFieldValue>(undefined),
    label = undefined,
    labelPosition = "above",
    disabled = false,
    readonly = false,
    error = undefined,
    helpText = undefined,
    required = false,
    id = undefined,
    name = undefined,
    disableClearing = false,
    onchange,
  }: Props = $props()

  const FALLBACK_TIME = "00:00"

  const parseValue = (time: TimeFieldValue) => {
    if (!time) {
      return undefined
    }

    const [hour, minute] = time.split(":").map(part => Number(part))
    if (
      !Number.isInteger(hour) ||
      !Number.isInteger(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return undefined
    }

    return dayjs().hour(hour).minute(minute).second(0).millisecond(0)
  }

  const handleChange = (event: CustomEvent<Dayjs | undefined>) => {
    const nextValue = event.detail?.format("HH:mm")
    if (!nextValue && disableClearing) {
      return
    }
    value = nextValue
    onchange?.(nextValue)
  }

  const parsedValue = $derived(parseValue(value))

  $effect(() => {
    if (disableClearing && !value) {
      value = FALLBACK_TIME
      onchange?.(value)
    }
  })
</script>

<Field {id} {helpText} {label} {labelPosition} {error} {required}>
  <div
    class="time-field"
    class:is-disabled={disabled}
    class:is-readonly={readonly}
    aria-disabled={disabled}
  >
    <TimePicker
      value={parsedValue}
      {disableClearing}
      {disabled}
      {readonly}
      on:change={handleChange}
    />
    {#if name}
      <input type="hidden" {name} value={value ?? ""} {disabled} />
    {/if}
  </div>
</Field>

<style>
  .time-field {
    display: inline-flex;
    width: auto;
  }

  .time-field.is-disabled,
  .time-field.is-readonly {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
