<script>
  import { DatePicker } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { styleable, setBindableValue } = getContext("sdk")
  const component = getContext("component")

  export let placeholder

  let value
  $: setBindableValue(value, $component.id)

  function handleChange(event) {
    const [fullDate] = event.detail
    value = fullDate
  }
</script>

<div use:styleable={$component.styles}>
  <DatePicker {placeholder} on:change={handleChange} {value} />
</div>
