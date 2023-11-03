<script>
  import Popover from "../../../Popover/Popover.svelte"
  import dayjs from "dayjs"
  import { createEventDispatcher } from "svelte"
  import TimePicker from "./TimePicker.svelte"
  import Calendar from "./Calendar.svelte"
  import DateTimeInput from "./DateTimeField.svelte"

  export let id = null
  export let disabled = false
  export let error = null
  export let enableTime = true
  export let value = null
  export let placeholder = null
  export let timeOnly = false
  export let ignoreTimezones = false
  export let useKeyboardShortcuts = true

  const dispatch = createEventDispatcher()

  let isOpen = false
  let anchor
  let popover

  $: parsedValue = parseValue(value)
  $: showCalendar = !timeOnly
  $: showTime = enableTime || timeOnly

  const clearDateOnBackspace = event => {
    // Ignore if we're typing a value
    if (document.activeElement?.tagName.toLowerCase() === "input") {
      return
    }
    if (["Backspace", "Clear", "Delete"].includes(event.key)) {
      handleChange(null)
      popover?.hide()
    }
  }

  const onOpen = () => {
    isOpen = true
    if (useKeyboardShortcuts) {
      document.addEventListener("keyup", clearDateOnBackspace)
    }
  }

  const onClose = () => {
    isOpen = false
    if (useKeyboardShortcuts) {
      document.removeEventListener("keyup", clearDateOnBackspace)
    }
  }

  const parseValue = value => {
    // Sanity check that we have a valid value
    const parsedDate = dayjs(value)
    if (!parsedDate?.isValid()) {
      return null
    }

    // By rounding to the nearest second we avoid locking up in an endless
    // loop in the builder, caused by potentially enriching {{ now }} to every
    // millisecond.
    return dayjs(Math.floor(parsedDate.valueOf() / 1000) * 1000)
  }

  const handleChange = date => {
    if (!date) {
      dispatch("change", null)
      return
    }
    let newValue = date.toISOString()

    // If time only set date component to 2000-01-01
    if (timeOnly) {
      newValue = `2000-01-01T${newValue.split("T")[1]}`
    }

    // For date-only fields, construct a manual timestamp string without a time
    // or time zone
    else if (!enableTime) {
      const year = date.year()
      const month = `${date.month() + 1}`.padStart(2, "0")
      const day = `${date.date()}`.padStart(2, "0")
      newValue = `${year}-${month}-${day}T00:00:00.000`
    }

    // For non-timezone-aware fields, create an ISO 8601 timestamp of the exact
    // time picked, without timezone
    else if (enableTime && ignoreTimezones) {
      const offset = new Date().getTimezoneOffset() * 60000
      newValue = new Date(date.valueOf() - offset).toISOString().slice(0, -1)
    }

    dispatch("change", newValue)
  }
</script>

<DateTimeInput
  bind:anchor
  {disabled}
  {error}
  {placeholder}
  {id}
  {enableTime}
  {timeOnly}
  focused={isOpen}
  value={parsedValue}
  on:click={popover?.show}
  icon={timeOnly ? "Clock" : "Calendar"}
/>

<Popover
  bind:this={popover}
  on:open={onOpen}
  on:close={onClose}
  {anchor}
  align="left"
>
  {#if isOpen}
    <div class="date-time-popover">
      {#if showCalendar}
        <Calendar value={parsedValue} onChange={handleChange} />
      {/if}
      {#if showCalendar && showTime}
        <hr />
      {/if}
      {#if showTime}
        <TimePicker value={parsedValue} onChange={handleChange} />
      {/if}
    </div>
  {/if}
</Popover>

<style>
  hr {
    margin: 4px 0 0 0;
    height: 0;
    border: none;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  /* Style inputs */
  .date-time-popover :global(.spectrum-Picker),
  .date-time-popover :global(input[type="number"]) {
    background: none;
    border: none;
    outline: none;
    color: var(--spectrum-alias-text-color);
    padding: 4px 6px;
    border-radius: 4px;
    transition: background 130ms ease-out;
    font-size: 18px;
    font-weight: bold;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  .date-time-popover :global(.spectrum-Picker:hover),
  .date-time-popover :global(.spectrum-Picker.is-open),
  .date-time-popover :global(input[type="number"]:hover) {
    background: var(--spectrum-global-color-gray-200);
  }
  .date-time-popover :global(.spectrum-Picker-label) {
    font-size: var(--spectrum-calendar-title-text-size);
    font-weight: bold;
    color: var(--spectrum-alias-text-color);
  }
</style>
