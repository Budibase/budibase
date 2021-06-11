<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  export let dataProvider
  export let noRowsMessage

  const { API, styleable, builderStore, Provider } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  $: rows = dataProvider?.rows ?? []
  $: loaded = dataProvider?.loaded ?? true
</script>

<div use:styleable={$component.styles}>
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
</div>

<style>
  .noRows {
    color: var(--grey-6);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    display: grid;
    place-items: center;
  }
  .noRows i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--grey-5);
  }
</style>
