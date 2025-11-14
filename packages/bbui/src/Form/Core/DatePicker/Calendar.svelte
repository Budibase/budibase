<script>
  import { cleanInput } from "./utils"
  import Select from "../../Select.svelte"
  import dayjs from "dayjs"
  import NumberInput from "./NumberInput.svelte"
  import { createEventDispatcher } from "svelte"
  import Icon from "../../../Icon/Icon.svelte"

  export let value
  export let startDayOfWeek = "Monday"

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
  const DayIndex = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }
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
  $: dayHeaders = getDayHeaders(startDayOfWeek)
  $: weekStarts = getWeekStarts(calendarDate, DayIndex[startDayOfWeek])

  const getWeekStarts = (monthStart, startDayIndex) => {
    if (!monthStart?.isValid()) {
      return []
    }
    let monthEnd = monthStart.endOf("month")
    const offset = (((monthStart.day() - startDayIndex) % 7) + 7) % 7
    let calendarStart = monthStart.subtract(offset, "day")
    const numWeeks = Math.ceil((monthEnd.diff(calendarStart, "day") + 1) / 7)

    let starts = []
    for (let i = 0; i < numWeeks; i++) {
      starts.push(calendarStart.add(i, "weeks"))
    }
    return starts
  }

  const getDayHeaders = startDay => {
    const index = DaysOfWeek.indexOf(startDay)
    if (index === -1) {
      return DaysOfWeek
    }
    return [...DaysOfWeek.slice(index), ...DaysOfWeek.slice(0, index)]
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
      <Icon name="caret-left" weight="bold" size="S" />
    </button>
    <button
      aria-label="Next"
      title="Next"
      class="spectrum-ActionButton spectrum-ActionButton--quiet spectrum-Calendar-nextMonth"
      on:click={() => (calendarDate = calendarDate.add(1, "month"))}
    >
      <Icon name="caret-right" weight="bold" size="S" />
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
          {#each dayHeaders as day}
            <th scope="col" class="spectrum-Calendar-tableCell">
              <abbr class="spectrum-Calendar-dayOfWeek" title={day}>
                {day[0]}
              </abbr>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody role="presentation">
        {#each weekStarts as weekStart}
          <tr>
            {#each [0, 1, 2, 3, 4, 5, 6] as dayOffset}
              {@const date = weekStart.add(dayOffset, "days")}
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
