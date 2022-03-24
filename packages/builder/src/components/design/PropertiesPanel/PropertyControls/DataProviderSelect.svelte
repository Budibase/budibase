<script>
  import { Select } from "@budibase/bbui"
  import { makePropSafe } from "@budibase/string-templates"
  import { currentAsset, store } from "builderStore"
  import { findComponentPath } from "builderStore/componentUtils"
  import { createEventDispatcher, onMount } from "svelte"

  export let value

  const dispatch = createEventDispatcher()
  const getValue = component => `{{ literal ${makePropSafe(component._id)} }}`

  $: path = findComponentPath($currentAsset?.props, $store.selectedComponentId)
  $: providers = path.filter(c => c._component?.endsWith("/dataprovider"))

  // Set initial value to closest data provider
  onMount(() => {
    const valid = value && providers.find(x => getValue(x) === value) != null
    if (!valid && providers.length) {
      dispatch("change", getValue(providers[providers.length - 1]))
    }
  })
</script>

<Select
  {value}
  placeholder={null}
  on:change
  options={providers}
  getOptionLabel={component => component._instanceName}
  getOptionValue={getValue}
/>
