<script>
  import { DataList } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store, allScreens, backendUiStore, currentAsset } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"

  const dispatch = createEventDispatcher()

  export let value = ""

  $: urls = getUrls()

  const handleBlur = () => dispatch("change", value)

  // this will get urls of all screens, but only
  // choose detail screens that are usable in the current context
  // and substitute the :id param for the actual {{ ._id }} binding
  const getUrls = () => {
    const urls = [
      ...$allScreens
        .filter(screen => !screen.props._component.endsWith("/rowdetail"))
        .map(screen => ({
          name: screen.props._instanceName,
          url: screen.routing.route,
          sort: screen.props._component,
        })),
    ]

    const bindableProperties = fetchBindableProperties({
      componentInstanceId: $store.selectedComponentId,
      components: $store.components,
      screen: $currentAsset,
      tables: $backendUiStore.tables,
      queries: $backendUiStore.queries,
    })

    const detailScreens = $allScreens.filter(screen =>
      screen.props._component.endsWith("/rowdetail")
    )

    for (let detailScreen of detailScreens) {
      const idBinding = bindableProperties.find(p => {
        if (
          p.type === "context" &&
          p.runtimeBinding.endsWith("._id") &&
          p.table
        ) {
          const tableId =
            typeof p.table === "string" ? p.table : p.table.tableId
          return tableId === detailScreen.props.table
        }
        return false
      })

      if (idBinding) {
        urls.push({
          name: detailScreen.props._instanceName,
          url: detailScreen.routing.route.replace(
            ":id",
            `{{ ${idBinding.runtimeBinding} }}`
          ),
          sort: detailScreen.props._component,
        })
      }
    }

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
