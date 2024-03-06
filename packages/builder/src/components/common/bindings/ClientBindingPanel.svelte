<script>
  import BindingPanel from "./BindingPanel.svelte"
  import { previewStore, snippets } from "stores/builder"
  import { onMount } from "svelte"

  export let bindings = []
  export let valid
  export let value = ""
  export let allowJS = false
  export let allowHelpers = true
  export let autofocusEditor = false

  $: enrichedBindings = enrichBindings(bindings)

  // Ensure bindings have the correct categories
  const enrichBindings = bindings => {
    if (!bindings?.length) {
      return bindings
    }
    return bindings?.map(binding => ({
      ...binding,
      type: null,
    }))
  }

  onMount(previewStore.requestComponentContext)
</script>

<BindingPanel
  bind:valid
  bindings={enrichedBindings}
  context={$previewStore.selectedComponentContext}
  snippets={$snippets}
  {value}
  {allowJS}
  {allowHelpers}
  {autofocusEditor}
  on:change
/>
