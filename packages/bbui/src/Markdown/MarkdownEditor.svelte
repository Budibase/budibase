<script>
  import SpectrumMDE from "./SpectrumMDE.svelte"
  import { createEventDispatcher, onMount } from "svelte"

  export let value
  export let height = "300px"
  export let placeholder

  const dispatch = createEventDispatcher()

  let latestValue
  let mde

  $: checkValue(value)

  const checkValue = val => {
    if (mde && val !== latestValue) {
      mde.value(val)
    }
  }

  onMount(() => {
    mde.codemirror.on("change", () => {
      latestValue = mde.value()
      dispatch("change", latestValue)
    })
  })
</script>

<SpectrumMDE
  bind:mde
  scroll={true}
  {height}
  easyMDEOptions={{
    initialValue: value,
    placeholder,
  }}
/>
