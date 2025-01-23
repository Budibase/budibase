<script lang="ts">
  import BindingPanel from "./BindingPanel.svelte"
  import { previewStore, snippets } from "@/stores/builder"
  import { onMount } from "svelte"

  export let bindings: any[] = []
  export let value = ""
  export let allowHBS = true
  export let allowJS = false
  export let allowHelpers = true
  export let autofocusEditor = false
  export let context: any = null

  $: enrichedBindings = enrichBindings(bindings)

  // Ensure bindings have the correct categories
  const enrichBindings = (bindings: any[]) => {
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
