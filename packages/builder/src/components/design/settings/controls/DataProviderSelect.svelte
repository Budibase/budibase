<script>
  import { Select } from "@budibase/bbui"
  import { makePropSafe } from "@budibase/string-templates"
  import { currentAsset, componentStore } from "stores/frontend"
  import { findComponentPath } from "stores/frontend/components/utils"

  export let value

  const getValue = component => `{{ literal ${makePropSafe(component._id)} }}`

  $: path = findComponentPath(
    $currentAsset?.props,
    $componentStore.selectedComponentId
  )
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
