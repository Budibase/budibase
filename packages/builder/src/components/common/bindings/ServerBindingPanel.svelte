<script>
  import BindingPanel from "./BindingPanel.svelte"

  export let bindings = []
  export let valid
  export let value = ""
  export let allowJS = false

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
  bind:valid
  bindings={enrichedBindings}
  {value}
  {allowJS}
  on:change
/>
