<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"
  import Container from "./Container.svelte"

  export let dataProvider
  export let noRowsMessage
  export let direction
  export let hAlign
  export let vAlign
  export let gap

  const { Provider } = getContext("sdk")
  const component = getContext("component")
  const loading = getContext("loading")

  // If the parent DataProvider is loading, fill the rows array with a number of empty objects corresponding to the DataProvider's page size; this allows skeleton loader components to be rendered further down the tree.
  $: rows = $loading
    ? new Array(dataProvider.limit > 20 ? 20 : dataProvider.limit).fill({})
    : dataProvider?.rows
</script>

<Container {direction} {hAlign} {vAlign} {gap} wrap>
  {#if $component.empty}
    <Placeholder />
  {:else if !$loading && rows.length === 0}
    <div class="noRows"><i class="ri-list-check-2" />{noRowsMessage}</div>
  {:else}
    {#each rows as row, index}
      <Provider data={{ ...row, index }}>
        <slot />
      </Provider>
    {/each}
  {/if}
</Container>

<style>
  .noRows {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    display: grid;
    place-items: center;
    grid-column: 1 / -1;
  }
  .noRows i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
