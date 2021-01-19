<script>
  import { DataList } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store, allScreens, currentAsset } from "builderStore"
  import { getBindableProperties } from "builderStore/dataBinding"

  export let value = ""

  $: urls = getUrls($allScreens, $currentAsset, $store.selectedComponentId)

  // Update value on blur
  const dispatch = createEventDispatcher()
  const handleBlur = () => dispatch("change", value)

  // Get all valid screen URL, as well as detail screens which can be used in
  // the current data context
  const getUrls = (screens, asset, componentId) => {
    // Get all screens which aren't detail screens
    let urls = screens
      .filter(screen => !screen.props._component.endsWith("/rowdetail"))
      .map(screen => ({
        name: screen.props._instanceName,
        url: screen.routing.route,
        sort: screen.props._component,
      }))

    // Add detail screens enriched with the current data context
    const bindableProperties = getBindableProperties(asset.props, componentId)
    screens
      .filter(screen => screen.props._component.endsWith("/rowdetail"))
      .forEach(detailScreen => {
        // Find any _id bindings that match the detail screen's table
        const binding = bindableProperties.find(p => {
          return (
            p.type === "context" &&
            p.runtimeBinding.endsWith("._id") &&
            p.tableId === detailScreen.props.table
          )
        })
        if (binding) {
          urls.push({
            name: detailScreen.props._instanceName,
            url: detailScreen.routing.route.replace(
              ":id",
              `{{ ${binding.runtimeBinding} }}`
            ),
            sort: detailScreen.props._component,
          })
        }
      })

    return urls
  }
</script>

<div>
  <DataList
    editable
    secondary
    extraThin
    on:blur={handleBlur}
    on:change
    bind:value>
    <option value="" />
    {#each urls as url}
      <option value={url.url}>{url.name}</option>
    {/each}
  </DataList>
</div>

<style>
  div {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
  }
  div :global(> div) {
    flex: 1 1 auto;
  }
</style>
