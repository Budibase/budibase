<script>
  import SpectrumMDE from "./SpectrumMDE.svelte"
  import { createEventDispatcher, onMount } from "svelte"

  export let value = null
  export let height = "300px"
  export let placeholder = null
  export let id = null

  const dispatch = createEventDispatcher()

  let latestValue
  let mde

  // Ensure the value is updated if the value prop changes outside the editor's
  // control
  $: checkValue(value)

  const checkValue = val => {
    if (mde && val !== latestValue) {
      mde.value(val)
    }
  }

  const debounce = (fn, interval) => {
    let timeout
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(fn, interval)
    }
  }

  const update = () => {
    latestValue = mde.value()
    dispatch("change", latestValue)
  }

  // Debounce the update function to avoid spamming it constantly
  const debouncedUpdate = debounce(update, 250)

  onMount(() => {
    mde.codemirror.on("change", debouncedUpdate)
  })
</script>

<SpectrumMDE
  bind:mde
  scroll={true}
  {height}
  {id}
  easyMDEOptions={{
    initialValue: value,
    placeholder,
  }}
/>
