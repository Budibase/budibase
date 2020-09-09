<script>
  import Flatpickr from "svelte-flatpickr"
  import { DatePicker } from "@budibase/bbui"
  import "flatpickr/dist/flatpickr.css"

  export let placeholder
  export let value

  export let _bb

  function handleChange(event) {
    const [fullDate, dateStr, instance] = event.detail
    if (_bb) {
      _bb.setBinding("value", fullDate)
    }
  }
</script>

<DatePicker {placeholder} on:change={handleChange} {value} />
