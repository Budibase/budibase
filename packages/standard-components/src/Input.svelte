<script>
  import { getContext } from "svelte"

  const { styleable, setBindableValue } = getContext("sdk")
  const component = getContext("component")

  // Keep bindable value up to date
  let value
  $: setBindableValue(value, $component.id)
</script>

<input bind:value on:change={onchange} use:styleable={$component.styles} />
