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
  import "@spectrum-css/textfield/dist/index-vars.css"
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
  let isFocused = $state(false)

  $effect(() => {
    if (disableClearing && !value) {
      value = FALLBACK_TIME
      onchange?.(value)
    }
  })
</script>

<Field {id} {helpText} {label} {labelPosition} {error} {required}>
  <div
    class="time-field spectrum-Textfield"
    class:is-disabled={disabled}
    class:is-readonly={readonly}
    class:is-invalid={!!error}
    class:is-focused={isFocused}
    aria-disabled={disabled}
    onfocusin={() => {
      isFocused = true
    }}
    onfocusout={() => {
      isFocused = false
    }}
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
    align-items: center;
    min-width: 104px;
    width: fit-content;
    --spectrum-textfield-padding-bottom: var(--spectrum-textfield-padding-top);
  }

  .time-field.is-disabled,
  .time-field.is-readonly {
    opacity: 0.5;
    pointer-events: none;
  }

  .time-field :global(.time-picker) {
    width: 100%;
  }

  .time-field :global(input[type="time"]) {
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border: var(--spectrum-textfield-border-size) solid
      var(
        --spectrum-textfield-m-border-color,
        var(--spectrum-alias-border-color)
      );
    border-radius: var(--spectrum-textfield-border-radius);
    box-sizing: border-box !important;
    color: var(
      --spectrum-textfield-m-text-color,
      var(--spectrum-alias-text-color)
    );
    font-family: var(--font-sans);
    font-size: var(--spectrum-textfield-text-size);
    font-weight: var(--spectrum-regular-font-weight);
    height: var(--spectrum-textfield-height);
    line-height: var(--spectrum-textfield-text-line-height);
    margin: 0;
    min-width: 72px;
    outline: none;
    padding: var(--spectrum-textfield-padding-top)
      calc(var(--spectrum-textfield-padding-x) + var(--spacing-xs))
      var(--spectrum-textfield-padding-bottom) !important;
    text-indent: var(--spacing-xs);
    width: 100%;
  }

  .time-field :global(input[type="time"]:hover),
  .time-field :global(input[type="time"]:focus) {
    background-color: var(
      --spectrum-textfield-m-background-color-hover,
      var(--spectrum-global-color-gray-50)
    );
    border-color: var(
      --spectrum-textfield-m-border-color-hover,
      var(--spectrum-alias-border-color-hover)
    );
  }

  .time-field :global(input[type="time"]:focus) {
    border-color: var(
      --spectrum-textfield-m-border-color-down,
      var(--spectrum-alias-border-color-mouse-focus)
    );
  }

  .time-field.is-invalid :global(input[type="time"]) {
    border-color: var(
      --spectrum-textfield-m-border-color-error,
      var(--spectrum-semantic-negative-color-default)
    );
  }
</style>
