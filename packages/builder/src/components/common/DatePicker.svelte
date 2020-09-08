<script>
  // import flatpickr from "flatpickr"
  // import "flatpickr/dist/flatpickr.css"
  // import { onMount } from "svelte"
  import { Label, Input } from "@budibase/bbui"

  export let label
  export let datetime

  let date = datetime.substring(0, 10)
  let time = datetime.substring(11, 16)

  $: console.log({ datetime, date, time })

  // TODO: update to use proper date parsing logic - dayJS or similar
  $: datetime = `${date}T${time}:00.000Z`
</script>

<div class="bb-margin-m">
  <Label small forAttr={'datepicker-label'}>{label}</Label>
  <input type="date" bind:value={date} />
  <input type="time" bind:value={time} />
</div>