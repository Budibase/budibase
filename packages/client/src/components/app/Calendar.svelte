<script lang="ts">
  import { getContext } from "svelte"

  import "@fullcalendar/core/locales-all"
  import FullCalendar from "svelte-fullcalendar"
  import dayGridPlugin from "@fullcalendar/daygrid"
  import timeGridPlugin from "@fullcalendar/timegrid"
  import listPlugin from "@fullcalendar/list"
  import DataProvider from "./DataProvider.svelte"
  import { Row } from "@budibase/types"

  export let title: string
  export let todayText: string | "today"
  export let dataProvider: DataProvider
  export let eventStart: string // can haz type?
  export let eventEnd: string // can haz type?
  export let eventTitle: string
  export let eventDesc: string
  export let onClick: any // Also can has type?
  export let showNavButtons: boolean

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  const getEvents = () => {
    return dataProvider.rows.map((row: Row) => {
      console.log({ row })
      console.log(row["_id"])
      return {
        title: row[eventTitle],
        start: row[eventStart],
        end: row[eventEnd],
        row_id: row["_id"],
      }
    })
  }

  function handleEventClick(info: any) {
    const title = info.event.title
    const start = info.event.start
    const end = info.event.end
    const row_id = info.event.extendedProps?.row_id || info.event.id
    console.log("CLICKED!")
    onClick?.({ title, start, end, row_id })
  }

  $: options = {
    headerToolbar: {
      start: "",
      center: "",
      end: "prevYear,prev,today,next,nextYear",
    },
    buttonText: {
      today: todayText,
    },
    footerToolbar: {
      start: "",
      center: "",
      end: "",
    },
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    events: getEvents(),
    eventClick: function (info) {
      handleEventClick(info)
    },
    // eventTimeFormat to override default meridiem to "short"
  }
</script>

<div class="calendar" use:styleable={$component.styles}>
  <FullCalendar {options} />
</div>

<style>
  .calendar :global(.fc-button-primary) {
    --fc-button-text-color: var(--spectrum-global-color-gray-50, #fff);
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
      var(--primaryColor, var(--spectrum-global-color-blue-500))
    );
    --fc-button-active-border-color: var(
      --primaryColorHover,
      var(--primaryColor, var(--spectrum-global-color-blue-500))
    );
    box-shadow: none;
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
  .calendar :global(.fc-event-time) {
    color: var(--spectrum-alias-text-color, inherit);
  }

  .calendar :global(.fc-button) {
    color: var(--spectrum-alias-heading-text-color);
    font-weight: 700;
  }

  /* Specific radiuses (radii?) for first and last buttons */
  .calendar :global(.fc-prevYear-button) {
    border-top-left-radius: var(--buttonBorderRadius, 16px);
    border-bottom-left-radius: var(--buttonBorderRadius, 16px);
  }
  .calendar :global(.fc-nextYear-button) {
    border-top-right-radius: var(--buttonBorderRadius, 16px);
    border-bottom-right-radius: var(--buttonBorderRadius, 16px);
  }
</style>
