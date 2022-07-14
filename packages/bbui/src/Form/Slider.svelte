<script>
  import Field from "./Field.svelte"
  import Slider from "./Core/Slider.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let min = 0
  export let max = 100
  export let step = 1
  export let disabled = false
  export let error = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {label} {labelPosition} {error}>
  <Slider {disabled} {value} {min} {max} {step} on:change={onChange} />
</Field>
