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
  export let showNavButtons: boolean
  export let buttonLocation:
    | string
    | [
        "Top left",
        "Top centre",
        "Top right",
        "Bottom left",
        "Bottom centre",
        "Bottom right",
      ]
  export let calendarType:
    | string
    | ["dayGridMonth", "dayGridWeek", "timeGridDay", "listWeek"]

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  let calendarRef: FullCalendar | null = null

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

  const createEmptyToolbar = () => ({
    start: "",
    center: "",
    end: "",
  })

  let headerToolbar = createEmptyToolbar()
  let footerToolbar = createEmptyToolbar()

  $: {
    const buttons =
      showNavButtons === false ? "" : "prevYear,prev,today,next,nextYear"

    headerToolbar = createEmptyToolbar()
    footerToolbar = createEmptyToolbar()

    switch (buttonLocation) {
      case "Top left":
        headerToolbar.start = buttons
        break
      case "Top centre":
        headerToolbar.center = buttons
        break
      case "Top right":
        headerToolbar.end = buttons
        break
      case "Bottom left":
        footerToolbar.start = buttons
        break
      case "Bottom centre":
        footerToolbar.center = buttons
        break
      case "Bottom right":
        footerToolbar.end = buttons
        break
      default:
        footerToolbar.end = buttons
        break
    }
  }

  $: options = {
    headerToolbar,
    buttonText: {
      today: todayText,
    },
    footerToolbar,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: calendarType || "dayGridMonth",
    events: getEvents(),
    eventClick: function (info) {
      handleEventClick(info)
    },
    // eventTimeFormat to override default meridiem to "short"
    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      meridiem: "short",
    },
  }

  $: if (calendarRef && calendarType) {
    const api = calendarRef.getAPI?.()
    if (api && api.view.type !== calendarType) {
      api.changeView(calendarType)
    }
  }
</script>

<div class="calendar" use:styleable={$component.styles} style="height: 400px">
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
