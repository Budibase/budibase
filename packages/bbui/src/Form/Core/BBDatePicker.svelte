<script>
  import "@spectrum-css/calendar/dist/index-vars.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/textfield/dist/index-vars.css"
  import "@spectrum-css/picker/dist/index-vars.css"
  import Popover from "../../Popover/Popover.svelte"
  import dayjs from "dayjs"
  import { createEventDispatcher } from "svelte"
  import Select from "../Select.svelte"
  import Icon from "../../Icon/Icon.svelte"
  import ActionButton from "../../ActionButton/ActionButton.svelte"

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
  const MonthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  let isOpen = false
  let anchor
  let calendar
  let today = dayjs()
  let calendarDate

  $: parsedValue = parseValue(value)
  $: displayValue = getDisplayValue(parsedValue)
  $: calendarDate = dayjs(parsedValue || today).startOf("month")
  $: mondays = getMondays(calendarDate)

  const clearDateOnBackspace = event => {
    // Ignore if we're typing a value
    if (document.activeElement?.tagName.toLowerCase() === "input") {
      return
    }
    if (["Backspace", "Clear", "Delete"].includes(event.key)) {
      handleChange(null)
      calendar?.hide()
    }
  }

  const onOpen = () => {
    calendarDate = dayjs(parsedValue || today).startOf("month")
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

  const handleMinuteChange = e => {
    handleChange(parsedValue.minute(parseInt(e.target.value)))
  }

  const handleHourChange = e => {
    handleChange(parsedValue.hour(parseInt(e.target.value)))
  }

  const handleDateChange = date => {
    // Select this date at midnight if no current date
    if (!parsedValue) {
      handleChange(date)
    }
    // Otherwise persist selected time
    else {
      handleChange(
        parsedValue.year(date.year()).month(date.month()).date(date.date())
      )
    }
  }

  const handleCalendarYearChange = e => {
    calendarDate = calendarDate.year(parseInt(e.target.value))
  }

  const cleanNumber = ({ max, pad, fallback }) => {
    return e => {
      if (e.target.value) {
        const value = parseInt(e.target.value)
        if (isNaN(value)) {
          e.target.value = fallback
        } else {
          e.target.value = Math.min(max, value).toString().padStart(pad, "0")
        }
      } else {
        e.target.value = fallback
      }
    }
  }

  // Sanitization utils
  const cleanYear = cleanNumber({ max: 9999, pad: 0, fallback: today.year() })
  const cleanHour = cleanNumber({ max: 23, pad: 2, fallback: "00" })
  const cleanMinute = cleanNumber({ max: 59, pad: 2, fallback: "00" })
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
        <div class="month-selector">
          <Select
            autoWidth
            placeholder={null}
            options={MonthsOfYear.map((m, idx) => ({ label: m, value: idx }))}
            value={calendarDate.month()}
            on:change={e => (calendarDate = calendarDate.month(e.detail))}
          />
        </div>
        <input
          class="custom-num-input"
          type="number"
          value={calendarDate.year()}
          min="0"
          max="9999"
          onclick="this.select()"
          on:change={handleCalendarYearChange}
          on:input={cleanYear}
        />
      </div>
      <button
        aria-label="Previous"
        title="Previous"
        class="spectrum-ActionButton spectrum-ActionButton--quiet spectrum-Calendar-prevMonth"
        on:click={() => (calendarDate = calendarDate.subtract(1, "month"))}
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
        on:click={() => (calendarDate = calendarDate.add(1, "month"))}
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
                {@const outsideMonth = date.month() !== calendarDate.month()}
                <td
                  class="spectrum-Calendar-tableCell"
                  aria-disabled="true"
                  aria-selected="false"
                  aria-invalid="false"
                  title={date.format("dddd, MMMM D, YYYY")}
                  on:click={() => handleDateChange(date)}
                >
                  <span
                    role="presentation"
                    class="spectrum-Calendar-date"
                    class:is-outsideMonth={outsideMonth}
                    class:is-today={!outsideMonth && date.isSame(today, "day")}
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
  {#if parsedValue && enableTime}
    <div class="time-picker">
      <input
        class="custom-num-input"
        type="number"
        value={parsedValue.hour().toString().padStart(2, "0")}
        min="0"
        max="23"
        onclick="this.select()"
        on:input={cleanHour}
        on:change={handleHourChange}
      />
      <span>:</span>
      <input
        class="custom-num-input"
        type="number"
        value={parsedValue.minute().toString().padStart(2, "0")}
        min="0"
        max="59"
        onclick="this.select()"
        on:input={cleanMinute}
        on:change={handleMinuteChange}
      />
    </div>
  {/if}
</Popover>

<style>
  /* Date label overrides */
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
  .is-disabled {
    pointer-events: none !important;
  }

  /* Calendar overrides */
  .spectrum-Calendar {
    padding: 8px;
  }
  .spectrum-Calendar-title {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
  }
  .spectrum-Calendar-header button {
    border-radius: 4px;
  }
  .spectrum-Calendar-date.is-outsideMonth {
    visibility: visible;
    color: var(--spectrum-global-color-gray-400);
  }
  .spectrum-Calendar-date.is-today:before {
    border-color: var(--spectrum-global-color-gray-400);
  }
  .spectrum-Calendar-date.is-today {
    border-color: var(--spectrum-global-color-gray-400);
  }
  .spectrum-Calendar-date.is-selected:not(.is-range-selection) {
    background: var(--spectrum-global-color-blue-400);
  }
  .spectrum-Calendar-nextMonth,
  .spectrum-Calendar-prevMonth {
    order: 1;
    padding: 4px 6px;
  }

  /* Month and year selector */
  .month-selector :global(.spectrum-Picker),
  .custom-num-input {
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
  .month-selector :global(.spectrum-Picker:hover),
  .month-selector :global(.spectrum-Picker.is-open),
  .custom-num-input:hover {
    background: var(--spectrum-global-color-gray-200);
  }
  .month-selector :global(.spectrum-Picker-label) {
    font-size: var(--spectrum-calendar-title-text-size);
    font-weight: bold;
    color: var(--spectrum-alias-text-color);
  }

  /* Time picker */
  .time-picker {
    margin-top: 4px;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    padding: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .time-picker span {
    font-weight: bold;
    font-size: 18px;
    z-index: -1;
    color: var(--spectrum-global-color-gray-700);
  }
  .time-picker .custom-num-input:first-child {
    margin-right: -16px;
  }
  .time-picker .custom-num-input:last-child {
    margin-left: 8px;
  }
</style>
