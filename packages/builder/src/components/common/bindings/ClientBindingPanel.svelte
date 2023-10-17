<script>
  import BindingPanel from "./BindingPanel.svelte"

  export let bindings = []
  export let valid
  export let value = ""
  export let allowJS = false
  export let allowHelpers = true

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
</script>

<BindingPanel
  bind:valid
  bindings={enrichedBindings}
  {value}
  {allowJS}
  {allowHelpers}
  on:change
/>
