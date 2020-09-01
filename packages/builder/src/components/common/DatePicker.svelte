<script>
  import flatpickr from "flatpickr"
  import "flatpickr/dist/flatpickr.css"
  import { onMount } from "svelte"
  import { Label, Input } from "@budibase/bbui"

  export let value
  export let label

  let input
  let fpInstance

  $: if (fpInstance) fpInstance.setDate(value)

  onMount(() => {
    fpInstance = flatpickr(input, {})

    fpInstance.config.onChange.push(selectedDates => {
      if (selectedDates.length > 0) value = new Date(selectedDates[0])
    })

    return fpInstance
  })
</script>

<div class="bb-margin-m">
  <Label small forAttr={'datepicker-label'}>{label}</Label>
  <Input thin bind:this={input} />
</div>

<!-- TODO: Verify DatePicker Input works as expected when datetime property used again
in CreateEditColumn -->
