<script>
  import { getContext } from "svelte"

  const { styleable, setBindableValue } = getContext("sdk")
  const component = getContext("component")

  let value

  function onBlur() {
    setBindableValue($component.id, value)
  }
</script>

<input bind:value on:blur={onBlur} use:styleable={$component.styles} />
