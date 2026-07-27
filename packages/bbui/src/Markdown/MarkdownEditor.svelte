<script lang="ts">
  import type EasyMDE from "easymde"
  import { onDestroy } from "svelte"
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
  interface EditorInstance extends EasyMDE {
    togglePreview: () => void
    value: (_value?: string) => string
  }
  let mde: EditorInstance | null = null
  let blurBoundTo: EditorInstance | null = null

  const bindBlurHandler = (editor: EditorInstance) => {
    if (blurBoundTo === editor) {
      return
    }
    if (blurBoundTo) {
      blurBoundTo.codemirror.off("blur", update)
    }
    editor.codemirror.on("blur", update)
    blurBoundTo = editor
  }

  // Ensure the value is updated if the value prop changes outside the editor's
  // control
  $: checkValue(mde, value)
  $: if (mde) {
    bindBlurHandler(mde)
  }
  $: if ((readonly || disabled) && mde) {
    mde.togglePreview?.()
  }

  const checkValue = (editor: EditorInstance | null, val: string | null) => {
    if (editor && val !== latestValue) {
      editor.value(val ?? "")
    }
  }

  const update = () => {
    if (!mde) {
      return
    }
    latestValue = mde.value()
    dispatch("change", latestValue)
  }

  onDestroy(() => {
    if (blurBoundTo) {
      blurBoundTo.codemirror.off("blur", update)
    }
  })
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
      ...easyMDEOptions,
      toolbar: disabled || readonly ? false : easyMDEOptions?.toolbar,
    }}
  />
{/key}
