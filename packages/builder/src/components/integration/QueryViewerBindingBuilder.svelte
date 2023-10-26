<script>
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { getUserBindings } from "builderStore/dataBinding"
  import { IntegrationTypes } from "constants/backend"
  export let queryBindings = []
  export let source

  const userBindings = getUserBindings()

  let internalBindings = queryBindings.reduce((acc, binding) => {
    acc[binding.name] = {
      value: binding.default,
      extendedType: binding.extendedType,
    }
    return acc
  }, {})

  let extendedTypes =
    source === IntegrationTypes.MONGODB
      ? ["Date", "Decimal128", "Long", "ObjectId"]
      : undefined
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
  {extendedTypes}
  on:change
/>
