<script>
  import Flatpickr from "svelte-flatpickr"
  import { Label, DatePicker } from "@budibase/bbui"

  export let label
  export let value

  function onChange(event) {
    const [selectedDates] = event.detail
    value = selectedDates[0]
  }
</script>

<div class="bb-margin-m">
  <Label small forAttr={'datepicker-label'}>{label}</Label>
  <DatePicker placeholder={label} on:change={onChange} {value} />
</div>
