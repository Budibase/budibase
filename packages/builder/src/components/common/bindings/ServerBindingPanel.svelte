<script>
  import BindingPanel from "./BindingPanel.svelte"
  import { snippets } from "@/stores/builder"

  export let bindings = []
  export let value = ""
  export let allowJS = false
  export let context = null

  $: enrichedBindings = enrichBindings(bindings)

  // Ensure bindings have the correct properties
  const enrichBindings = bindings => {
    return bindings?.map(binding => ({
      ...binding,
      readableBinding: binding.readableBinding || binding.label,
      runtimeBinding: binding.runtimeBinding || binding.path,
    }))
  }
</script>

<BindingPanel
  bindings={enrichedBindings}
  snippets={$snippets}
  {value}
  {allowJS}
  {context}
  on:change
/>
