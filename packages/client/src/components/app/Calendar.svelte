<script lang="ts">
  import { getContext } from "svelte"

  import "@fullcalendar/core/locales-all"
  import FullCalendar from "svelte-fullcalendar"
  import dayGridPlugin from "@fullcalendar/daygrid"
  import timeGridPlugin from "@fullcalendar/timegrid"
  import listPlugin from "@fullcalendar/list"
  import DataProvider from "./DataProvider.svelte"
  import { Row } from "@budibase/types"

  export let todayText: string | "today"
  export let dataProvider: DataProvider
  export let eventStart: string // can haz type?
  export let eventEnd: string // can haz type?
  export let eventTitle: string

  export let onClick: any // Also can has type?
  export let showButtons: boolean
  export let monthText: string | "Month"
  export let weekText: string | "Week"
  export let dayText: string | "Day"
  export let agendaText: string | "Agenda"
  export let showTitleDate: boolean | true
  export let titleDateFormat: string | ["en-gb", "en-us"]
  export let emptyAgendaText: string | "No events found"
  export let openOnDate: string // SHould be date?
  export let calendarType:
    | string
    | ["dayGridMonth", "dayGridWeek", "timeGridDay", "listWeek"]

  const { styleable, componentStore } = getContext("sdk")
  const component = getContext("component")
  let calendarRef: FullCalendar | null = null
  $: isTimeGridDay = calendarType === "timeGridDay"
  $: definition = componentStore.actions.getComponentDefinition($component.type)
  $: calendarHeight = definition?.size?.height ?? 600

  $: events =
    dataProvider?.rows?.map((row: Row) => ({
      title: row[eventTitle],
      start: row[eventStart],
      end: row[eventEnd],
      row_id: row["_id"],
    })) ?? []

  function handleEventClick(info: any) {
    const title = info.event.title
    const start = info.event.start
    const end = info.event.end
    const row_id = info.event.extendedProps?.row_id || info.event.id
    onClick?.({ title, start, end, row_id })
  }

  $: options = {
    headerToolbar: {
      left: showButtons ? "dayGridMonth,dayGridWeek,timeGridDay,listWeek" : "",
      center: showTitleDate ? "title" : "",
      right: showButtons ? "prevYear,prev,today,next,nextYear" : "",
    },
    footerToolbar: "",
    titleFormat: {
      dayGridMonth: { year: "numeric", month: "2-digit" },
      timeGridWeek: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
      timeGridDay: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
      listWeek: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    },
    locale: titleDateFormat,
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
      listWeek: {
        noEventsContent: emptyAgendaText,
      },
    },
    initialDate: openOnDate,
    events,
    eventClick: function (info) {
      handleEventClick(info)
    },
    // eventTimeFormat to override default meridiem to "short"
    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      meridiem: "short",
    },
    height: calendarHeight,
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
  use:styleable={$component.styles}
>
  <FullCalendar bind:this={calendarRef} {options} />
</div>

<style>
  .calendar :global(.fc-button-primary) {
    --fc-button-text-color: var(--spectrum-global-color-static-white, #fff);
    --fc-button-bg-color: var(
      --primaryColor,
      var(--spectrum-global-color-blue-600)
    );
    --fc-button-border-color: var(
      --primaryColor,
      var(--spectrum-global-color-blue-600)
    );
    --fc-button-hover-bg-color: var(
      --primaryColorHover,
      var(--primaryColor, var(--spectrum-global-color-blue-500))
    );
    --fc-button-hover-border-color: var(
      --primaryColorHover,
      var(--primaryColor, var(--spectrum-global-color-blue-500))
    );
    --fc-button-active-bg-color: var(
      --primaryColorHover,
      var(--primaryColor, var(--spectrum-global-color-red-500))
    );
    --fc-button-active-border-color: var(
      --primaryColorHover,
      var(--primaryColor, var(--spectrum-global-color-blue-500))
    );
    box-shadow: none;
    font-size: 13px;
  }

  .calendar :global(.fc-button-group .fc-button-primary) {
    font-weight: 600;
    padding: 4 17 4 17;
    color: var(
      --spectrum-global-color-static-white,
      #fff
    ); /* Check if this is required */
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
    color: var(--spectrum-alias-heading-text-color);
    font-weight: 700;
  } /* Still want to look at font-spacing to better match the original button */

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
