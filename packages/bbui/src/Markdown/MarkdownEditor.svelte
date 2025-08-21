<script lang="ts">
  import SpectrumMDE from "./SpectrumMDE.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: string | null = null
  export let height: string | null = null
  export let placeholder: string | null = null
  export let id: string | null = null
  export let fullScreenOffset: { x: string; y: string } | null = null
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let easyMDEOptions: Record<string, any> = {}

  const dispatch = createEventDispatcher()

  let latestValue: string | null
  let mde: any

  // Ensure the value is updated if the value prop changes outside the editor's
  // control
  $: checkValue(value)
  $: mde?.codemirror.on("blur", update)
  $: if (readonly || disabled) {
    mde?.togglePreview()
  }

  const checkValue = (val: string | null) => {
    if (mde && val !== latestValue) {
      mde.value(val)
    }
  }

  const update = () => {
    latestValue = mde.value()
    dispatch("change", latestValue)
  }
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
