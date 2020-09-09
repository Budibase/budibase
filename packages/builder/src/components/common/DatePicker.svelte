<script>
  import Flatpickr from "svelte-flatpickr"
  import { Label, Input } from "@budibase/bbui"
  import 'flatpickr/dist/flatpickr.css'

  const PICKER_OPTIONS = {
    enableTime: true
  }

  export let label
  export let value
</script>

<div class="bb-margin-m">
  <Label small forAttr={'datepicker-label'}>{label}</Label>
  <Flatpickr 
    options={PICKER_OPTIONS}
    placeholder={label}
    bind:value
  />
</div>