<script>
  import BindingPanel from "./BindingPanel.svelte"
  import { previewStore, snippets } from "@/stores/builder"
  import { onMount } from "svelte"

  export let bindings = []
  export let value = ""
  export let allowHBS = true
  export let allowJS = false
  export let allowHelpers = true
  export let autofocusEditor = false
  export let context = null

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
  bindings={enrichedBindings}
  context={{ ...$previewStore.selectedComponentContext, ...context }}
  snippets={$snippets}
  {value}
  {allowHBS}
  {allowJS}
  {allowHelpers}
  {autofocusEditor}
  on:change
/>
