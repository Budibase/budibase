<script>
  import { Select } from "@budibase/bbui"
  import { makePropSafe } from "@budibase/string-templates"
  import { currentAsset, store } from "builderStore"
  import { findComponentPath } from "builderStore/storeUtils"

  export let value

  $: path = findComponentPath($currentAsset.props, $store.selectedComponentId)
  $: providers = path.filter(
    component =>
      component._component === "@budibase/standard-components/dataprovider"
  )
</script>

<Select
  {value}
  on:change
  options={providers}
  getOptionLabel={component => component._instanceName}
  getOptionValue={component => `{{ literal ${makePropSafe(component._id)} }}`}
/>
