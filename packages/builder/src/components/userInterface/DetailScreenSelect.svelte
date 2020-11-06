<script>
  import { DataList } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { allScreens } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value = ""

  $: urls = getUrls()

  const handleBlur = () => dispatch("change", value)

  const getUrls = () => {
    return [
      ...$allScreens
        .filter(
          screen =>
            screen.props._component.endsWith("/rowdetail") ||
            screen.route.endsWith(":id")
        )
        .map(screen => ({
          name: screen.props._instanceName,
          url: screen.route,
          sort: screen.props._component,
        })),
    ]
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
