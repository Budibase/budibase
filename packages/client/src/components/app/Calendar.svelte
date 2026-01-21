<script lang="ts">
  import { getContext } from "svelte"

  import "@fullcalendar/core/locales-all"
  import FullCalendar from "svelte-fullcalendar"
  import dayGridPlugin from "@fullcalendar/daygrid"
  import timeGridPlugin from "@fullcalendar/timegrid"
  import listPlugin from "@fullcalendar/list"

  export let title: string

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  let options = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
  }
</script>

<div use:styleable={$component.styles}>
  <FullCalendar {options} />
</div>
