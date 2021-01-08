<script>
  import BottomDrawer from "components/common/BottomDrawer.svelte"
  import { Button } from "@budibase/bbui"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import { slide } from "svelte/transition"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"

  export let query
  export let parameters = {}

  $: console.log("CUSTOM PARAMS", parameters)

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.selectedComponentId,
    components: $store.components,
    screen: $currentAsset,
    tables: $backendUiStore.tables,
  }).map(property => ({
    ...property,
    category: property.type === "instance" ? "Component" : "Table",
    label: property.readableBinding,
    path: property.runtimeBinding,
  }))

  function closeDatabindingDrawer() {
    store.update(state => {
      state.bottomDrawerVisible = false
      return state
    })
  }

  function saveComponentQuery() {
    // save the parameters to the datasource of the component
  }
</script>

{#if query}
  <BottomDrawer title={'Query'} onClose={closeDatabindingDrawer}>
    <div slot="buttons">
      <Button blue thin on:click={saveComponentQuery}>Save</Button>
    </div>
    <div class="drawer-contents" slot="body">
      <pre>{query.queryString}</pre>
      <ParameterBuilder
        bind:customParams={parameters}
        parameters={query.parameters}
        bindings={bindableProperties} />
    </div>
  </BottomDrawer>
{/if}

<style>
  .drawer-contents {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
  }
</style>
