<script>
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { getUserBindings } from "@/dataBinding"
  import { createEventDispatcher } from "svelte"

  export let queryBindings = []

  const dispatch = createEventDispatcher()
  const userBindings = getUserBindings()

  let internalBindings = queryBindings.reduce((acc, binding) => {
    acc[binding.name] = binding.default
    return acc
  }, {})

  function onBindingsChange(event) {
    const fields = Array.isArray(event?.detail)
      ? event.detail
      : event?.detail?.fields || []

    dispatch("change", fields)
  }
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
  allowHelpers={false}
  on:change={onBindingsChange}
/>
