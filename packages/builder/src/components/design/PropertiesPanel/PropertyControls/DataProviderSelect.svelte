<script>
  import { Select } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { findComponentPath } from "builderStore/storeUtils"

  export let value

  $: path = findComponentPath($currentAsset.props, $store.selectedComponentId)
  $: console.log(path)
  $: providers = path.filter(
    component =>
      component._component === "@budibase/standard-components/dataprovider"
  )
</script>

<Select thin secondary {value} on:change>
  <option value="">Choose option</option>
  {#if providers}
    {#each providers as component}
      <option value={component._id}>{component._instanceName}</option>
    {/each}
  {/if}
</Select>
