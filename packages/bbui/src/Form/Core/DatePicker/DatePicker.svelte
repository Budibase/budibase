<script>
  import "@spectrum-css/calendar/dist/index-vars.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/textfield/dist/index-vars.css"
  import Popover from "../../../Popover/Popover.svelte"
  import dayjs from "dayjs"
  import { createEventDispatcher, onMount } from "svelte"
  import TimePicker from "./TimePicker.svelte"
  import Calendar from "./Calendar.svelte"
  import DateInput from "./DateInput.svelte"
  import ActionButton from "../../../ActionButton/ActionButton.svelte"
  import { parseDate } from "../../../helpers"

  export let id = null
  export let disabled = false
  export let readonly = false
  export let error = null
  export let enableTime = true
  export let value = null
  export let placeholder = null
  export let timeOnly = false
  export let ignoreTimezones = false
  export let useKeyboardShortcuts = true
  export let appendTo = null
  export let api = null
  export let align = "left"

  const dispatch = createEventDispatcher()

  let isOpen = false
  let anchor
  let popover
  let calendar

  $: parsedValue = parseDate(value, { timeOnly, dateOnly: !enableTime })
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

  const handleChange = date => {
    if (!date) {
      dispatch("change", null)
      return
    }
    let newValue = date.toISOString()

    // Time only fields always ignore timezones, otherwise they make no sense.
    // For non-timezone-aware fields, create an ISO 8601 timestamp of the exact
    // time picked, without timezone
    const offsetForTimezone = (enableTime && ignoreTimezones) || timeOnly
    if (offsetForTimezone) {
      const offset = new Date().getTimezoneOffset() * 60000
      newValue = new Date(date.valueOf() - offset).toISOString().slice(0, -1)
    }

    // For date-only fields, construct a manual timestamp string without a time
    // or time zone
    else if (!enableTime) {
      const year = date.year()
      const month = `${date.month() + 1}`.padStart(2, "0")
      const day = `${date.date()}`.padStart(2, "0")
      newValue = `${year}-${month}-${day}T00:00:00.000`
    }

    dispatch("change", newValue)
  }

  const setToNow = () => {
    const now = dayjs()
    calendar?.setDate(now)
    handleChange(now)
  }

  onMount(() => {
    api = {
      open: () => popover?.show(),
      close: () => popover?.hide(),
    }
  })
</script>

<DateInput
  bind:anchor
  {disabled}
  {readonly}
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
  on:open
  on:close
  on:open={onOpen}
  on:close={onClose}
  portalTarget={appendTo}
  maxHeight={null}
  {anchor}
  {align}
>
  {#if isOpen}
    <div class="date-time-popover">
      {#if showCalendar}
        <Calendar
          value={parsedValue}
          onChange={handleChange}
          bind:this={calendar}
        />
      {/if}
      <div class="footer" class:spaced={showCalendar}>
        {#if showTime}
          <TimePicker value={parsedValue} onChange={handleChange} />
        {/if}
        <div class="actions">
          <ActionButton
            disabled={!value}
            size="S"
            on:click={() => handleChange(null)}
          >
            Clear
          </ActionButton>
          <ActionButton size="S" on:click={setToNow}>
            {showTime ? "Now" : "Today"}
          </ActionButton>
        </div>
      </div>
    </div>
  {/if}
</Popover>

<style>
  .date-time-popover {
    padding: 8px;
    overflow: hidden;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
  }
  .footer.spaced {
    padding-top: 14px;
  }
  .actions {
    padding: 4px 0;
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }
</style>
