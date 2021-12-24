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
      readableBinding: binding.label || binding.readableBinding,
      runtimeBinding: binding.path || binding.runtimeBinding,
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
