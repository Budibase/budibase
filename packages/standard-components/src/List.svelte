<script>
  import { getContext } from "svelte"
  import { isEmpty } from "lodash/fp"

  export let datasource = []

  const { API, styleable, Provider, builderStore, ActionTypes } = getContext(
    "sdk"
  )
  const component = getContext("component")
  let rows = []
  let loaded = false

  $: fetchData(datasource)
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => fetchData(datasource),
      metadata: { datasource },
    },
  ]

  async function fetchData(datasource) {
    if (!isEmpty(datasource)) {
      rows = await API.fetchDatasource(datasource)
    }
    loaded = true
  }
</script>

<Provider {actions}>
  {#if rows.length > 0}
    <div use:styleable={$component.styles}>
      {#if $component.children === 0 && $builderStore.inBuilder}
        <p>Add some components too</p>
      {:else}
        {#each rows as row}
          <Provider data={row}>
            <slot />
          </Provider>
        {/each}
      {/if}
    </div>
  {:else if loaded && $builderStore.inBuilder}
    <div use:styleable={$component.styles}>
      <p>Feed me some data</p>
    </div>
  {/if}
</Provider>

<style>
  p {
    display: grid;
    place-items: center;
    background: #f5f5f5;
    border: #ccc 1px solid;
    padding: var(--spacing-m);
  }
</style>
