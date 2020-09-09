<script>
  import Flatpickr from "svelte-flatpickr"
  import { Label, Input } from "@budibase/bbui"
  import "flatpickr/dist/flatpickr.css"

  export let label
  export let value

  const PICKER_OPTIONS = {
    enableTime: true,
    // element: "#date-picker"
  }

</script>

<div class="bb-margin-m">
  <Label small forAttr={'datepicker-label'}>{label}</Label>
  <Flatpickr 
    placeholder={label}
    options={PICKER_OPTIONS}
    bind:value
  />
</div>

<style>
  :global(.flatpickr-input) {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    color: var(--ink);
    border-radius: 5px;
    border: none;
    background-color: var(--grey-2);
    padding: var(--spacing-m);
    font-size: var(--font-size-xs);
    margin: 0;
    outline-color: var(--blue);
  }
</style>