<script>
  import flatpickr from "flatpickr"
  import "flatpickr/dist/flatpickr.css"
  import { onMount } from "svelte"
  import { Input } from "@budibase/bbui"

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
  <label class="uk-form-label">{label}</label>
  <Input bind:this={input} />
</div>
