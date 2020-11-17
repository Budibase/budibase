<script>
  import { onMount } from "svelte"
  import { componentStore } from "../store"
  import Component from "./Component.svelte"

  let frontendDefinition
  let loaded = false
  $: pageDefinition = frontendDefinition?.page?.props

  onMount(async () => {
    frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
    await componentStore.actions.loadComponentLibrary()
    loaded = true
    console.log(frontendDefinition)
  })
</script>

{#if loaded}
  <Component definition={pageDefinition} />
{/if}
