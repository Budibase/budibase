<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  export let dataProvider
  export let noRowsMessage

  const { API, styleable, builderStore, Provider } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  $: rows = dataProvider?.rows ?? []
  $: loaded = dataProvider?.loaded ?? false
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
    <Placeholder text={noRowsMessage} />
  {/if}
</div>
