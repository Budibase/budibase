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

  $: rows = dataProvider?.rows ?? []
  $: loaded = dataProvider?.loaded ?? true
</script>

<Container {direction} {hAlign} {vAlign} {gap} wrap>
  {#if $component.empty}
    <Placeholder />
  {:else if rows.length > 0}
    {#each rows as row}
      <Provider data={row}>
        <slot />
      </Provider>
    {/each}
  {:else if loaded && noRowsMessage}
    <div class="noRows"><i class="ri-list-check-2" />{noRowsMessage}</div>
  {/if}
</Container>

<style>
  .noRows {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    display: grid;
    place-items: center;
  }
  .noRows i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
