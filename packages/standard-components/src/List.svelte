<script>
  import { getContext } from "svelte"

  export let dataProviderId
  export let noRowsMessage

  const { API, styleable, builderStore, Provider } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  $: data = context[dataProviderId]?.rows ?? []
  $: loaded = context[dataProviderId]?.loaded ?? false
</script>

<div use:styleable={$component.styles}>
  {#if data.length > 0}
    {#if $component.children === 0 && $builderStore.inBuilder}
      <p><i class="ri-image-line" />Add some components to display.</p>
    {:else}
      {#each data as row}
        <Provider data={row}>
          <slot />
        </Provider>
      {/each}
    {/if}
  {:else if loaded && noRowsMessage}
    <p><i class="ri-list-check-2" />{noRowsMessage}</p>
  {/if}
</div>

<style>
  p {
    margin: 0 var(--spacing-m);
    background-color: var(--grey-2);
    color: var(--grey-6);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    border-radius: var(--border-radius-s);
    display: grid;
    place-items: center;
  }
  p i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--grey-5);
  }
</style>
