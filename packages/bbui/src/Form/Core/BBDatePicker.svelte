<script>
  import "@spectrum-css/calendar/dist/index-vars.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/textfield/dist/index-vars.css"
  import "@spectrum-css/picker/dist/index-vars.css"
  import Popover from "../../Popover/Popover.svelte"
  import dayjs from "dayjs"
  import { createEventDispatcher } from "svelte"

  export let id = null
  export let disabled = false
  export let error = null
  export let enableTime = true
  export let value = null
  export let placeholder = null
  export let appendTo = undefined
  export let ignoreTimezones = false
  export let time24hr = false
  export let range = false
  export let flatpickr
  export let useKeyboardShortcuts = true

  const dispatch = createEventDispatcher()
  const DaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  let isOpen = false
  let anchor
  let calendar
  let today = dayjs()
  let activeMonth

  $: parsedValue = parseValue(value)
  $: displayValue = getDisplayValue(parsedValue)
  $: activeMonth = dayjs(parsedValue || today).startOf("month")
  $: mondays = getMondays(activeMonth)

  const clearDateOnBackspace = event => {
    if (["Backspace", "Clear", "Delete"].includes(event.key)) {
      handleChange(null)
      calendar.hide()
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

  const getDisplayValue = value => {
    if (!value) {
      return null
    }
    if (!enableTime) {
      return value.format("MMMM D YYYY")
    } else {
      return value.format("MMMM D YYYY, HH:mm")
    }
  }

  const getMondays = monthStart => {
    if (!monthStart?.isValid()) {
      return []
    }
    let monthEnd = monthStart.endOf("month")
    let calendarStart = monthStart.startOf("week")
    const numWeeks = Math.ceil((monthEnd.diff(calendarStart, "day") + 1) / 7)

    let mondays = []
    for (let i = 0; i < numWeeks; i++) {
      mondays.push(calendarStart.add(i, "weeks"))
    }
    return mondays
  }

  const handleChange = date => {
    if (!date) {
      dispatch("change", null)
      return
    }

    let newValue = date.toISOString()
    const noTimezone = enableTime && ignoreTimezones

    // For date-only fields, construct a manual timestamp string without a time
    // or time zone
    if (!enableTime) {
      const year = date.year()
      const month = `${date.month() + 1}`.padStart(2, "0")
      const day = `${date.date()}`.padStart(2, "0")
      newValue = `${year}-${month}-${day}T00:00:00.000`
    }

    // For non-timezone-aware fields, create an ISO 8601 timestamp of the exact
    // time picked, without timezone
    else if (noTimezone) {
      const offset = new Date().getTimezoneOffset() * 60000
      newValue = new Date(date.valueOf() - offset).toISOString().slice(0, -1)
    }

    dispatch("change", newValue)
  }
</script>

<div
  bind:this={anchor}
  class:is-disabled={disabled}
  class:is-invalid={!!error}
  class="spectrum-InputGroup spectrum-Datepicker"
  class:is-focused={isOpen}
  aria-readonly="false"
  aria-required="false"
  aria-haspopup="true"
  on:click={calendar.show}
>
  <div
    class="spectrum-Textfield spectrum-InputGroup-textfield"
    class:is-disabled={disabled}
    class:is-invalid={!!error}
  >
    {#if !!error}
      <svg
        class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-icon-18-Alert" />
      </svg>
    {/if}
    <input
      {disabled}
      data-input
      type="text"
      class="spectrum-Textfield-input spectrum-InputGroup-input"
      class:is-disabled={disabled}
      {placeholder}
      {id}
      value={displayValue}
    />
  </div>
  <button
    type="button"
    class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
    tabindex="-1"
    class:is-disabled={disabled}
    class:is-invalid={!!error}
  >
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM"
      focusable="false"
      aria-hidden="true"
      aria-label="Calendar"
    >
      <use xlink:href="#spectrum-icon-18-Calendar" />
    </svg>
  </button>
</div>

<Popover
  bind:this={calendar}
  on:open={onOpen}
  on:close={onClose}
  {anchor}
  align="left"
>
  <div class="spectrum-Calendar">
    <div class="spectrum-Calendar-header">
      <div
        class="spectrum-Calendar-title"
        role="heading"
        aria-live="assertive"
        aria-atomic="true"
      >
        {activeMonth.format("MMMM YYYY")}
      </div>
      <button
        aria-label="Previous"
        title="Previous"
        class="spectrum-ActionButton spectrum-ActionButton--quiet spectrum-Calendar-prevMonth"
        on:click={() => (activeMonth = activeMonth.subtract(1, "month"))}
      >
        <svg
          class="spectrum-Icon spectrum-UIIcon-ChevronLeft100"
          focusable="false"
          aria-hidden="true"
        >
          <use xlink:href="#spectrum-css-icon-Chevron100" />
        </svg>
      </button>
      <button
        aria-label="Next"
        title="Next"
        class="spectrum-ActionButton spectrum-ActionButton--quiet spectrum-Calendar-nextMonth"
        on:click={() => (activeMonth = activeMonth.add(1, "month"))}
      >
        <svg
          class="spectrum-Icon spectrum-UIIcon-ChevronRight100"
          focusable="false"
          aria-hidden="true"
        >
          <use xlink:href="#spectrum-css-icon-Chevron100" />
        </svg>
      </button>
    </div>
    <div
      class="spectrum-Calendar-body"
      tabindex="0"
      aria-readonly="true"
      aria-disabled="false"
    >
      <table role="presentation" class="spectrum-Calendar-table">
        <thead role="presentation">
          <tr>
            {#each DaysOfWeek as day}
              <th scope="col" class="spectrum-Calendar-tableCell">
                <abbr class="spectrum-Calendar-dayOfWeek" title={day}>
                  {day[0]}
                </abbr>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody role="presentation">
          {#each mondays as monday}
            <tr>
              {#each [0, 1, 2, 3, 4, 5, 6] as dayOffset}
                {@const date = monday.add(dayOffset, "days")}
                {@const outsideMonth = date.month() !== activeMonth.month()}
                <td
                  class="spectrum-Calendar-tableCell"
                  aria-disabled="true"
                  aria-selected="false"
                  aria-invalid="false"
                  title={date.format("dddd, MMMM D, YYYY")}
                  on:click={outsideMonth ? null : handleChange(date)}
                >
                  <span
                    role="presentation"
                    class="spectrum-Calendar-date"
                    class:is-outsideMonth={outsideMonth}
                    class:is-today={date.isSame(today, "day")}
                    class:is-selected={date.isSame(parsedValue, "day")}
                  >
                    {date.date()}
                  </span>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</Popover>

<style>
  .spectrum-Textfield-input {
    pointer-events: none;
  }
  .spectrum-Textfield:not(.is-disabled):hover {
    cursor: pointer;
  }
  .spectrum-Datepicker {
    width: 100%;
    overflow: hidden;
  }
  .spectrum-Datepicker .spectrum-Textfield {
    width: 100%;
  }
  :global(.flatpickr-calendar) {
    font-family: var(--font-sans);
  }
  .is-disabled {
    pointer-events: none !important;
  }

  /* Calendar */
  .spectrum-Calendar {
    padding: 8px;
  }
  .is-outsideMonth {
    pointer-events: none;
  }
</style>
