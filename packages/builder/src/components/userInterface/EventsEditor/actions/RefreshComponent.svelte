<script>
  import { Select, Label, Spacer } from "@budibase/bbui"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import ParameterBuilder from "../../../integration/QueryParameterBuilder.svelte"

  export let parameters

  let components = []

  $: components = componentList($currentAsset)

  // traverse the layout or screen tree
  // and build an array of all available components
  function componentList(asset) {
    const components = []

    function traverse(node) {
      if (node._component) components.push(node)

      if (node._children) node._children.forEach(traverse)

      if (node.props) traverse(node.props)
    }

    traverse(asset.props)

    return components
  }
</script>

<div class="root">
  <Label size="m" color="dark">Component</Label>
  <Select thin secondary bind:value={parameters.componentId}>
    <option value="" />
    {#each components as component}
      <option value={component._id}>{component._instanceName}</option>
    {/each}
  </Select>
</div>
