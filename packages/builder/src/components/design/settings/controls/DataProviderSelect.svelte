<script>
  import { Select } from "@budibase/bbui"
  import { makePropSafe } from "@budibase/string-templates"
  import { currentAsset, store } from "builderStore"
  import { findComponentPath } from "builderStore/componentUtils"

  export let value

  const getValue = component => `{{ literal ${makePropSafe(component._id)} }}`

  $: path = findComponentPath($currentAsset?.props, $store.selectedComponentId)
  $: providers = path.filter(c => c._component?.endsWith("/dataprovider"))
</script>

<Select
  {value}
  placeholder={null}
  on:change
  options={providers}
  getOptionLabel={component => component._instanceName}
  getOptionValue={getValue}
/>
