<script>
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { getUserBindings } from "@/dataBinding"

  export let queryBindings = []

  const userBindings = getUserBindings()

  let internalBindings = queryBindings.reduce((acc, binding) => {
    acc[binding.name] = binding.default
    return acc
  }, {})
</script>

<KeyValueBuilder
  bind:object={internalBindings}
  tooltip="Set the name of the binding which can be used in Handlebars statements throughout your query"
  name="binding"
  customButtonText="Bindings"
  headings
  keyPlaceholder="Binding name"
  valuePlaceholder="Default"
  bindings={[...userBindings]}
  bindingDrawerLeft="260px"
  allowHelpers={false}
  on:change
/>
