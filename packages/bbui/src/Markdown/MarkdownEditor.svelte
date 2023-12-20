<script>
  import SpectrumMDE from "./SpectrumMDE.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let height = null
  export let placeholder = null
  export let id = null
  export let fullScreenOffset = 0
  export let disabled = false
  export let readonly = false
  export let easyMDEOptions

  const dispatch = createEventDispatcher()

  let latestValue
  let mde

  // Ensure the value is updated if the value prop changes outside the editor's
  // control
  $: checkValue(value)
  $: mde?.codemirror.on("blur", debouncedUpdate)
  $: if (readonly || disabled) {
    mde?.togglePreview()
  }

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
</script>

{#key height}
  <SpectrumMDE
    bind:mde
    scroll={true}
    {height}
    {id}
    {fullScreenOffset}
    {disabled}
    easyMDEOptions={{
      initialValue: value,
      placeholder,
      toolbar: disabled || readonly ? false : undefined,
      ...easyMDEOptions,
    }}
  />
{/key}
