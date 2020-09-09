<script>
  import Flatpickr from "svelte-flatpickr"
  import { Label, Input } from "@budibase/bbui"
  import "flatpickr/dist/flatpickr.css"

  export let placeholder
  export let value

  export let _bb

  const PICKER_OPTIONS = {
    enableTime: true,
  }

  function handleChange(event) {
    const [selectedDates, dateStr, instance] = event.detail
    if (_bb) {
      _bb.setBinding("value", dateStr)
    }
  }
</script>

<Flatpickr
  {placeholder}
  options={PICKER_OPTIONS}
  on:change={handleChange}
  {value} />