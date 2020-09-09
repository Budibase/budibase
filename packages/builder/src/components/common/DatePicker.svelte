<script>
  import Flatpickr from "svelte-flatpickr"
  import { Label, DatePicker } from "@budibase/bbui"

  export let label
  export let value
</script>

<div class="bb-margin-m">
  <Label small forAttr={'datepicker-label'}>{label}</Label>
  <DatePicker placeholder={label} bind:value />
</div>
