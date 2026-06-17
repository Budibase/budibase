<script lang="ts">
  import { getContext, onMount } from "svelte"

  import "@fullcalendar/core/locales-all"
  import FullCalendar from "svelte-fullcalendar"
  import dayGridPlugin from "@fullcalendar/daygrid"
  import timeGridPlugin from "@fullcalendar/timegrid"
  import listPlugin from "@fullcalendar/list"
  import {
    formatDate,
    formatRange,
    type DayHeaderContentArg,
    type EventClickArg,
    type FormatterInput,
  } from "@fullcalendar/core"
  import type { Row, UIFieldDataProviderContext } from "@budibase/types"
  import { loadTranslationsByGroup } from "@budibase/frontend-core"

  type CalendarView =
    | "dayGridMonth"
    | "dayGridWeek"
    | "timeGridDay"
    | "listWeek"
  type YearTitleFormat = "hidden" | "numeric" | "2-digit"
  type MonthTitleFormat = "hidden" | "numeric" | "2-digit" | "short" | "long"
  type DayTitleFormat = "hidden" | "numeric" | "2-digit"
  type TitleDateLocale = "en-gb" | "en-us"
  type CalendarButtonType = "action" | "primary"
  type WeekdayFormat = "long" | "short" | "narrow"
  type WeekdayTitleFormat = "hidden" | WeekdayFormat
  type MonthFormat = "long" | "short"
  interface CalendarDateFormat extends Intl.DateTimeFormatOptions {
    omitCommas?: boolean
    separator?: string
  }
  type CalendarTitleFormatter = Exclude<
    FormatterInput,
    string | Intl.DateTimeFormatOptions
  >
  type WeekdayTranslationKey =
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
  type MonthTranslationKey =
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december"

  const weekdayTranslationKeys: WeekdayTranslationKey[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]
  const monthTranslationKeys: MonthTranslationKey[] = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ]

  const formatTranslatedLabel = (label: string, format: WeekdayFormat) => {
    if (format === "narrow") {
      return label.slice(0, 1)
    }
    if (format === "short") {
      return label.slice(0, 3)
    }
    return label
  }

  const isWeekdayFormat = (format: string): format is WeekdayFormat =>
    ["long", "short", "narrow"].includes(format)
  const isMonthFormat = (format: string | undefined): format is MonthFormat =>
    format === "long" || format === "short"
  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  interface CalendarEventPayload {
    row_id?: string
    title: string
    start: Date | string | null
    end: Date | string | null
  }

  export let todayText: string = "Today"
  export let dataProvider: UIFieldDataProviderContext | undefined
  export let eventStart: string
  export let eventEnd: string
  export let eventTitle: string

  export let onClick: ((_payload: CalendarEventPayload) => void) | undefined
  export let showButtons: boolean
  export let buttonType: CalendarButtonType = "action"
  export let monthText: string = "Month"
  export let weekText: string = "Week"
  export let dayText: string = "Day"
  export let agendaText: string = "Agenda"
  export let showTitleDate: boolean = true
  export let locale: TitleDateLocale = "en-gb"
  export let yearTitleFormat: YearTitleFormat
  export let monthTitleFormat: MonthTitleFormat
  export let dayTitleFormat: DayTitleFormat
  export let weekdayTitleFormat: WeekdayTitleFormat
  export let emptyAgendaText: string = "No events found"
  export let openOnDate: string = "{{ now }}"
  export let calendarType: CalendarView = "dayGridMonth"
  export let showDayNames: boolean = true

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const calendarLabels = loadTranslationsByGroup("calendar")
  let calendarRef: FullCalendar | null = null
  let calendarContainer: HTMLDivElement | null = null
  let resizeObserver: ResizeObserver | null = null
  let timeGridDayTitleFormat: FormatterInput
  $: isTimeGridDay = calendarType === "timeGridDay"
  $: calendarButtonType = buttonType === "primary" ? "primary" : "action"
  $: hasClickAction = typeof onClick === "function"
  $: yearTitleFormatProps =
    yearTitleFormat && yearTitleFormat !== "hidden"
      ? { year: yearTitleFormat }
      : {}
  $: monthTitleFormatProps =
    monthTitleFormat && monthTitleFormat !== "hidden"
      ? { month: monthTitleFormat }
      : {}
  $: dayTitleFormatProps =
    dayTitleFormat && dayTitleFormat !== "hidden" ? { day: dayTitleFormat } : {}
  $: timeGridDayTitleDateFormat = {
    ...yearTitleFormatProps,
    ...dayTitleFormatProps,
    ...monthTitleFormatProps,
    omitCommas: true,
  }

  $: events =
    dataProvider?.rows?.map((row: Row) => ({
      title: row[eventTitle],
      start: row[eventStart],
      end: row[eventEnd],
      row_id: row["_id"],
    })) ?? []

  const updateCalendarSize = () => {
    const api = calendarRef?.getAPI?.()
    api?.updateSize()
  }

  onMount(() => {
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateCalendarSize())
      if (calendarContainer) {
        resizeObserver.observe(calendarContainer)
      }
    }
    return () => {
      resizeObserver?.disconnect()
      resizeObserver = null
    }
  })

  $: if (resizeObserver && calendarContainer) {
    resizeObserver.observe(calendarContainer)
  }

  function handleEventClick(info: EventClickArg) {
    const title = info.event.title
    const start = info.event.start
    const end = info.event.end
    const row_id = info.event.extendedProps?.row_id || info.event.id
    onClick?.({ title, start, end, row_id })
  }

  const getTranslatedWeekday = (date: Date, format: WeekdayFormat) => {
    const key = weekdayTranslationKeys[date.getUTCDay()]
    return formatTranslatedLabel(calendarLabels[key], format)
  }

  const getTranslatedMonth = (date: Date, format: MonthFormat) => {
    const key = monthTranslationKeys[date.getUTCMonth()]
    return formatTranslatedLabel(calendarLabels[key], format)
  }

  const replaceTranslatedMonths = (
    value: string,
    monthFormat: Intl.DateTimeFormatOptions["month"]
  ) => {
    if (!isMonthFormat(monthFormat)) {
      return value
    }

    const replacements = monthTranslationKeys
      .map((_, index) => {
        const date = new Date(Date.UTC(2020, index, 1))
        return {
          localeLabel: new Intl.DateTimeFormat(locale, {
            month: monthFormat,
            timeZone: "UTC",
          }).format(date),
          translatedLabel: getTranslatedMonth(date, monthFormat),
        }
      })
      .sort((a, b) => b.localeLabel.length - a.localeLabel.length)

    const translationMap = new Map(
      replacements.map(({ localeLabel, translatedLabel }) => [
        localeLabel,
        translatedLabel,
      ])
    )
    const monthPattern = new RegExp(
      replacements
        .map(({ localeLabel }) => escapeRegExp(localeLabel))
        .join("|"),
      "g"
    )

    return value.replace(
      monthPattern,
      match => translationMap.get(match) ?? match
    )
  }

  const formatTranslatedDate = (date: Date, dateFormat: CalendarDateFormat) => {
    const formattedDate = formatDate(date, { ...dateFormat, locale })
    return replaceTranslatedMonths(formattedDate, dateFormat.month)
  }

  const formatTranslatedDateRange = (
    start: Date,
    end: Date | undefined,
    dateFormat: CalendarDateFormat
  ) => {
    const formattedDate = end
      ? formatRange(start, end, { ...dateFormat, locale })
      : formatDate(start, { ...dateFormat, locale })

    return replaceTranslatedMonths(formattedDate, dateFormat.month)
  }

  const buildTranslatedDateFormat =
    (dateFormat: CalendarDateFormat): CalendarTitleFormatter =>
    arg =>
      formatTranslatedDateRange(arg.start.marker, arg.end?.marker, {
        ...dateFormat,
        separator: arg.defaultSeparator,
      })

  const buildDayHeaderContent =
    (weekdayFormat: WeekdayFormat, dateFormat?: CalendarDateFormat) =>
    (arg: DayHeaderContentArg) => {
      const weekday = getTranslatedWeekday(arg.date, weekdayFormat)
      const date = dateFormat
        ? formatTranslatedDate(arg.date, dateFormat)
        : undefined

      return date ? `${weekday} ${date}` : weekday
    }

  const buildTranslatedWeekdayTitleFormat =
    (
      weekdayFormat: WeekdayFormat,
      dateFormat: CalendarDateFormat
    ): CalendarTitleFormatter =>
    arg => {
      const date = arg.date.marker
      const weekday = getTranslatedWeekday(date, weekdayFormat)
      const hasDateFormat =
        dateFormat.year || dateFormat.month || dateFormat.day
      const formattedDate = hasDateFormat
        ? formatTranslatedDate(date, dateFormat)
        : undefined

      return formattedDate ? `${weekday} ${formattedDate}` : weekday
    }

  $: monthTitleUsesTranslation = isMonthFormat(monthTitleFormat)
  $: dayGridMonthTitleFormat = monthTitleUsesTranslation
    ? buildTranslatedDateFormat({
        ...yearTitleFormatProps,
        ...monthTitleFormatProps,
      })
    : {
        ...yearTitleFormatProps,
        ...monthTitleFormatProps,
      }
  $: dayGridWeekTitleFormat = monthTitleUsesTranslation
    ? buildTranslatedDateFormat({
        ...yearTitleFormatProps,
        ...dayTitleFormatProps,
        ...monthTitleFormatProps,
      })
    : {
        ...yearTitleFormatProps,
        ...dayTitleFormatProps,
        ...monthTitleFormatProps,
      }
  $: {
    if (weekdayTitleFormat && isWeekdayFormat(weekdayTitleFormat)) {
      timeGridDayTitleFormat = buildTranslatedWeekdayTitleFormat(
        weekdayTitleFormat,
        timeGridDayTitleDateFormat
      )
    } else if (monthTitleUsesTranslation) {
      timeGridDayTitleFormat = buildTranslatedDateFormat(
        timeGridDayTitleDateFormat
      )
    } else {
      timeGridDayTitleFormat = timeGridDayTitleDateFormat
    }
  }
  $: listDayFormat = showDayNames
    ? buildTranslatedWeekdayTitleFormat("long", {})
    : false
  $: listDaySideFormat = buildTranslatedDateFormat({
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  $: options = {
    headerToolbar: {
      left: showButtons ? "dayGridMonth,dayGridWeek,timeGridDay,listWeek" : "",
      center: showTitleDate ? "title" : "",
      right: showButtons ? "prevYear,prev,today,next,nextYear" : "",
    },
    footerToolbar: "",
    locale,
    buttonText: {
      today: todayText,
      dayGridMonth: monthText,
      dayGridWeek: weekText,
      timeGridDay: dayText,
      listWeek: agendaText,
    },
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: calendarType || "dayGridMonth",
    views: {
      dayGridMonth: {
        titleFormat: dayGridMonthTitleFormat,
        dayHeaders: showDayNames,
        dayHeaderContent: showDayNames
          ? buildDayHeaderContent("short")
          : undefined,
      },
      dayGridWeek: {
        titleFormat: dayGridWeekTitleFormat,
        dayHeaderFormat: showDayNames
          ? { weekday: "short", day: "numeric", month: "numeric" }
          : { day: "numeric", month: "numeric" },
        dayHeaderContent: showDayNames
          ? buildDayHeaderContent("short", {
              day: "numeric",
              month: "numeric",
            })
          : undefined,
      },
      timeGridDay: {
        titleFormat: timeGridDayTitleFormat,
        dayHeaderFormat: showDayNames
          ? { weekday: "short", day: "numeric", month: "numeric" }
          : { day: "numeric", month: "numeric" },
        dayHeaderContent: showDayNames
          ? buildDayHeaderContent("short", {
              day: "numeric",
              month: "numeric",
            })
          : undefined,
      },
      listWeek: {
        titleFormat: dayGridWeekTitleFormat,
        listDayFormat,
        listDaySideFormat,
        noEventsContent: emptyAgendaText,
      },
    },
    initialDate: openOnDate,
    events,
    eventClick: handleEventClick,
    // eventTimeFormat to override default meridiem to "short" (AM/PM)
    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      meridiem: "short",
    },
    height: "100%",
  }

  $: if (calendarRef && calendarType) {
    const api = calendarRef.getAPI?.()
    if (api && api.view.type !== calendarType) {
      api.changeView(calendarType)
    }
  }
</script>

<div
  class="calendar"
  class:timeGridDay={isTimeGridDay}
  class:hasClickAction
  data-button-type={calendarButtonType}
  bind:this={calendarContainer}
  use:styleable={$component.styles}
>
  <FullCalendar bind:this={calendarRef} {options} />
</div>

<style>
  .calendar :global(.fc-button-primary) {
    box-shadow: none;
    font-size: 13px;
  }

  .calendar.hasClickAction :global(.fc-event) {
    cursor: pointer;
  }

  .calendar :global(.fc-today-button.fc-button-primary) {
    background-color: var(--fc-button-bg-color);
    border-color: var(--fc-button-border-color);
    transition:
      background-color 130ms ease-out,
      border-color 130ms ease-out;
  }

  .calendar :global(.fc-today-button.fc-button-primary:hover),
  .calendar :global(.fc-today-button.fc-button-primary:focus) {
    background-color: var(--fc-button-hover-bg-color);
    border-color: var(--fc-button-hover-border-color);
  }

  .calendar :global(.fc-today-button.fc-button-primary:active) {
    background-color: var(--fc-button-active-bg-color);
    border-color: var(--fc-button-active-border-color);
  }

  .calendar[data-button-type="action"] :global(.fc-button-primary) {
    --fc-button-text-color: var(
      --spectrum-button-cta-m-text-color,
      var(--spectrum-global-color-static-white, #fff)
    );
    --fc-button-bg-color: var(
      --spectrum-button-cta-m-background-color,
      var(--spectrum-semantic-cta-color-background-default)
    );
    --fc-button-border-color: var(
      --spectrum-button-cta-m-border-color,
      var(--spectrum-semantic-cta-color-background-default)
    );
    --fc-button-hover-bg-color: var(
      --spectrum-button-cta-m-background-color-hover,
      var(--spectrum-semantic-cta-color-background-hover)
    );
    --fc-button-hover-border-color: var(
      --spectrum-button-cta-m-border-color-hover,
      var(--spectrum-semantic-cta-color-background-hover)
    );
    --fc-button-active-bg-color: var(
      --spectrum-button-cta-m-background-color-down,
      var(--spectrum-semantic-cta-color-background-down)
    );
    --fc-button-active-border-color: var(
      --spectrum-button-cta-m-border-color-down,
      var(--spectrum-semantic-cta-color-background-down)
    );
    border-width: var(
      --spectrum-button-primary-m-border-size,
      var(--spectrum-alias-border-size-thick, 2px)
    );
    color: var(
      --spectrum-button-cta-m-text-color,
      var(--spectrum-global-color-static-white, #fff)
    );
  }

  .calendar[data-button-type="action"] :global(.fc-button-primary:hover),
  .calendar[data-button-type="action"] :global(.fc-button-primary:active) {
    color: var(
      --spectrum-button-cta-m-text-color-hover,
      var(--spectrum-global-color-static-white, #fff)
    );
  }

  .calendar[data-button-type="primary"] :global(.fc-button-primary) {
    --fc-button-text-color: var(
      --spectrum-button-primary-m-text-color,
      var(--spectrum-global-color-gray-800)
    );
    --fc-button-bg-color: var(
      --spectrum-button-primary-m-background-color,
      var(--spectrum-alias-background-color-transparent)
    );
    --fc-button-border-color: var(
      --spectrum-button-primary-m-border-color,
      var(--spectrum-global-color-gray-800)
    );
    --fc-button-hover-bg-color: var(
      --spectrum-button-primary-m-background-color-hover,
      var(--spectrum-global-color-gray-800)
    );
    --fc-button-hover-border-color: var(
      --spectrum-button-primary-m-border-color-hover,
      var(--spectrum-global-color-gray-800)
    );
    --fc-button-active-bg-color: var(
      --spectrum-button-primary-m-background-color-hover,
      var(--spectrum-global-color-gray-800)
    );
    --fc-button-active-border-color: var(
      --spectrum-button-primary-m-border-color-hover,
      var(--spectrum-global-color-gray-800)
    );
    color: var(
      --spectrum-button-primary-m-text-color,
      var(--spectrum-global-color-gray-800)
    );
    border-width: var(
      --spectrum-button-primary-m-border-size,
      var(--spectrum-alias-border-size-thick, 2px)
    );
  }

  .calendar[data-button-type="primary"] :global(.fc-button-primary:hover),
  .calendar[data-button-type="primary"]
    :global(.fc-button-primary.fc-button-active),
  .calendar[data-button-type="primary"]
    :global(.fc-button-primary.fc-button-active:hover) {
    color: var(
      --spectrum-button-primary-m-text-color-hover,
      var(--spectrum-global-color-gray-50)
    );
  }

  .calendar :global(.fc-button-group .fc-button-primary) {
    font-weight: 600;
    padding: 4px 17px 4px 17px;
  }

  .calendar :global(.fc .fc-button:focus),
  .calendar :global(.fc .fc-button-primary:focus),
  .calendar
    :global(.fc .fc-button-primary:not(:disabled).fc-button-active:focus),
  .calendar :global(.fc .fc-button-primary:not(:disabled):active:focus) {
    box-shadow: none;
  }

  .calendar :global(.fc-button-primary:disabled) {
    opacity: 1;
  }

  .calendar {
    color: var(--spectrum-alias-text-color, inherit);
    min-height: 420px;
  }

  .calendar :global(.fc-daygrid-day-number),
  .calendar :global(.fc-col-header-cell-cushion),
  .calendar :global(.fc-event-title),
  .calendar :global(.fc-event-time),
  .calendar :global(.fc-timegrid-axis-cushion),
  .calendar :global(.fc-timegrid-slot-label-cushion),
  .calendar :global(.fc-list-day-text),
  .calendar :global(.fc-list-event-time),
  .calendar :global(.fc-list-event-title),
  .calendar :global(.fc-list-day-side-text) {
    color: var(--spectrum-alias-text-color, inherit);
  }

  .calendar :global(.fc-button) {
    color: var(--fc-button-text-color);
    font-weight: var(
      --spectrum-button-primary-m-text-font-weight,
      var(--spectrum-global-font-weight-bold, 700)
    );
  }

  /* Specific radiuses (radii?) for first and last buttons */
  .calendar :global(.fc-prevYear-button),
  .calendar :global(.fc-dayGridMonth-button) {
    border-top-left-radius: var(--buttonBorderRadius, 16px);
    border-bottom-left-radius: var(--buttonBorderRadius, 16px);
    padding-left: 14px;
  }
  .calendar :global(.fc-nextYear-button),
  .calendar :global(.fc-listWeek-button) {
    border-top-right-radius: var(--buttonBorderRadius, 16px);
    border-bottom-right-radius: var(--buttonBorderRadius, 16px);
    padding-right: 14px;
  }

  .calendar :global(.fc-list-day-cushion) {
    background: var(--primaryColorHover, var(--spectrum-global-color-blue-500));
  }

  .calendar :global(.fc-list-day-text),
  .calendar :global(.fc-list-day-side-text) {
    color: var(--spectrum-global-color-static-white, #fff);
    opacity: 1;
  }

  .calendar :global(.fc-event-time),
  .calendar :global(.fc-event-title) {
    color: var(--spectrum-global-color-static-white, #fff);
    opacity: 1;
  }
  /* Override White text on Month(dayGridMonth) and Week(dayGridWeek) for light mode */
  .calendar :global(.fc-daygrid-event-harness a .fc-event-time),
  .calendar :global(.fc-daygrid-event-harness a .fc-event-title) {
    color: var(--spectrum-alias-heading-text-color);
  }

  .calendar :global(.fc-list-event:hover td) {
    background-color: var(--spectrum-alias-background-color-primary);
  }

  .calendar :global(.fc-list-empty) {
    background-color: transparent;
  }
</style>
