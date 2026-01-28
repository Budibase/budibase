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
  export let dataProvider: DataProvider
  export let eventStart: string // can haz type?
  export let eventEnd: string // can haz type?
  export let eventTitle: string
  export let eventDesc: string
  export let onClick: any // Also can has type?

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
      start: "title",
      center: "",
      end: "prevYear,prev,next,nextYear",
    },
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    events: getEvents(),
    eventClick: function (info) {
      handleEventClick(info)
    },
  }
</script>

<div use:styleable={$component.styles}>
  <FullCalendar {options} />
</div>
