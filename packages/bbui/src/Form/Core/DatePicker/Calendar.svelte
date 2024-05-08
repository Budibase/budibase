<script>
  import { cleanInput } from "./utils"
  import Select from "../../Select.svelte"
  import dayjs from "dayjs"
  import NumberInput from "./NumberInput.svelte"
  import { createEventDispatcher } from "svelte"
  import isoWeek from "dayjs/plugin/isoWeek"

  dayjs.extend(isoWeek)

  export let value

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

  const now = dayjs()
  let calendarDate

  $: calendarDate = dayjs(value || dayjs()).startOf("month")
  $: mondays = getMondays(calendarDate)

  const getMondays = monthStart => {
    if (!monthStart?.isValid()) {
      return []
    }
    let monthEnd = monthStart.endOf("month")
    let calendarStart = monthStart.startOf("isoWeek")
    const numWeeks = Math.ceil((monthEnd.diff(calendarStart, "day") + 1) / 7)

    let mondays = []
    for (let i = 0; i < numWeeks; i++) {
      mondays.push(calendarStart.add(i, "weeks"))
    }
    return mondays
  }

  const handleCalendarYearChange = e => {
    calendarDate = calendarDate.year(parseInt(e.target.value))
  }

  const handleDateChange = date => {
    const base = value || now
    dispatch(
      "change",
      base.year(date.year()).month(date.month()).date(date.date())
    )
  }

  export const setDate = date => {
    calendarDate = date
  }

  const cleanYear = cleanInput({ max: 9999, pad: 0, fallback: now.year() })
</script>

<div class="spectrum-Calendar">
  <div class="spectrum-Calendar-header">
    <div
      class="spectrum-Calendar-title"
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
      <NumberInput
        value={calendarDate.year()}
        min={0}
        max={9999}
        width={64}
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
                  class:is-today={!outsideMonth && date.isSame(now, "day")}
                  class:is-selected={date.isSame(value, "day")}
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

<style>
  /* Calendar overrides */
  .spectrum-Calendar {
    width: auto;
  }
  .spectrum-Calendar-header {
    width: auto;
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
  .spectrum-Calendar-date.is-today,
  .spectrum-Calendar-date.is-today::before {
    border-color: var(--spectrum-global-color-gray-400);
  }
  .spectrum-Calendar-date.is-today.is-selected,
  .spectrum-Calendar-date.is-today.is-selected::before {
    border-color: var(
      --primaryColorHover,
      var(--spectrum-global-color-blue-700)
    );
  }
  .spectrum-Calendar-date.is-selected:not(.is-range-selection) {
    background: var(--primaryColor, var(--spectrum-global-color-blue-400));
  }
  .spectrum-Calendar tr {
    box-sizing: content-box;
    height: 40px;
  }
  .spectrum-Calendar-tableCell {
    box-sizing: content-box;
  }
  .spectrum-Calendar-nextMonth,
  .spectrum-Calendar-prevMonth {
    order: 1;
    padding: 4px;
  }
  .spectrum-Calendar-date {
    color: var(--spectrum-alias-text-color);
  }
  .spectrum-Calendar-date.is-selected {
    color: white;
  }
  .spectrum-Calendar-dayOfWeek {
    color: var(--spectrum-global-color-gray-600);
  }

  /* Style select */
  .month-selector :global(.spectrum-Picker) {
    background: none;
    border: none;
    padding: 4px 6px;
  }
  .month-selector :global(.spectrum-Picker:hover),
  .month-selector :global(.spectrum-Picker.is-open) {
    background: var(--spectrum-global-color-gray-200);
  }
  .month-selector :global(.spectrum-Picker-label) {
    font-size: 18px;
    font-weight: bold;
  }
</style>
