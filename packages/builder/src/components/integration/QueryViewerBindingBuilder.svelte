<script>
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { getUserBindings } from "builderStore/dataBinding"
  export let bindable = true
  export let queryBindings = []
  export let hideHeading = false

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
