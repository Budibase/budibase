<script>
  import { Select } from "@budibase/bbui"
  import { makePropSafe } from "@budibase/string-templates"
  import { currentAsset, store } from "builderStore"
  import { findComponentPath } from "builderStore/storeUtils"
  import { createEventDispatcher, onMount } from "svelte"

  export let value
  export let onChange

  const dispatch = createEventDispatcher()
  const getValue = component => `{{ literal ${makePropSafe(component._id)} }}`

  $: path = findComponentPath($currentAsset.props, $store.selectedComponentId)
  $: providers = path.filter(
    component =>
      component._component === "@budibase/standard-components/dataprovider"
  )

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
