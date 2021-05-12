<script>
  import { getContext } from "svelte"

  export let dataProviderId

  const component = getContext("component")
  const { styleable, ActionTypes, builderStore } = getContext("sdk")
  const dataContext = getContext("context")

  $: dataProviderContext = dataContext?.[dataProviderId]
  $: pageNumber = dataProviderContext?.pageNumber ?? 1
  $: hasPrevPage = dataProviderContext?.hasPrevPage ?? false
  $: hasNextPage = dataProviderContext?.hasNextPage ?? false
  $: prevPage = dataContext?.[`${dataProviderId}_${ActionTypes.PrevPage}`]
  $: nextPage = dataContext?.[`${dataProviderId}_${ActionTypes.NextPage}`]
  $: hasValidContext = dataProviderContext != null && nextPage != null
</script>

{#if hasValidContext}
  <div>
    Page {pageNumber}
  </div>
{:else if builderStore.inBuilder}
  <div>Choose a data provider to control with this pagination component.</div>
{/if}
