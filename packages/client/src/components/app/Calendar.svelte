<script lang="ts">
  import { getContext } from "svelte"

  import "@fullcalendar/core/locales-all"
  import FullCalendar from "svelte-fullcalendar"
  import dayGridPlugin from "@fullcalendar/daygrid"
  import timeGridPlugin from "@fullcalendar/timegrid"
  import listPlugin from "@fullcalendar/list"
  import DataProvider from "./DataProvider.svelte"

  export let title: string
  export let dataProvider: DataProvider
  export let eventStart: string // can haz type?
  export let eventEnd: string // can haz type?
  export let eventTitle: string
  export let eventDesc: string

  console.log({ dataProvider, eventStart, eventEnd })

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  const getEvents = () => {
    return dataProvider.rows.map((row: any) => {
      console.log({
        title: row[eventTitle],
        start: row[eventStart],
        end: row[eventEnd],
      })
      return {
        title: row[eventTitle],
        start: row[eventStart],
        end: row[eventEnd],
      }
    })
  }

  console.log(getEvents())
  let options = {
    headerToolbar: {
      start: "title",
      center: "",
      end: "prevYear,prev,next,nextYear",
    },
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    events: getEvents(),
  }
</script>

<div use:styleable={$component.styles}>
  <FullCalendar {options} />
</div>
